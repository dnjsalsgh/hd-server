import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Uld } from '../../uld/entities/uld.entity';
import { Cargo } from '../../cargo/entities/cargo.entity';
import { Scc } from '../../scc/entities/scc.entity';

@Entity()
export class UldSccJoin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  createdAt: Date;

  @Column({ type: 'date', nullable: false })
  updatedAt: Date;

  @Column({ type: 'date', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Uld, (uld) => uld.uldSccJoin)
  uld: Uld;
  @ManyToOne(() => Scc, (scc) => scc.uldSccJoin)
  scc: Scc;
}
