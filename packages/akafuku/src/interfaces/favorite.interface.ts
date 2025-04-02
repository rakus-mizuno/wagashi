import { type Operation } from './operation.interface';

export interface Favorite {
  key: string;
  name: string;
  timestamp: number;
  operations: Operation[];
}
