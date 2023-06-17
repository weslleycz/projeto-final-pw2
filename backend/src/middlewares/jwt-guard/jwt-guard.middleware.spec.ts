import { JwtGuardMiddleware } from './jwt-guard.middleware';

describe('JwtGuardMiddleware', () => {
  it('should be defined', () => {
    expect(new JwtGuardMiddleware()).toBeDefined();
  });
});
