import { useUserEventsList } from '@dexkit/ui/hooks/userEvents';
import { Paper, Table, TableBody } from '@mui/material';
import { useState } from 'react';
import { myAppsApi } from 'src/services/whitelabel';
import { TransferUserEvent } from '../../types/events';
import TableRowSkeleton from './TableRowSkeleton';
import TransferUserEventsTable from './TransferUserEventsTable';

export interface TransferUserEventsDataProps {
  siteId?: number;
}

export default function TransferUserEventsData({
  siteId,
}: TransferUserEventsDataProps) {
  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {
      type: 'transfer',
    },
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useUserEventsList<TransferUserEvent>({
    instance: myAppsApi,
    ...paginationModel,
    ...queryOptions,
    siteId,
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <Table>
          <TableBody>
            {new Array(5).fill(null).map((_, key) => (
              <TableRowSkeleton key={key} cells={5} />
            ))}
          </TableBody>
        </Table>
      );
    }

    return (
      <TransferUserEventsTable
        events={
          data?.data.map(
            (e) =>
              ({
                ...e.processedMetadata,
              }) as TransferUserEvent,
          ) || []
        }
      />
    );
  };

  return <Paper>{renderContent()}</Paper>;
}
