import { IUser } from 'src/interfaces/user.interface';
import { singleton } from 'tsyringe';
import { v4 } from 'uuid';

@singleton()
export class UserService {
  private users: IUser[] = [
    {
      login: 'user1',
      password: 'password',
      age: 32,
      isDeleted: false,
      id: '8fb1ddce-5baa-464b-85e4-6e300ba20efc',
    },
    {
      login: 'user2',
      password: 'password',
      age: 32,
      isDeleted: false,
      id: 'd84c597f-ef35-49b7-85d2-e41e26608174',
    },
    {
      login: 'user3',
      password: 'password',
      age: 32,
      isDeleted: false,
      id: '28f57fd7-44e2-4700-9624-030a664676cb',
    },
  ];

  public getUserById(id: string): IUser | undefined {
    return this.users.find(item => item.id === id);
  }

  public getUserList(): IUser[] {
    return this.users.filter(item => !item.isDeleted);
  }

  public getAutoSuggestUsers(loginSubstring: string, limit: number): IUser[] {
    let users: IUser[] = this.getUserList();

    if (loginSubstring && loginSubstring.length) {
      users = users.filter(item => item.login.includes(loginSubstring));
    }

    if (limit) {
      users = users.slice(0, limit);
    }

    return users;
  }

  public updateUser(id: string, userUpdates: IUser): IUser {
    const currentUser: IUser = this.users.find(item => item.id === id) as IUser;

    if (currentUser) {
      Object.assign(currentUser, userUpdates);
    }

    return currentUser;
  }

  public createUser(user: IUser): IUser {
    const newUser: IUser = {
      ...user,
      id: v4(),
    };

    this.users.push(newUser);

    return newUser;
  }

  public deleteUser(id: string): IUser {
    const user: IUser = this.users.find(item => item.id === id) as IUser;

    if (user) {
      Object.assign(user, { ...user, isDeleted: true });
    }

    return user;
  }
}
