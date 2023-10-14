import { UserEvents } from '@dexkit/core/constants/userEvents';
import { serialize } from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next';
import { login } from 'src/services/auth';
import { myAppsApi } from 'src/services/whitelabel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { address, signature, siteId } = req.body.data;
    const response = await login({ address, signature });
    const data = (await response.data);
    res.setHeader('Set-Cookie', [serialize('refresh_token', data.refresh_token, { httpOnly: true, path: '/', }), serialize('refresh_token_auth', data.refresh_token, { httpOnly: true })]);
    myAppsApi.post('/user-events', { event: UserEvents.loginSignMessage, account: address, siteId }, {
      headers: {
        'DexKit-Api-Key': process.env.MARKETPLACE_API_KEY as string
      }
    })


    return res.status(response.status).json({ access_token: data.access_token });
  }
  throw new Error('not authorized')

}
