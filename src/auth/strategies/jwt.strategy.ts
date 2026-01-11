import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const secret = configService.get<string>('JWT_SECRET') || 'your-secret-key';
    console.log('🔑 JwtStrategy initialized with secret:', secret);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    console.log('✅ JWT validate() called with payload:', payload);

    const user = await this.authService.validateUser(payload.sub);

    console.log(
      '👤 User found:',
      user ? `${user.email} (${user.id})` : 'NOT FOUND',
    );

    if (!user) {
      console.log('❌ User not found in database');
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      console.log('❌ User is inactive');
      throw new UnauthorizedException('User account is inactive');
    }

    console.log('✅ User validated successfully');
    return { id: user.id, email: user.email, role: user.role };
  }
}