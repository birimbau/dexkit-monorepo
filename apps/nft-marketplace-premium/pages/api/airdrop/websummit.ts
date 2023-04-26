import type { NextApiRequest, NextApiResponse } from 'next';
import { myAppsApi } from 'src/services/whitelabel';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const refreshToken = req.cookies.refresh_token_auth;
  if (!refreshToken) {
    return res.status(401).json({ message: "You must be logged on app." });

  }
  if (req.headers['x-vercel-ip-country'] !== 'BR' && req.headers['x-vercel-ip-country-region'] !== 'Rio de Janeiro') {
    return res.status(401).json({ message: "You not attend requirements for airdrop." });
  }
  console.log(req.headers['x-vercel-ip-country']);
  console.log(req.headers['x-vercel-ip-country-region'])

  const { data } = await myAppsApi.post<{ txHash: string }>('/campaign/claim/1', {
    headers: {
      'Authorization': `Bearer ${refreshToken}`,
      'DexKit-Api-Key': process.env.MARKETPLACE_API_KEY as string
    }
  })

  return res.status(200).json({ txHash: data.txHash });
}
