import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { login } from 'src/services/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { address, signature } = req.body.data;
    const response = await login({ address, signature });
    const data = (await response.data);
    console.log('refresh_token on login', data.refresh_token);
    res.setHeader('Set-Cookie', [serialize('refresh_token', data.refresh_token, { httpOnly: true, path: '/', }), serialize('refresh_token_auth', data.refresh_token, { httpOnly: true })]);
    return res.status(response.status).json({ access_token: data.access_token });
  }
  throw new Error('not authorized')

}
