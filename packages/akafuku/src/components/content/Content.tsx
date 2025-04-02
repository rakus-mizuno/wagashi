import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState, type ChangeEventHandler, type FC, type MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteFavoriteByKey, getFavoriteByKey, getFavorites, registerFavorite } from '../../query/favorites';
import { getOperations, registerOperations } from '../../query/operations';
import { Button } from '../button/Button';
import { OperationsTable } from '../operations-table/OperationsTable';

export const Content: FC = () => {
  const { t } = useTranslation();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [favoriteName, setFavoriteName] = useState<string>('');
  const [selectedFavoriteKey, setSelectedFavoriteKey] = useState<string>('');

  const queryClient = useQueryClient();

  const { data: operations, refetch: refetchOperations } = useQuery({
    queryKey: ['operations'],
    queryFn: () => getOperations(),
  });

  const { mutate: mutateRegisterOperation } = useMutation({
    mutationFn: registerOperations,
  });

  const { data: favorites, refetch: refetchFavorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => getFavorites(),
  });

  const { mutate: mutateGetFavoriteByKey } = useMutation({
    mutationFn: getFavoriteByKey,
    onSuccess: (data) => {
      if (data !== undefined) {
        queryClient.setQueryData(['operations'], data.operations);
      }
    },
  });

  const { mutate: mutateRegisterFavorite } = useMutation({
    mutationFn: registerFavorite,
    onSuccess: () => {
      setShowSaveDialog(false);
      setFavoriteName('');
      refetchFavorites().catch(() => {
        /* empty */
      });
    },
  });

  const { mutate: mutateDeleteFavoriteByKey } = useMutation({
    mutationFn: deleteFavoriteByKey,
    onSuccess: () => {
      refetchFavorites().catch(() => {
        /* empty */
      });
    },
  });

  const formatDate = useCallback((timestamp: number): string => new Date(timestamp).toLocaleString(), []);

  const handleLoadButtonClick: MouseEventHandler = useCallback(() => {
    refetchOperations().catch(() => {
      /* empty */
    });
  }, [refetchOperations]);

  const handleApplyButtonClick: MouseEventHandler = useCallback(() => {
    if (operations !== undefined) {
      mutateRegisterOperation(operations);
    }
  }, [operations, mutateRegisterOperation]);

  const handleFavoriteButtonClick: MouseEventHandler = useCallback(() => setShowSaveDialog(true), []);

  const handleFavoriteNameChange: ChangeEventHandler<HTMLInputElement> = useCallback((payload) => {
    setFavoriteName(payload.target.value);
  }, []);

  const handleCancelFavorite: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    setShowSaveDialog(false);
    setFavoriteName('');
  }, []);

  const handleSaveFavorite: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    if (operations !== undefined && favoriteName.trim() !== '') {
      mutateRegisterFavorite({ name: favoriteName, operations });
    }
  }, [favoriteName, mutateRegisterFavorite, operations]);

  const handleSelectFavorite: ChangeEventHandler<HTMLSelectElement> = useCallback(
    (payload) => {
      const key = payload.target.value;
      setSelectedFavoriteKey(key);

      if (key !== '') {
        mutateGetFavoriteByKey(key);
      }
    },
    [mutateGetFavoriteByKey]
  );

  const handleDeleteFavorite = useCallback(() => {
    if (selectedFavoriteKey !== '') {
      mutateDeleteFavoriteByKey(selectedFavoriteKey);
    }
  }, [mutateDeleteFavoriteByKey, selectedFavoriteKey]);

  const max = import.meta.env.VITE_MAX_FAVORITES;

  return (
    <div className="flex flex-col py-4">
      <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 px-2">
        <Button onClick={handleLoadButtonClick} size="small">
          {t('button.load')}
        </Button>
        <Button onClick={handleApplyButtonClick} size="small">
          {t('button.apply')}
        </Button>
        <Button onClick={handleFavoriteButtonClick} size="small">
          {t('button.favorite')}
        </Button>

        {favorites !== undefined && favorites.length > 0 && (
          <div className="flex items-center gap-x-2">
            <select
              className="border-medium-tint bg-light-tint text-text-primary rounded border px-2 py-1 text-xs"
              value={selectedFavoriteKey}
              onChange={handleSelectFavorite}
            >
              <option value="" className="text-text-secondary">
                {t('select.label')}
              </option>
              {favorites.map((favorite) => (
                <option key={favorite.key} value={favorite.key}>
                  {favorite.name} - {formatDate(favorite.timestamp)}
                </option>
              ))}
            </select>
            {selectedFavoriteKey && (
              <Button onClick={handleDeleteFavorite} size="small" variant="destructive">
                {t('button.delete')}
              </Button>
            )}
          </div>
        )}
      </div>

      {showSaveDialog && (
        <div className="bg-dark-shade/75 fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-light-tint w-full max-w-md rounded p-4 shadow-lg">
            <h3 className="text-text-secondary mb-4 text-lg font-medium">{t('dialog.title')}</h3>
            <div className="mb-4">
              <label className="text-text-primary mb-1 block text-sm font-medium">{t('dialog.nameLabel')}</label>
              <input
                type="text"
                className="border-medium text-text-primary w-full rounded-md border px-3 py-2"
                value={favoriteName}
                onChange={handleFavoriteNameChange}
              />
              <p className="text-text-secondary mt-1 text-xs">{t('note.favorite', { max })}</p>
            </div>
            <div className="flex justify-end gap-x-2">
              <Button onClick={handleCancelFavorite} size="small">
                {t('button.cancel')}
              </Button>
              <Button onClick={handleSaveFavorite} size="small" disabled={!favoriteName.trim()}>
                {t('button.save')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {operations !== undefined && <OperationsTable data={operations}></OperationsTable>}
    </div>
  );
};
