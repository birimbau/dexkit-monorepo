import { isValidDecimal } from '@dexkit/core/utils';
import { useDexKitContext } from '@dexkit/ui';
import AppDataTableDialog from '@dexkit/ui/components/dialogs/AppDataTableDialog';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import {
  useContract,
  useContractRead,
  useNFTBalance,
} from '@thirdweb-dev/react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { SyntheticEvent, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useApproveForAll } from '../../hooks/thirdweb';
import ContractAdminTab from '../ContractAdminTab';
import ContractMetadataTab from '../ContractMetadataTab';
import SelectCollectionDialog from '../dialogs/SelectCollectionDialog';

export interface ContractAirdropErc1155ContainerProps {
  address: string;
  network: string;
}

export default function ContractAirdropErc1155Container({
  address,
  network,
}: ContractAirdropErc1155ContainerProps) {
  const { data: contract } = useContract(address as string);
  const [recipients, setRecipients] = useState<
    { address: string; tokenId: number }[]
  >([]);

  const [contractAddress, setContractAddress] = useState<string>();
  const { account } = useWeb3React();

  const { data: tokenContract } = useContract(
    contractAddress,
    'nft-collection',
  );

  const approve = useApproveForAll({ address: contractAddress, contract });

  const { chainId } = useWeb3React();

  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const { data: nftBalance } = useNFTBalance(tokenContract, account);

  const { data: isApprovedForAll } = useContractRead(
    tokenContract,
    'isApprovedForAll',
    [account, address],
  );

  const airdropMutation = useMutation(
    async ({
      recipients,
    }: {
      recipients: { address: string; tokenId: number }[];
    }) => {
      const metadata = await tokenContract?.metadata.get();

      if (!isApprovedForAll) {
        await approve.mutateAsync();
      }

      const values = {
        name: metadata?.name || '',
      };

      if (!account || !contractAddress) {
        return;
      }

      watchTransactionDialog.open('airdropErc1155', values);

      let call = await contract?.airdrop1155.drop.prepare(
        contractAddress,
        account,
        recipients.map((r) => ({
          recipient: r.address,
          tokenId: r.tokenId,
        })),
      );

      let tx = await call?.send();

      if (tx?.hash && chainId) {
        createNotification({
          type: 'transaction',
          subtype: 'airdropErc1155',
          metadata: {
            hash: tx.hash,
            chainId,
          },
          values: values,
        });

        watchTransactionDialog.watch(tx?.hash);
      }

      return await tx?.wait();
    },
  );

  const handleConfirm = (data: { [key: string]: string }[]) => {
    setRecipients(
      data.map((r) => ({ address: r.address, tokenId: parseInt(r.tokenId) })),
    );
  };

  const [showAirdrop, setShowAirdrop] = useState(false);

  const handleSelectRecipients = () => {
    setShowAirdrop(true);
  };

  const handleClose = () => {
    setShowAirdrop(false);
  };

  const handleAirdrop = async () => {
    await airdropMutation.mutateAsync({ recipients });
  };

  const [showSelectCollection, setShowSelectCollection] = useState(false);

  const handleCloseSelectCollection = () => {
    setShowSelectCollection(false);
  };

  const handleSelect = (address: string) => {
    setContractAddress(address);
    handleCloseSelectCollection();
  };

  const handleShowSelectToken = () => {
    setShowSelectCollection(true);
  };

  const [currTab, setCurrTab] = useState('airdrop');

  const handleChange = (e: SyntheticEvent, value: string) => {
    setCurrTab(value);
  };

  return (
    <>
      <AppDataTableDialog
        DialogProps={{
          open: showAirdrop,
          onClose: handleClose,
          fullWidth: true,
          maxWidth: 'lg',
        }}
        onConfirm={handleConfirm}
        value={recipients as any}
        dataColumns={[
          {
            headerName: 'Recipient',
            name: 'recipient',
            isValid: (value: unknown) => {
              return ethers.utils.isAddress(value as string);
            },
            editable: true,
          },
          {
            headerName: 'TokenId',
            name: 'tokenId',
            isValid: (value: unknown) => {
              return isValidDecimal(value as string, 0);
            },
            editable: true,
          },
          {
            headerName: 'Amount',
            name: 'amount',
            isValid: (value: unknown) => {
              return isValidDecimal(value as string, 0);
            },
            editable: true,
          },
        ]}
        title={
          <FormattedMessage
            id="nft.edition.airdrop"
            defaultMessage="NFT Edition Airdrop"
          />
        }
      />
      <SelectCollectionDialog
        DialogProps={{
          open: showSelectCollection,
          onClose: handleCloseSelectCollection,
          maxWidth: 'sm',
          fullWidth: true,
        }}
        onSelect={handleSelect}
        chainId={chainId}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Tabs value={currTab} onChange={handleChange}>
            <Tab
              value="airdrop"
              label={<FormattedMessage id="airdrop" defaultMessage="Airdrop" />}
            />
            <Tab
              value="metadata"
              label={
                <FormattedMessage id="metadata" defaultMessage="Metadata" />
              }
            />
            <Tab
              value="admin"
              label={<FormattedMessage id="admin" defaultMessage="Admin" />}
            />
          </Tabs>
        </Grid>
        {currTab === 'airdrop' && (
          <>
            <Grid item xs={12}>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Box sx={{ mb: !contractAddress ? 0.5 : 0 }}>
                          <Typography variant="caption" color="text.secondary">
                            <FormattedMessage
                              id="your.balance"
                              defaultMessage="Your balance"
                            />
                          </Typography>
                        </Box>
                        {contractAddress ? (
                          <Typography variant="h5">
                            {nftBalance?.toNumber()}
                          </Typography>
                        ) : (
                          <Button
                            onClick={handleShowSelectToken}
                            size="small"
                            variant="outlined"
                          >
                            <FormattedMessage
                              id="select.collection"
                              defaultMessage="Select collection"
                            />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Stack
                          spacing={2}
                          justifyContent="space-between"
                          direction="row"
                          alignItems="center"
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              <FormattedMessage
                                id="total.recipients"
                                defaultMessage="Total recipients"
                              />
                            </Typography>
                            <Typography variant="h5">
                              {recipients.length}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            disabled={airdropMutation.isLoading}
                            onClick={handleSelectRecipients}
                            variant="outlined"
                          >
                            <FormattedMessage
                              id="select.recipients"
                              defaultMessage="Select"
                            />
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={2}>
                <Divider />
                <Stack direction="row">
                  <Button
                    startIcon={
                      airdropMutation.isLoading ? (
                        <CircularProgress color="inherit" size="1rem" />
                      ) : undefined
                    }
                    disabled={
                      recipients.length === 0 ||
                      airdropMutation.isLoading ||
                      !contractAddress
                    }
                    onClick={handleAirdrop}
                    variant="contained"
                  >
                    <FormattedMessage id="airdrop" defaultMessage="Airdrop" />
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </>
        )}
        {currTab === 'metadata' && (
          <Grid item xs={12}>
            <ContractMetadataTab address={address} />
          </Grid>
        )}
        {currTab === 'admin' && (
          <Grid item xs={12}>
            <ContractAdminTab address={address} />
          </Grid>
        )}
      </Grid>
    </>
  );
}
