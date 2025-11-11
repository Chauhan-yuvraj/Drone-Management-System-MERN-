import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignOptions } from 'jsonwebtoken';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

interface UserPayload {
  _id: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtServcie: JwtService,
    private configService: ConfigService,
  ) {}
  // 1. Sign Up Logic
  async signUp(dto: CreateUserDto) {
    const existingUser = await this.usersService.findOneByEmail(dto.email);

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    return this.usersService.create(dto);
  }

  // 2. Validation Logic (used during the login attempt)
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);

      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  // 3. Token Generation Logic
  async login(user: UserPayload) {
    const { accessToken, refreshToken } = this.getTokens(user._id, user.email);

    await this.usersService.updateRefreshToken(user._id, refreshToken);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // Helper to generate both tokens
  getTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessExpiry = (this.configService.get<string>(
      'ACCESS_TOKEN_EXPIRY',
    ) || '15m') as SignOptions['expiresIn'];
    const refreshExpiry = (this.configService.get<string>(
      'REFRESH_TOKEN_EXPIRY',
    ) || '7d') as SignOptions['expiresIn'];

    // Generate the Access Toekn
    const accessToken = this.jwtServcie.sign(payload, {
      expiresIn: accessExpiry,
    });

    // Generate the Access Toekn
    const refreshToken = this.jwtServcie.sign(payload, {
      expiresIn: refreshExpiry,
    });

    return { accessToken, refreshToken };
  }
}
