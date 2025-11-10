// netra-backend/src/auth/jwt-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 'jwt' corresponds to the name we gave the strategy in jwt.strategy.ts
// (via the super() call to PassportStrategy(Strategy)).
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
