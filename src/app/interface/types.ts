import { ObjectId } from "mongodb";

export interface Task {
  _id?: ObjectId;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  createdAt?: Date;
  updatedAt?: Date;
}
