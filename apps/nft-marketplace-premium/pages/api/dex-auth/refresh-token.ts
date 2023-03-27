import type { NextApiRequest, NextApiResponse } from 'next';
import { requestAccestoken } from 'src/services/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await requestAccestoken({ refreshToken: req.cookies.refresh_token as string })
  const data = (await response.data);
  return res.status(response.status).json({ access_token: data.access_token });
}
