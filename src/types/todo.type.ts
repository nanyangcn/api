import { ObjectId } from 'mongodb';

export interface Todo {
  _id?: ObjectId;
  id?: string;
  title: string;
  description?: string;
  done: boolean;
  deadline?: Date;
}
