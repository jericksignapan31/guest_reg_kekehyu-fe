import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../entities';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly requiredRole: UserRole) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== this.requiredRole) {
      throw new ForbiddenException('Only ' + this.requiredRole + ' can access this resource');
    }

    return true;
  }
}
