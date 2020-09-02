import { Optional } from 'sequelize/types';

export interface IUser {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserCreation extends Optional<IUser, 'id'> {}
