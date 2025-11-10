/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtServcie: JwtService,
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

  login(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtServcie.sign(payload),
    };
  }
}
