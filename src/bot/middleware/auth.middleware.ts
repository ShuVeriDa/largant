import { Injectable } from '@nestjs/common';
import { Context, Scenes } from 'telegraf';
import { UsersService } from '../../users/users.service';

// Расширяем Context для хранения информации о пользователе
export interface AuthContext extends Context {
  user?: {
    id: number;
    telegramId: bigint;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    isMaster: boolean;
    masterProfile?: {
      id: number;
      name: string;
      isActive: boolean;
    } | null;
  };
  scene?: Scenes.SceneContext<AuthContext>['scene'];
}

@Injectable()
export class AuthMiddleware {
  constructor(private usersService: UsersService) {}

  middleware() {
    return async (ctx: AuthContext, next: () => Promise<void>) => {
      // Проверяем, что есть информация о пользователе
      if (!ctx.from) {
        return next();
      }

      try {
        // Находим или создаем пользователя
        const user = await this.usersService.findOrCreateUser({
          id: ctx.from.id,
          first_name: ctx.from.first_name,
          last_name: ctx.from.last_name,
          username: ctx.from.username,
        });

        // Получаем информацию о роли пользователя
        const userWithRole = await this.usersService.getUserWithRole(user.id);

        // Сохраняем информацию о пользователе в контексте
        ctx.user = {
          id: user.id,
          telegramId: user.telegramId,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          isMaster: userWithRole.isMaster,
          masterProfile: userWithRole.masterProfile
            ? {
                id: userWithRole.masterProfile.id,
                name: userWithRole.masterProfile.name,
                isActive: userWithRole.masterProfile.isActive,
              }
            : null,
        };
      } catch (error) {
        console.error('Error in auth middleware:', error);
        // Продолжаем выполнение даже при ошибке
      }

      return next();
    };
  }
}
