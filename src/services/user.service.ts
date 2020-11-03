import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

import { CommonConfig } from '../common/common.config';
import { IUser } from '../models/user.interface';
import { UserModel } from '../models/user.model';

export class UserService {
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = CommonConfig.JWT_SECRET;
  }

  public async login(username: string, password: string): Promise<string | null> {
    const user: IUser | null = await UserModel.findOne({
      where: {
        login: username,
      },
    });

    if (user) {
      const compareResult: boolean = await bcrypt.compare(password, user.password);

      if (compareResult) {
        const token: string = jwt.sign({ sid: user.id }, this.jwtSecret, { expiresIn: '1h' });
        return token;
      }
    }

    return null;
  }

  public async getUserById(id: string): Promise<IUser | null> {
    const user: IUser | null = await UserModel.findByPk(id);

    return user;
  }

  public async getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<IUser[]> {
    const users: IUser[] = await UserModel.findAll({
      where: {
        isDeleted: false,
        login: {
          [Op.like]: `%${loginSubstring}`,
        },
      },
      limit,
    });

    return users;
  }

  public async updateUser(id: string, userUpdates: IUser): Promise<void> {
    const salt: string = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(userUpdates.password, salt);

    await UserModel.update(
      {
        ...userUpdates,
        password: hash,
      },
      {
        where: {
          id,
        },
      },
    );
  }

  public async createUser(user: IUser): Promise<IUser> {
    const salt: string = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(user.password, salt);
    const newUser: IUser = await UserModel.create({ ...user, password: hash });

    return newUser;
  }

  public async deleteUser(id: string): Promise<IUser | null | undefined> {
    const [numberOfItems, updatedItems]: [number, IUser[]] = await UserModel.update(
      { isDeleted: true },
      {
        where: {
          id,
        },
      },
    );

    return numberOfItems ? updatedItems.shift() : null;
  }
}
