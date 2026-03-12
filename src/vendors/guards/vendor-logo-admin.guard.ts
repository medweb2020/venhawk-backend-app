import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { VENDOR_LOGO_ADMIN_EMAILS } from '../constants/vendor-logo-admin.constants';
import { UsersService } from '../../users/users.service';

@Injectable()
export class VendorLogoAdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & {
      user?: { email?: string; userId?: string };
    }>();

    const directEmail = String(request.user?.email || '')
      .trim()
      .toLowerCase();
    const auth0Id = String(request.user?.userId || '').trim();

    let email = directEmail;
    if (!email && auth0Id) {
      const syncedUser = await this.usersService.findByAuth0Id(auth0Id);
      email = String(syncedUser?.email || '')
        .trim()
        .toLowerCase();
    }

    const isAllowed = VENDOR_LOGO_ADMIN_EMAILS.some(
      (allowedEmail) => allowedEmail.toLowerCase() === email,
    );

    if (!isAllowed) {
      throw new ForbiddenException(
        'You do not have access to the logo management workspace.',
      );
    }

    return true;
  }
}
