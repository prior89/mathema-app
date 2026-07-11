import { IsEmail } from 'class-validator';

export class InviteParentDto {
  @IsEmail()
  parentEmail!: string;
}
