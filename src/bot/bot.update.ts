import { Action, Start, Update } from 'nestjs-telegraf';
import type { AuthContext } from './middleware/auth.middleware';

@Update()
export class BotUpdate {
  @Start()
  async onStart(ctx: AuthContext) {
    if (!ctx.user) {
      await ctx.reply('Ошибка авторизации. Пожалуйста, попробуйте позже.');
      return;
    }

    const greeting = ctx.user.firstName
      ? `Привет, ${ctx.user.firstName}! 👋`
      : 'Добро пожаловать! 👋';

    if (ctx.user.isMaster) {
      await ctx.reply(
        `${greeting}\n\nВы авторизованы как мастер. Используйте команды для управления вашим профилем.`,
      );
    } else {
      await ctx.reply(`${greeting}\n\nВыберите мастера 👇`);
    }
  }

  @Action('SELECT_MASTER')
  async onSelectMaster(ctx: AuthContext) {
    if (!ctx.user) {
      await ctx.reply('Ошибка авторизации. Пожалуйста, попробуйте позже.');
      return;
    }

    await ctx.reply('Выберите услугу');
  }
}
