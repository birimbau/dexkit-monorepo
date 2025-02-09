import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import ContractButton from '@dexkit/web3forms/components/ContractButton';

import {
  useDeployableContractsQuery
} from '@dexkit/web3forms/hooks/forms';



import { useRouter } from 'next/router';
import useParams from './containers/hooks/useParams';


export default function DexAppBuilderCreate() {
  const router = useRouter();

  const deployableContractsQuery = useDeployableContractsQuery();


  const { setContainer } = useParams();

  return (
    <>
      <Container>
        <Stack spacing={2}>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4">
                  <FormattedMessage
                    id="deploy.your.contract"
                    defaultMessage="Deploy your contract"
                  />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {deployableContractsQuery.data?.map((contract, key) => (
                    <Grid item xs={12} sm={4} key={key}>
                      <ContractButton
                        title={contract.name}
                        description={contract.description}
                        creator={{
                          imageUrl: contract.publisherIcon,
                          name: contract.publisherName,
                        }}
                        onClick={() => setContainer('dexappbuilder.deploy.contract', { slug: contract.slug, creator: 'thirdweb' })}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
