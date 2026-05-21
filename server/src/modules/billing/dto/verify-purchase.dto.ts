import { IsIn, IsString, MinLength } from 'class-validator';

export class VerifyPurchaseDto {
  @IsString()
  @IsIn(['premium_monthly', 'premium_yearly'])
  productId!: 'premium_monthly' | 'premium_yearly';

  @IsString()
  @MinLength(20)
  purchaseToken!: string;
}
