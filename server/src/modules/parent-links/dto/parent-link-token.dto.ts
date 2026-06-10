import { IsString, MinLength } from 'class-validator';

export class ParentLinkTokenDto {
  @IsString()
  @MinLength(16)
  token!: string;
}