import { Injectable } from '@nestjs/common';
import { MasterProfile, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface UserWithRole extends User {
  masterProfile?: MasterProfile | null;
  isMaster: boolean;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Найти или создать пользователя по Telegram ID
   */
  async findOrCreateUser(telegramUser: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
  }): Promise<User> {
    console.log({ telegramUser });
    const telegramId = telegramUser.id;

    let user = await this.prisma.user.findUnique({
      where: { telegramId: telegramId },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          telegramId,
          firstName: telegramUser.first_name || null,
          lastName: telegramUser.last_name || null,
          username: telegramUser.username || null,
        },
      });
    } else {
      // Обновляем данные пользователя, если они изменились
      user = await this.prisma.user.update({
        where: { telegramId },
        data: {
          firstName: telegramUser.first_name || user.firstName,
          lastName: telegramUser.last_name || user.lastName,
          username: telegramUser.username || user.username,
        },
      });
    }

    return user;
  }

  /**
   * Получить пользователя с информацией о роли
   */
  async getUserWithRole(userId: number): Promise<UserWithRole> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        masterProfile: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      ...user,
      isMaster: !!user.masterProfile,
    };
  }

  /**
   * Получить пользователя по Telegram ID с информацией о роли
   */
  async getUserByTelegramIdWithRole(
    telegramId: bigint,
  ): Promise<UserWithRole | null> {
    const user = await this.prisma.user.findUnique({
      where: { telegramId },
      include: {
        masterProfile: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      ...user,
      isMaster: !!user.masterProfile,
    };
  }

  /**
   * Проверить, является ли пользователь мастером
   */
  async isMaster(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        masterProfile: true,
      },
    });

    return !!user?.masterProfile;
  }

  /**
   * Получить пользователя по ID
   */
  async getUserById(userId: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }
}
