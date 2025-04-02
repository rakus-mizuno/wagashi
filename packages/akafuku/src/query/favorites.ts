import { getStorageItemByKey, getStorageItems, removeStorageItemByKey, setStorageItem } from '../helpers/chrome-helper';
import { type Favorite } from '../interfaces/favorite.interface';
import { type FavoritesMutation, type FavoritesQuery } from './favorites-query.interface';

const keyPrefix = import.meta.env.VITE_FAVORITE_KEY_PREFIX;
const maxFavorites = import.meta.env.VITE_MAX_FAVORITES;

export const getFavorites = async (): Promise<FavoritesQuery['favorites']['payload']> => {
  const keys = await getFavoriteKeys();
  const results = await Promise.all(
    keys.map(async (key) => {
      const data = await getFavoriteByKey(key);
      if (data === undefined) {
        return null;
      }

      return {
        key,
        name: data.name,
        timestamp: data.timestamp,
        operations: data.operations,
      };
    })
  );
  return results.filter((item): item is Favorite => item !== null);
};

export const getFavoriteByKey = async (
  input: FavoritesQuery['favoriteByKey']['input']
): Promise<FavoritesQuery['favoriteByKey']['payload']> => {
  return getStorageItemByKey(input);
};

export const getFavoriteKeys = async (): Promise<FavoritesQuery['favoriteKeys']['payload']> => {
  const allItems = await getStorageItems();
  return Object.keys(allItems).filter((key) => key.startsWith(keyPrefix));
};

export const registerFavorite = async (
  input: FavoritesMutation['registerFavorite']['input']
): Promise<FavoritesMutation['registerFavorite']['payload']> => {
  const timestamp = Date.now();
  const key = `${keyPrefix}${timestamp}`;

  const favoriteData: Omit<Favorite, 'key'> = {
    name: input.name,
    timestamp,
    operations: input.operations,
  };

  const favorites = await getFavorites();
  if (favorites.length >= maxFavorites) {
    favorites.sort((a, b) => a.timestamp - b.timestamp);
    const oldestFavorite = favorites[0];
    await removeStorageItemByKey(oldestFavorite.key);
  }

  return setStorageItem(key, favoriteData);
};

export const deleteFavoriteByKey = async (
  input: FavoritesMutation['deleteFavoriteByKey']['input']
): Promise<FavoritesMutation['deleteFavoriteByKey']['payload']> => {
  return removeStorageItemByKey(input);
};
