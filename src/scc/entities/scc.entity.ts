import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CargoSccJoin } from '../../cargo-scc-join/entities/cargo-scc-join.entity';
import { UldSccJoin } from '../../uld-scc-join/entities/uld-scc-join.entity';

@Entity()
export class Scc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  code: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;

  @Column({ type: 'int', nullable: true })
  score: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  @OneToMany(() => CargoSccJoin, (cargoSccJoin) => cargoSccJoin.scc)
  cargoSccJoin: CargoSccJoin[];

  @OneToMany(() => UldSccJoin, (uldSccJoin) => uldSccJoin.scc)
  uldSccJoin: UldSccJoin[];
}
