import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../src/app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('getFormattedHello', () => {
    it('이름이 주어지면 "Hello, [이름]!"을 반환해야 한다', () => {
      const name = 'Juyeop';
      const expectedResult = `Hello, ${name}!!`;
      // appService.getFormattedHello('Juyeop')의 결과가
      // 'Hello, Juyeop!'과 같은지(toBe) 확인(expect)합니다.
      expect(appService.getFormattedHello(name)).toBe(expectedResult);
    });

    it('이름이 주어지지 않으면 "Hello, Guest!"를 반환해야 한다', () => {
      const expectedResult = 'Hello, Guest!';
      // appService.getFormattedHello(null)의 결과가
      // 'Hello, Guest!'와 같은지 확인합니다.
      expect(appService.getFormattedHello()).toBe(expectedResult);
    });
  });
});
