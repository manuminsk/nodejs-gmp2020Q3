import { Op } from 'sequelize';
import { singleton } from 'tsyringe';

import { IUser } from '../models/user.interface';
import { UserModel } from '../models/user.model';

@singleton()
export class UserService {
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

  public async updateUser(id: string, userUpdates: IUser): Promise<IUser> {
    const result: [number, IUser[]] = await UserModel.update(userUpdates, {
      where: {
        id,
      },
    });

    return result[1][0]; // TODO: find better solution
  }

  public async createUser(user: IUser): Promise<IUser> {
    const newUser: IUser = await UserModel.create(user);

    return newUser;
  }

  public async deleteUser(id: string): Promise<IUser> {
    const result: [number, IUser[]] = await UserModel.update(
      { isDeleted: true },
      {
        where: {
          id,
        },
      },
    );

    return result[1][0]; // TODO: find better solution
  }
}
