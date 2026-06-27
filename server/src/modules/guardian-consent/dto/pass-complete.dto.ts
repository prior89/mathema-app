import { IsString, MinLength } from 'class-validator';

export class PassCompleteDto {
  /** Raw PASS transaction id returned by /guardian-consent/pass/start. */
  @IsString() @MinLength(16) txId!: string;
}
