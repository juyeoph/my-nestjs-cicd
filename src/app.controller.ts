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
    const greeting = process.env.GREETING_MESSAGE || 'Hello from Default!';
    const buildInfo = process.env.BUILD_INFO || 'N/A';

    return `${greeting} (Build: ${buildInfo})`;
  }
}
