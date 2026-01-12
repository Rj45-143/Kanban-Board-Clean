export interface Task {
  id: string;
  content: string;
  createdAt: string;
  inProgressAt?: string;
  doneAt?: string;
  username: string;
  estimatedCompletion?: string;
  column: "todo" | "inprogress" | "done";
}
