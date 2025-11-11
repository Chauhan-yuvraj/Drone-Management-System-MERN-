import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOneById(id: string): Promise<User | undefined> {
    const user = await this.userModel.findById(id).exec();

    // Explicitly return the found user object or undefined if null
    return user ? user.toObject() : undefined;
  }

  // Helper function to hash passwords
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Method to create a new user
  async create(userDto: CreateUserDto): Promise<User> {
    const hashPassword = await this.hashPassword(userDto.password);

    const newUser = new this.userModel({
      ...userDto,
      password: hashPassword,
    });
    return newUser.save();
  }

  // Method to find a user by email (crucial for  login process)
  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email }).exec();
    return user ? user.toObject() : undefined;
  }
  // Method to update the user's refresh tokens (add the new one)
  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      { $push: { refreshTokens: refreshToken } },
    );
  }
}
