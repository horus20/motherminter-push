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

  @Column({length: 512, nullable: true})
  email: string;

  @Expose()
  @Column('int')
  status: number;

  @ManyToOne(type => Company, company => company.wallets)
  company: Company;

  @Column('text', {nullable: true})
  balances: string;

  @Column('text', {nullable: true})
  params: string;

  @Expose()
  isProtected() {
    return this.company ? this.company.isProtected : false
  }

  getParams() {
    return JSON.parse(this.params ?? '{}');
  }

  setParams(params) {
    this.params = JSON.stringify(params ?? {});
  }
}
