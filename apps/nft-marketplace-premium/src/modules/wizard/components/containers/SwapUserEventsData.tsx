import { useUserEventsList } from '@dexkit/ui/hooks/userEvents';
import { Paper, Table, TableBody } from '@mui/material';
import { useState } from 'react';
import { myAppsApi } from 'src/services/whitelabel';
import { SwapUserEvent } from '../../types/events';
import SwapUserEventsTable from './SwapUserEventsTable';
import TableRowSkeleton from './TableRowSkeleton';

export interface SwapUserEventsDataProps {
  siteId?: number;
}

export default function SwapUserEventsData({
  siteId,
}: SwapUserEventsDataProps) {
  const [queryOptions, setQueryOptions] = useState<any>({
    filter: {
      type: 'swap',
    },
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useUserEventsList<SwapUserEvent>({
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
      <SwapUserEventsTable
        events={
          data?.data.map(
            (e) =>
              ({
                ...e.processedMetadata,
                chainId: e.chainId,
                from: e.from,
                txHash: e.hash,
              }) as SwapUserEvent,
          ) || []
        }
      />
    );
  };

  return <Paper>{renderContent()}</Paper>;
}
