import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { EventId } from '../enum/event-id.enum';
import { Exclude } from 'class-transformer';

@Entity({ name: 'consents' })
export class EventEntity {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  uuid: number;

  @Column({
    name: 'id',
    type: 'enum',
    enum: EventId,
    default: EventId.EMAIL,
    nullable: false,
  })
  id: EventId;

  @Column({ name: 'enabled', nullable: false })
  enabled: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string | null;

  @ManyToOne(() => UserEntity, (user) => user.events, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: UserEntity;
}
