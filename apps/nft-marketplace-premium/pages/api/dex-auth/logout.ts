import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { logout } from 'src/services/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Set-Cookie', [serialize('refresh_token', ''), serialize('refresh_token_auth', '')]);
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.substring(7, authHeader.length);
  const response = await logout({ accessTk: token });
  const data = (await response.data);
  return res.status(response.status).json(data)
}
