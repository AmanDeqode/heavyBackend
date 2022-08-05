import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessControl } from 'role-acl';
import { grantsObject } from './role.acl';

@Injectable()
export class RolesGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const url = request.originalUrl.split('?')[0].split('/')[1];
    const { user } = request as any;
    const role = user ? user.role : 'consumer';

    if (!url.trim().length) return true;

    const accessControl = new AccessControl(grantsObject);
    const permission = await accessControl
      .can(role)
      .execute(request.method)
      .on(url);

    if (!permission.granted) {
      throw new ForbiddenException(
        'You have no access to perform such action.',
      );
    }

    return permission.granted;
  }
}
