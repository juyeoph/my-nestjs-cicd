import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getFormattedHello(name?: string): string {
    if (!name) {
      return 'Hello, Guest!';
    }
    return `Hello, ${name}!`;
  }
}
