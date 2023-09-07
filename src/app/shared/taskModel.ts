export interface TaskModel {
  id: number;
  owner: string;
  name: string;
  hasChildren: boolean;
  level: number;
  isExpanded: boolean;
  isHidden: boolean;
  childrenProvided: boolean;
}

export interface NewStepModel {
  ID: number;
  Owner: string;
  Name: string;
  HasChildren: boolean;
}
