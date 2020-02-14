import { BeforeUpdate, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Company } from './company.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created: Date;

  @Exclude()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updated: Date;

  @Column({length: 512, nullable: true})
  email: string;

  @Exclude()
  @Column({length: 64, nullable: true})
  password: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ type: 'text', nullable: true })
  logo: string;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }

  @OneToMany(type => Company, company => company.account, {
    eager: true,
  })
  @JoinColumn()
  companies: Company[];
}
