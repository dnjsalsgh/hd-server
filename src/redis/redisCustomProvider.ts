import { createClient } from 'redis';
import { Provider } from '@nestjs/common';

export const redisCustomProvider: Provider[] = [
  {
    provide: 'REDIS_CLIENT',
    useFactory: async () => {
      const client = createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        pingInterval: 5,
      });
      await client.connect();
      return client;
    },
  },
];
