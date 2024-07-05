export interface TaskItem {
  text: string;
  task: () => Promise<any>;
}
