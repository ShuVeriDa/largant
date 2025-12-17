import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { AuthMiddleware } from './bot/middleware/auth.middleware';
import { AuthMiddlewareModule } from './bot/middleware/auth.middleware.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

const botToken = process.env.TG_BOT_TOKEN;

if (!botToken) {
  throw new Error(
    'TG_BOT_TOKEN is not set in environment variables. Please create a .env file with TG_BOT_TOKEN=your_bot_token',
  );
}

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    TelegrafModule.forRootAsync({
      useFactory: (authMiddleware: AuthMiddleware) => ({
        token: botToken,
        middlewares: [authMiddleware.middleware()],
      }),
      inject: [AuthMiddleware],
      imports: [AuthMiddlewareModule],
    }),
    BotModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
