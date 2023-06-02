import ContractFormView from '@dexkit/web3forms/components/ContractFormView';
import { Container } from '@mui/material';
import { ContractPageSection } from '../../types/section';

export interface Props {
  section?: ContractPageSection;
}

export default function ContractSection({ section }: Props) {
  return (
    <Container sx={{ py: 2 }}>
      {section?.config ? <ContractFormView params={section?.config} /> : null}
    </Container>
  );
}
