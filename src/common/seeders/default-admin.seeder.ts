import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../../entities';

@Injectable()
export class DefaultAdminSeeder {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async seed(): Promise<void> {
    const adminEmail = 'admin@kekehyu.com';

    // Check if admin already exists
    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail.toLowerCase() },
    });

    if (existingAdmin) {
      console.log('✓ Default admin account already exists');
      return;
    }

    // Create default admin account
    const hashedPassword = await bcrypt.hash('Admin@12345678', 12);

    const adminUser = this.userRepository.create({
      firstName: 'System',
      lastName: 'Administrator',
      email: adminEmail.toLowerCase(),
      contactNumber: '0000000000',
      password: hashedPassword,
      role: UserRole.ADMIN,
      emailVerified: true,
      isAccountLocked: false,
      failedLoginAttempts: 0,
    });

    await this.userRepository.save(adminUser);

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║          DEFAULT ADMIN ACCOUNT CREATED                 ║');
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log('║ Email:    admin@kekehyu.com                            ║');
    console.log('║ Password: Admin@12345678                               ║');
    console.log('║                                                        ║');
    console.log('║ ⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!                ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
  }
}
