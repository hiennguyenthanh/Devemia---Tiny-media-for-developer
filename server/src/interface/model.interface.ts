import { Types, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  joinDate: Date;
  followers: Types.ObjectId[];
}

export interface IPost extends Document {
  title: string;
  content: string;
  likes: Types.ObjectId[];
  author: Types.ObjectId;
  date: Date;
}

export interface IComment extends Document {
  content: string;
  date: Date;
  likes: Types.ObjectId[];
  author: Types.ObjectId;
  parentId: Types.ObjectId;
  postId: Types.ObjectId;
}

export interface INotification extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  postId?: Types.ObjectId;
  commentId?: Types.ObjectId;
  date: Date;
  type: string;
  read: boolean;
}
