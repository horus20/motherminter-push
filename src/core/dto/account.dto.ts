import { ApiProperty } from '@nestjs/swagger';

export class AccountDto {
  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  readonly brand: string;

  @ApiProperty()
  readonly logo;
}
