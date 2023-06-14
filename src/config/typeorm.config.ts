import { TypeOrmModule } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModule = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_ID || 'postgres',
  password: process.env.DB_PASS || '1234',
  database: process.env.DB_DATABASE || 'test',
  entities: ['dist/**/*.entity{.ts,.js}'],
  // autoLoadEntities: true,
  synchronize: process.env.NODE_ENV === 'dev',
  logging: true,
  // keepConnectionAlive: true, //true 옵션을 설정할 경우 Hot reload 시 DB 연결을 유지해준다.
  // imports: [ConfigModule],
  // inject: [ConfigService],
  // useFactory: (configService: ConfigService) => ({
  //   retryAttempts: 3,
  //
  //   type: 'postgres',
  //   host: configService.get<string>('DATABASE_HOST'),
  //   port: parseInt(configService.get<string>('DATABASE_PORT')),
  //   username: configService.get<string>('DATABASE_USER'),
  //   password: configService.get<string>('DATABASE_PASS'),
  //   database: configService.get<string>('DATABASE_NAME'),
  //   entities: ['src/../**/*.entity{.ts,.js}'],
  //   autoLoadEntities: true,
  //   logging: true,
  //   // synchronize: true 한번 true 하고 false => 안그러면 테이블 데이터 없어짐
  //   synchronize: false,
  // }),
};
