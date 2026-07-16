import { ValidationPipe } from '@nestjs/common';
import { RegisterDto } from './register.dto';

describe('RegisterDto public registration boundary', () => {
  const pipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  const validStudent = {
    email: 'student@example.com',
    password: 'pw12345678',
    name: 'Student',
    role: 'STUDENT',
    country: 'KR',
  };

  it('accepts the public student path', async () => {
    await expect(pipe.transform(validStudent, {
      type: 'body',
      metatype: RegisterDto,
    })).resolves.toMatchObject({ role: 'STUDENT', country: 'KR' });
  });

  it.each(['TEACHER', 'ADMIN'])('rejects %s as a public role', async (role) => {
    await expect(pipe.transform({ ...validStudent, role }, {
      type: 'body',
      metatype: RegisterDto,
    })).rejects.toBeDefined();
  });

  it('rejects tenantCode as a public registration field', async () => {
    await expect(pipe.transform({ ...validStudent, tenantCode: 'MATHEMA-A1B2' }, {
      type: 'body',
      metatype: RegisterDto,
    })).rejects.toBeDefined();
  });
});
