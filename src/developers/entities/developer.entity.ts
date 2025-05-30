import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Developer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  dateOfBirth!: string;

  @Column()
  role!: string;

  @Column()
  password!: string;
}
