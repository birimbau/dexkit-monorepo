import { useQuery } from 'react-query';

export default function useUserCheckout({ id }: { id: string }) {
  return useQuery([], async () => {});
}
