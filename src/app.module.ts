import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma.module';
import { ConfigModule } from '@nestjs/config';
import { GeminiService } from './gemini/gemini.service';
import { GeminiModule } from './gemini/gemini.module';
import { SendmessageModule } from './sendmessage/sendmessage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    PrismaModule,
    GeminiModule,
    SendmessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, GeminiService],
})
export class AppModule {}
