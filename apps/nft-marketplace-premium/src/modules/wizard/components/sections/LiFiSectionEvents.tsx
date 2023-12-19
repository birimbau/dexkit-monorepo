import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';

import { UserEvents } from '@dexkit/core/constants/userEvents';
import { useTrackUserEventsMutation } from '@dexkit/ui/hooks/userEvents';
import type { Route } from '@lifi/sdk';
import { useWidgetEvents, WidgetEvent } from '@lifi/widget';

const LiFiSectionEvents = () => {
  const { chainId } = useWeb3React();
  const userEventsMutation = useTrackUserEventsMutation();

  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const onRouteExecutionCompleted = (route: Route) => {
      if (route.steps) {
        route.steps.forEach((step) => {
          if (step.execution) {
            if (step.execution.process) {
              step.execution.process.forEach((pr) => {
                if (pr.type === 'SWAP') {
                  userEventsMutation.mutate({
                    event: UserEvents.swapLifi,
                    metadata: JSON.stringify(step),
                    hash: pr.txHash,
                    chainId: chainId,
                  });
                }
              });
            }
          }
        });
      }
    };

    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );

    return () => widgetEvents.all.clear();
  }, [widgetEvents]);

  return <></>;
};

export default LiFiSectionEvents;
