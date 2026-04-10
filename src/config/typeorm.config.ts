import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User, Guest, Reservation, AccompanyingGuest, PolicyAcknowledgment, Transaction } from '../entities';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'postgres',
  entities: [User, Guest, Reservation, AccompanyingGuest, PolicyAcknowledgment, Transaction],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  // SSL Configuration for Supabase (required for remote connections)
  ssl: {
    rejectUnauthorized: false,
  },
};
