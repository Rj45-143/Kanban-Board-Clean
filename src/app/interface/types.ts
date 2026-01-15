export interface Task {
  id: string;       // DB id, used in all frontend ops
  content: string;
  createdAt: string;
  username: string;
  column: "todo" | "inprogress" | "done";
  inProgressAt?: string;
  estimatedCompletion?: string;
  doneAt?: string;
  history?: {
    username: string;
    action: string;
    timestamp: string;
  }[];
}
