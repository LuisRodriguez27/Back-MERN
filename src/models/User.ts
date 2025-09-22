import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  id?: string;
  name: string;
  email: string;
  number: string;
  idProducts: ObjectId[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
  number: string;
  idProducts?: ObjectId[];
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  number?: string;
  idProducts?: ObjectId[];
}
