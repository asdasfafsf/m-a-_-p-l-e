import { registerAs } from '@nestjs/config';

export const AuthServerConfig = registerAs('authServer', () => ({
  url: process.env.AUTH_SERVER_URL,
}));
