import axios from 'axios';
import { Token } from '../../../types/blockchain';

export async function getTokenList(url: string) {
  const response = await axios.get(url);
  return response.data.tokens as Token[];
}



