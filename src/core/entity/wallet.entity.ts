import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Company } from './company.entity';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created: Date;

  @Expose({ name: 'uid' })
  @Column({ length: 64 })
  wallet: string;

  @Column({length: 42, nullable: true})
  mxaddress: string;

  @Expose()
  @Column('int')
  status: number;

  @ManyToOne(type => Company, company => company.wallets)
  company: Company;

  @Column('text', {nullable: true})
  balances: string;

  @Column('text', {nullable: true})
  params: string;

  getParams() {
    return JSON.parse(this.params ?? '{}');
  }

  setParams(params) {
    this.params = JSON.stringify(params ?? {});
  }
}
