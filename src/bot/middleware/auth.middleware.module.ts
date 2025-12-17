import { Module } from '@nestjs/common';
import { UsersModule } from '../../users/users.module';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [UsersModule],
  providers: [AuthMiddleware],
  exports: [AuthMiddleware],
})
export class AuthMiddlewareModule {}
