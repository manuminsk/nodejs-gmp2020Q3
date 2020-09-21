import { Optional } from 'sequelize/types';

export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export interface IGroup {
  id: string;
  name: string;
  permissions: Permission[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IGroupCreation extends Optional<IGroup, 'id'> {}
