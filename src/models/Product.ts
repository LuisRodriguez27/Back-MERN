import { ObjectId } from 'mongodb';

export interface Product {
  _id?: ObjectId;
  id?: string;
  name: string;
  description: string;
  price: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
}
