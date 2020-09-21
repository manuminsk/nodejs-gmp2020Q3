import { singleton } from 'tsyringe';

import { IGroup } from '../models/group.interface';
import { GroupModel } from '../models/group.model';

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

  public async updateGroup(id: string, groupUpdates: IGroup): Promise<IGroup | null | undefined> {
    const [numberOfItems, updatedItems]: [number, IGroup[]] = await GroupModel.update(groupUpdates, {
      where: {
        id,
      },
    });

    return numberOfItems ? updatedItems.shift() : null;
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
}
