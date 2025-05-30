import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

const { nanoid } = require('nanoid');

@Entity('developers')
export class Developer {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  dateOfBirth: string;

  @Column({ default: 'user' }) // Define 'user' como padrão
  role: string;

  @Column()
  password: string;

  @BeforeInsert()
  generateId() {
    this.id = `dev_${nanoid()}`;
  }

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
