import { type Favorite } from '../interfaces/favorite.interface';
import { type Operation } from '../interfaces/operation.interface';

export interface OperationsQuery {
  operations: {
    payload: Operation[];
  };
  favoriteByKey: {
    input: string;
    payload: Favorite | undefined;
  };
  favoriteKeys: {
    payload: string[];
  };
}

export interface OperationsMutation {
  registerOperation: {
    input: Operation[];
    payload: void;
  };
  deleteFavoriteByKey: {
    input: string;
    payload: void;
  };
}
