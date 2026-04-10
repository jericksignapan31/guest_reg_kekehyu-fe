import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, Guest, Reservation, Room, AccompanyingGuest, PolicyAcknowledgment, Transaction } from './entities';
import { AuthModule } from './modules/auth/auth.module';
import { ReservationModule } from './modules/reservations/reservation.module';
import { AdminModule } from './modules/admin/admin.module';
import { OcrModule } from './modules/ocr/ocr.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbHost = configService.get<string>('DB_HOST') || 'localhost';
        const dbPort = parseInt(configService.get<string>('DB_PORT') || '5432', 10);
        const dbUsername = configService.get<string>('DB_USERNAME') || 'postgres';
        const dbPassword = configService.get<string>('DB_PASSWORD') || 'password';
        const dbName = configService.get<string>('DB_NAME') || 'postgres';
        
        console.log(`[Database Config] Host: ${dbHost}, Port: ${dbPort}, Username: ${dbUsername}`);
        
        return {
          type: 'postgres',
          host: dbHost,
          port: dbPort,
          username: dbUsername,
          password: dbPassword,
          database: dbName,
          entities: [User, Guest, Reservation, Room, AccompanyingGuest, PolicyAcknowledgment, Transaction],
          synchronize: configService.get('NODE_ENV') !== 'production',
          logging: configService.get('NODE_ENV') !== 'production',
          ssl: {
            rejectUnauthorized: false,
          },
        };
      },
    }),
    AuthModule,
    ReservationModule,
    AdminModule,
    OcrModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
