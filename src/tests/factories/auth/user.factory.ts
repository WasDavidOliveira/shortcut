import { faker } from '@faker-js/faker';
import { CreateUserModel, UserModel } from '@/types/models/v1/auth.types';
import bcrypt from 'bcrypt';
import UserRepository from '@/repositories/v1/user.repository';
import { LoginInput, RegisterInput } from '@/validations/v1/auth.validations';
import jwt from 'jsonwebtoken';
import appConfig from '@/configs/app.config';
import { RoleFactory } from '@/tests/factories/role/role.factory';

export class UserFactory {
  static makeUserData(overrides: Partial<CreateUserModel> = {}): RegisterInput {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: 'senha123',
      roleId: overrides.roleId || 1,
      ...overrides,
    };
  }

  static makeLoginData(
    email: string = faker.internet.email().toLowerCase()
  ): LoginInput {
    return {
      email,
      password: 'senha123',
    };
  }

  static async createUser(
    overrides: Partial<CreateUserModel> = {}
  ): Promise<{ user: UserModel; password: string }> {
    if (!overrides.roleId) {
      const role = await RoleFactory.createRole();
      overrides.roleId = role.id;
    }

    const password = overrides.password || 'senha123';
    const passwordHash = await bcrypt.hash(password, 10);

    const userData = this.makeUserData({
      ...overrides,
      password: passwordHash,
    });

    const user = await UserRepository.create(userData);

    return {
      user,
      password,
    };
  }

  static async createUserAndGetLoginData(
    overrides: Partial<CreateUserModel> = {}
  ): Promise<{ user: UserModel; loginData: LoginInput }> {
    const { user, password } = await this.createUser(overrides);

    const loginData = this.makeLoginData(user.email);
    loginData.password = password;

    return {
      user,
      loginData,
    };
  }

  static generateJwtToken(userId: number): string {
    // @ts-expect-error
    const token = jwt.sign({ id: userId }, appConfig.jwtSecret, {
      expiresIn: appConfig.jwtExpiration,
    });

    return token;
  }

  static async createUserAndGetToken(
    overrides: Partial<CreateUserModel> = {}
  ): Promise<{ user: UserModel; token: string }> {
    const { user } = await this.createUser(overrides);
    const token = this.generateJwtToken(user.id);

    return {
      user,
      token,
    };
  }
}
