import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Uld } from '../../uld/entities/uld.entity';

@Entity()
export class UldType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  code: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'double precision', nullable: true })
  waterVolume: number;

  @Column({ type: 'double precision', nullable: true })
  squareVolume: number;

  @Column({ type: 'double precision', nullable: true })
  width: number;

  @Column({ type: 'double precision', nullable: true })
  length: number;

  @Column({ type: 'double precision', nullable: true })
  height: number;

  @Column({ type: 'double precision', nullable: true })
  capacity: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  modelPath: string;

  @Column({ type: 'json', nullable: true })
  vertexCord: JSON;

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  @OneToMany(() => Uld, (uld) => uld.uldType)
  ulds: Uld[];
}
