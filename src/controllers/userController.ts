import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../database/connection';
import { User, CreateUserRequest, UpdateUserRequest } from '../models/User';

const COLLECTION_NAME = 'Users';

// Función para convertir ObjectId a string en la respuesta
const formatUser = (user: User) => {
  return {
    ...user,
    _id: user._id?.toString(),
    idProducts: user.idProducts.map(id => id.toString())
  };
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const db = getDB();
    const users = await db.collection<User>(COLLECTION_NAME).find({}).toArray();
    
    const formattedUsers = users.map(formatUser);
    
    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
      return;
    }

    const db = getDB();
    const user = await db.collection<User>(COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    res.status(200).json(formatUser(user));
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo usuario
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, number, idProducts = [] }: CreateUserRequest = req.body;

    const db = getDB();
    
    const newUser: User = {
      name,
      email,
      number,
      idProducts: idProducts.map(id => new ObjectId(id))
    };

    const result = await db.collection<User>(COLLECTION_NAME).insertOne(newUser);
    
    const createdUser = { ...newUser, _id: result.insertedId };

    res.status(201).json(formatUser(createdUser));
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar usuario
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateUserRequest = req.body;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
      return;
    }

    const db = getDB();

    // Convertir idProducts a ObjectId si existe
    if (updateData.idProducts) {
      updateData.idProducts = updateData.idProducts.map(id => new ObjectId(id));
    }

    const result = await db.collection<User>(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    // Obtener el usuario actualizado
    const updatedUser = await db.collection<User>(COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    });

    res.status(200).json(formatUser(updatedUser!));
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar usuario
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'ID de usuario inválido'
      });
      return;
    }

    const db = getDB();
    const result = await db.collection<User>(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
