import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Developer } from '../developers/entities/developer.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  token: string;

  @ManyToOne(() => Developer, developer => developer.id)
  user: Developer;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date;
}
