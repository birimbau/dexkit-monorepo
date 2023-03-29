import type { NextApiRequest, NextApiResponse } from 'next';
import { requestAccestoken } from 'src/services/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.cookies)
    const refreshToken = req.cookies.refresh_token_auth || req.cookies.refresh_token;
    const response = await requestAccestoken({ refreshToken: req.cookies.refresh_token_auth as string })
    const data = (await response.data);
    return res.status(response.status).json({ access_token: data.access_token });

  } catch {
    return res.status(500).json({ error: 'error' })
  }

}
