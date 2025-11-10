// netra-backend/src/auth/jwt.strategy.ts (FIXED TYPE ERROR)

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  email: string;
  sub: string; // User ID
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    // SAFETY CHECK: Ensure the secret is defined before passing it
    if (!secret) {
      throw new UnauthorizedException('JWT_SECRET is not configured.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Use the secret string, and the non-null assertion operator (!)
      // is no longer strictly needed if we throw above, but we pass the guaranteed string.
      secretOrKey: secret,
    });
  }

  // ... (rest of the file remains the same for now)
  validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
