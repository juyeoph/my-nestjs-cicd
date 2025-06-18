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

    // 예: "Hello from Dev! (Build: Jenkins-Build-8)"
    return `${greeting} (Build: ${buildInfo})`;
  }
}
