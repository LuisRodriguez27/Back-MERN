import { MongoClient, Db } from 'mongodb';

let db: Db;
let client: MongoClient;

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/CRUD';
    
    client = new MongoClient(mongoUri);
    await client.connect();
    
    // Extraer el nombre de la base de datos de la URI
    const dbName = mongoUri.split('/').pop() || 'CRUD';
    db = client.db(dbName);
    
    console.log('✅ Conectado a MongoDB:', dbName);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
};

export const closeDB = async (): Promise<void> => {
  if (client) {
    await client.close();
    console.log('🔌 Conexión a MongoDB cerrada');
  }
};
