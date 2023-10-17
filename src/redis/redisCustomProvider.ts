import { createClient } from 'redis';
import { Provider } from '@nestjs/common';

export const redisCustomProvider: Provider[] = [
  {
    provide: 'REDIS_CLIENT',
    useFactory: async () => {
      const maxRetries = 5;
      let retryCount = 0;

      while (retryCount < maxRetries) {
        try {
          const client = createClient({
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
            pingInterval: 5,
          });

          await client.connect();
          console.log('Connected to Redis');
          return client;
        } catch (error) {
          console.log('Failed to connect to Redis, retrying...');
          retryCount++;
          await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
        }
      }

      throw new Error('Failed to connect to Redis after several retries');
    },
  },
];
