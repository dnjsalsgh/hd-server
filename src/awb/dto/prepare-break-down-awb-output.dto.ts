import { Scc } from '../../scc/entities/scc.entity';

export class breakDownAwb {
  allAwbReceive: boolean;
  awbTotalPiece: number;
  barcode: string;
  depth: number;
  description: string;
  destination: string;
  gSkidOn: boolean;
  ghost: boolean;
  id: number;
  length: number;
  modelPath: string | null;
  parent: number;
  path: string | null;
  piece: number;
  prefab: string;
  receivedDate: string;
  receivedUser: string;
  scc: Partial<Scc>[];
  separateNumber: number;
  simulation: boolean;
  spawnRatio: number;
  squareVolume: number;
  state: string;
  waterVolume: number;
  weight: number;
  width: number;
}

export class PrepareBreakDownAwbOutputDto {
  code: number;
  result: breakDownAwb[];
  state: string;
}
