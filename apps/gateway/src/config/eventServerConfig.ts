import { registerAs } from '@nestjs/config';

export const EventServerConfig = registerAs('eventServer', () => ({
  url: process.env.EVENT_SERVER_URL,
}));
