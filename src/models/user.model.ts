import { DataTypes, Model, UUIDV4 } from 'sequelize';

import { sequelize } from '../data-access/database';
import { GroupModel } from './group.model';
import { IUser, IUserCreation } from './user.interface';

export class UserModel extends Model<IUser, IUserCreation> implements IUser {
  public id!: string;
  public login!: string;
  public password!: string;
  public age!: number;
  public isDeleted!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    login: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    tableName: 'users',
    sequelize,
    modelName: 'User',
  },
);

// eslint-disable-next-line @typescript-eslint/typedef
export const UserGroupModel = sequelize.define(
  'UserGroup',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
  },
  { tableName: 'user_group', timestamps: false },
);

UserModel.belongsToMany(GroupModel, { through: UserGroupModel });
GroupModel.belongsToMany(UserModel, { through: UserGroupModel });
