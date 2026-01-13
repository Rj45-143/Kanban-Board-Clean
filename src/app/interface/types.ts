export interface Task {
  id: string;
  content: string;
  username: string;
  column: "todo" | "inprogress" | "done";
  createdAt: string;
  inProgressAt?: string;
  estimatedCompletion?: string;
  doneAt?: string;
  history?: { username: string; action: string; timestamp: string }[];
}
