import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log('🔐 Authorization header:', request.headers.authorization);
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('❌ Error:', err);
    console.log('👤 User:', user);
    console.log('ℹ️ Info:', info);

    if (err || !user) {
      throw err || new UnauthorizedException('Authentication failed');
    }
    return user;
  }
}