import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Developer } from '../developers/entities/developer.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id!: number; // ✅ Adicionamos `!` para dizer ao TypeScript que será inicializado

  @Column()
  token!: string;

  @ManyToOne(() => Developer)
  user!: Developer;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  revokedAt?: Date;
}
