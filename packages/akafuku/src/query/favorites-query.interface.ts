import { type Favorite } from '../interfaces/favorite.interface';
import { type Operation } from '../interfaces/operation.interface';

export interface FavoritesQuery {
  favorites: {
    payload: Favorite[];
  };
  favoriteByKey: {
    input: string;
    payload: Favorite | undefined;
  };
  favoriteKeys: {
    payload: string[];
  };
}

export interface FavoritesMutation {
  registerFavorite: {
    input: {
      name: string;
      operations: Operation[];
    };
    payload: void;
  };
  deleteFavoriteByKey: {
    input: string;
    payload: void;
  };
}
