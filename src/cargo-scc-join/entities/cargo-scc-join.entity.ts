import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { Scc } from '../../scc/entities/scc.entity';

@Entity()
export class CargoSccJoin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Cargo, (cargo) => cargo.cargoSccJoin)
  cargo: Cargo;
  @ManyToOne(() => Scc, (scc) => scc.cargoSccJoin)
  scc: Scc;
}
