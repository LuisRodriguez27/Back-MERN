import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../database/connection';
import { Product, CreateProductRequest, UpdateProductRequest } from '../models/Product';

const COLLECTION_NAME = 'Products';

// Función para convertir ObjectId a string en la respuesta
const formatProduct = (product: Product) => {
  return {
    ...product,
    _id: product._id?.toString()
  };
};

// Obtener todos los productos
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const products = await db.collection<Product>(COLLECTION_NAME).find({}).toArray();
    
    const formattedProducts = products.map(formatProduct);

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
      return;
    }

    const db = getDB();
    const product = await db.collection<Product>(COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
      return;
    }

    res.status(200).json(formatProduct(product));
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo producto
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price }: CreateProductRequest = req.body;

    const db = getDB();

    const newProduct: Product = {
      name,
      description,
      price: Number(price)
    };

    const result = await db.collection<Product>(COLLECTION_NAME).insertOne(newProduct);
    
    const createdProduct = { ...newProduct, _id: result.insertedId };

    res.status(201).json(formatProduct(createdProduct));
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar producto
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateProductRequest = req.body;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
      return;
    }

    // Validar precio si se está actualizando
    if (updateData.price !== undefined && updateData.price < 0) {
      res.status(400).json({
        success: false,
        message: 'El precio debe ser mayor o igual a 0'
      });
      return;
    }

    // Convertir precio a número si existe
    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price);
    }

    const db = getDB();
    const result = await db.collection<Product>(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
      return;
    }

    // Obtener el producto actualizado
    const updatedProduct = await db.collection<Product>(COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    });

    res.status(200).json(formatProduct(updatedProduct!));
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar producto
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
      return;
    }

    const db = getDB();
    const result = await db.collection<Product>(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Producto eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
