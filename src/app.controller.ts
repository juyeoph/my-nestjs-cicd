import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hello')
  getHelloCiCd(): string {
    // GREETING_MESSAGE 환경변수가 있으면 그 값을, 없으면 기본 메시지를 반환
    return process.env.GREETING_MESSAGE || 'Hello from Default!';
  }
}
