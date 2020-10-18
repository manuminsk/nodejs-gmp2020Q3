import { singleton } from 'tsyringe';

import { sequelize } from '../data-access/database';
import { IGroup } from '../models/group.interface';
import { GroupModel } from '../models/group.model';
import { UserGroupModel } from '../models/user.model';

@singleton()
export class GroupService {
  public async getGroupById(id: string): Promise<IGroup | null> {
    const group: IGroup | null = await GroupModel.findByPk(id);

    return group;
  }

  public async getAllGroups(): Promise<IGroup[]> {
    const groups: IGroup[] = await GroupModel.findAll();

    return groups;
  }

  public async updateGroup(id: string, groupUpdates: IGroup): Promise<void> {
    await GroupModel.update(groupUpdates, {
      where: {
        id,
      },
    });
  }

  public async createGroup(group: IGroup): Promise<IGroup> {
    const newGroup: IGroup = await GroupModel.create(group);

    return newGroup;
  }

  public async deleteGroup(id: string): Promise<number> {
    const deletedRowsCount: number = await GroupModel.destroy({
      where: {
        id,
      },
    });

    return deletedRowsCount;
  }

  public async addUsersToGroup(id: string, userIds: string[]): Promise<void> {
    try {
      await sequelize.transaction(async t => {
        return UserGroupModel.bulkCreate(
          userIds.map(userId => ({
            UserId: userId,
            GroupId: id,
          })),
          { transaction: t },
        );
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      throw new Error(error);
    }
  }
}
