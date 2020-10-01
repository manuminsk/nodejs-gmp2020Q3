import { DataTypes, Model, UUIDV4 } from 'sequelize';

import { sequelize } from '../data-access/database';
import { IGroup, IGroupCreation, Permission } from './group.interface';

export class GroupModel extends Model<IGroup, IGroupCreation> implements IGroup {
  public id!: string;
  public name!: string;
  public permissions!: Permission[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

GroupModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  },
  {
    tableName: 'groups',
    sequelize,
    modelName: 'Group',
  },
);
