import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useMemo, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { type Operation } from '../../interfaces/operation.interface';

interface Props {
  data: Operation[];
}

export const OperationsTable: FC<Props> = ({ data }) => {
  const { t } = useTranslation();

  const columns = useMemo<ColumnDef<Operation>[]>(
    () => [
      {
        header: t('operation.category'),
        accessorKey: 'category.name',
      },
      {
        header: t('operation.hour'),
        accessorKey: 'hour',
      },
      {
        header: t('operation.comment'),
        accessorKey: 'comment',
      },
      {
        header: t('operation.devFunction'),
        accessorKey: 'devFunction.name',
      },
      {
        header: t('operation.devPhase'),
        accessorFn: (row): string | undefined =>
          !['0', undefined].includes(row.devPhase.id) ? row.devPhase.name : undefined,
      },
      {
        header: t('operation.devSubphase'),
        accessorFn: (row): string | undefined =>
          !['0', undefined].includes(row.devSubphase.id) ? row.devSubphase.name : undefined,
      },
    ],
    [t]
  );

  const table = useReactTable<Operation>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <table className="w-full table-fixed">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="border-b-1 bg-medium-shade border-medium-shade px-2 py-1">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().flatRows.length > 0 ? (
            table.getRowModel().flatRows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-b-1 border-medium-shade px-2 py-1">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="border-b-1 border-medium-shade px-4 py-2 text-center">
                {t('feedback.empty')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
