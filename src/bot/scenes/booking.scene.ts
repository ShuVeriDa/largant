import { Action, Scene, SceneEnter } from 'nestjs-telegraf';
import type { AuthContext } from '../middleware/auth.middleware';

@Scene('BOOKING')
export class BookingScene {
  @SceneEnter()
  async enter(ctx: AuthContext) {
    if (!ctx.user) {
      await ctx.reply('Ошибка авторизации. Пожалуйста, попробуйте позже.');
      if (ctx.scene) {
        await ctx.scene.leave();
      }
      return;
    }

    await ctx.reply('Выберите услугу');
  }

  @Action(/SERVICE_.+/)
  async selectService(ctx: AuthContext) {
    if (!ctx.user) {
      await ctx.reply('Ошибка авторизации. Пожалуйста, попробуйте позже.');
      if (ctx.scene) {
        await ctx.scene.leave();
      }
      return;
    }

    // await ctx.scene.state.serviceId = ...
    await ctx.reply('Выберите день');
  }
}
