import { Injectable, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User, UserRole } from '../../entities';
import { LoginDto, RegisterDto } from './dto';
import { validatePasswordStrength } from '../../common/validators/password.validator';

@Injectable()
export class AuthService {
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly LOCK_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds
  private readonly PASSWORD_RESET_EXPIRY = 60 * 60 * 1000; // 1 hour

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { firstName, lastName, middleName, contactNumber, email, password, role } = registerDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new BadRequestException({
        message: 'Password does not meet security requirements',
        errors: passwordValidation.errors,
      });
    }

    // Hash password with higher cost (12 rounds for production security)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = this.userRepository.create({
      firstName,
      lastName,
      middleName,
      contactNumber,
      email,
      password: hashedPassword,
      role: role || UserRole.FRONTDESK,
      emailVerified: false,
      failedLoginAttempts: 0,
      isAccountLocked: false,
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      message: 'User registered successfully. Please verify your email.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email (case-insensitive)
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email exists - return generic message
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.isAccountLocked) {
      if (user.lockedUntil && new Date() < user.lockedUntil) {
        const remainingTime = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
        throw new UnauthorizedException(
          `Account is locked. Please try again in ${remainingTime} minutes.`,
        );
      } else {
        // Unlock account if lock time has expired
        user.isAccountLocked = false;
        user.failedLoginAttempts = 0;
      }
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      // Increment failed login attempts
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= this.MAX_LOGIN_ATTEMPTS) {
        user.isAccountLocked = true;
        user.lockedUntil = new Date(Date.now() + this.LOCK_TIME);
        await this.userRepository.save(user);

        throw new UnauthorizedException(
          `Account locked due to too many failed login attempts. Try again in 15 minutes.`,
        );
      }

      await this.userRepository.save(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0;
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      expiresIn: 3600, // 1 hour in seconds
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.userRepository.findOne({
        where: { id: decoded.sub },
      });

      if (!user || user.isAccountLocked) {
        throw new UnauthorizedException('User account is not available');
      }

      const accessToken = this.generateAccessToken(user);
      return {
        accessToken,
        expiresIn: 3600,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async requestPasswordReset(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if email exists
      return {
        message: 'If that email exists, a password reset link has been sent.',
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = await bcrypt.hash(resetToken, 10);

    user.passwordResetToken = hashedResetToken;
    user.passwordResetExpires = new Date(Date.now() + this.PASSWORD_RESET_EXPIRY);
    await this.userRepository.save(user);

    // TODO: Send reset email with token
    // For now, we'll return the token in development mode only
    if (this.configService.get('NODE_ENV') === 'development') {
      return {
        message: 'Password reset email sent',
        resetToken, // Only for dev - remove in production
      };
    }

    return {
      message: 'If that email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new BadRequestException({
        message: 'New password does not meet security requirements',
        errors: passwordValidation.errors,
      });
    }

    // Find user with matching reset token
    const users = await this.userRepository.find();
    let user: User | undefined;

    for (const u of users) {
      if (
        u.passwordResetToken &&
        u.passwordResetExpires &&
        (await bcrypt.compare(resetToken, u.passwordResetToken))
      ) {
        if (new Date() < new Date(u.passwordResetExpires)) {
          user = u;
          break;
        }
      }
    }

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.failedLoginAttempts = 0;
    user.isAccountLocked = false;

    await this.userRepository.save(user);

    return {
      message: 'Password reset successfully. Please log in with your new password.',
    };
  }

  async validateUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.isAccountLocked) {
      throw new UnauthorizedException('Account is locked');
    }

    return user;
  }

  private generateAccessToken(user: User): string {
    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        type: 'access',
      },
      {
        expiresIn: '1h',
      },
    );
  }

  private generateRefreshToken(user: User): string {
    return this.jwtService.sign(
      {
        sub: user.id,
        type: 'refresh',
      },
      {
        expiresIn: '7d',
        secret: this.configService.get('JWT_SECRET'),
      },
    );
  }
}
