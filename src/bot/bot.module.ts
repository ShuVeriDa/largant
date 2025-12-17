import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { BookingScene } from './scenes/booking.scene';

@Module({
  imports: [UsersModule],
  controllers: [BotController],
  providers: [BotService, BotUpdate, BookingScene],
})
export class BotModule {}
