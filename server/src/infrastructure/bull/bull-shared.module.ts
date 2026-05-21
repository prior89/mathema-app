import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Shared BullMQ root connection.
 *
 *   - Defines BullModule.forRootAsync() once and exposes it globally so that
 *     individual feature modules can simply call
 *     `BullModule.registerQueue({ name: 'foo' })` without re-declaring the
 *     Redis connection.
 *   - Marked @Global() — import this module ONCE in AppModule. Importing it
 *     in multiple places would re-register forRootAsync and the queues would
 *     fight over the connection token.
 *   - Reads ConfigService('redis.*') (host / port / password / tls), matching
 *     the same shape used by the standalone RedisModule.
 */
@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host'),
          port: config.get<number>('redis.port'),
          password: config.get<string>('redis.password') || undefined,
          tls: config.get<boolean>('redis.tls') ? {} : undefined,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [BullModule],
})
export class BullSharedModule {}
