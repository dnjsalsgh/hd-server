import { createClient } from 'redis';
import { Provider } from '@nestjs/common';

// Redis 클라이언트 연결을 시도하는 함수
const connectToRedis = async () => {
  const client = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    pingInterval: 5000,
  });

  await client.connect();
  console.log('Connected to Redis');
  return client;
};

// Redis에 연결하는 데 실패했을 때 재시도하는 함수
const retryConnect = async (retries: number, interval: number) => {
  for (let retry = 0; retry < retries; retry++) {
    try {
      return await connectToRedis();
    } catch (error) {
      console.log(
        `Failed to connect to Redis, retrying... (${retry + 1}/${retries})`,
      );
      if (retry < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    }
  }
  throw new Error('Failed to connect to Redis after several retries');
};

export const redisCustomProvider: Provider[] = [
  {
    provide: 'REDIS_CLIENT',
    useFactory: () => retryConnect(5, 5000),
  },
];
