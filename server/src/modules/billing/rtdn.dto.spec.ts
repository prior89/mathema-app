import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { RtdnRequestDto } from './rtdn.dto';

describe('RtdnRequestDto', () => {
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  const transform = (value: unknown) =>
    pipe.transform(value, {
      type: 'body',
      metatype: RtdnRequestDto,
      data: '',
    });

  it('accepts the complete Pub/Sub wrapped push envelope', async () => {
    const payload = {
      deliveryAttempt: 5,
      message: {
        attributes: { key: 'value' },
        data: Buffer.from('{"version":"1.0"}').toString('base64'),
        messageId: '2070443601311540',
        message_id: '2070443601311540',
        orderingKey: 'key',
        publishTime: '2021-02-26T19:13:55.749Z',
        publish_time: '2021-02-26T19:13:55.749Z',
      },
      subscription: 'projects/matheo-prod/subscriptions/play-rtdn-matheo-push',
    };

    await expect(transform(payload)).resolves.toEqual(payload);
  });

  it('continues to reject unknown envelope fields', async () => {
    await expect(
      transform({
        message: {
          data: 'e30=',
          messageId: '1',
          unsupported: true,
        },
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
