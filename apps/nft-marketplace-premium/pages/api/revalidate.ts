// pages/api/revalidate.js

import { NextApiRequest, NextApiResponse } from "next/types"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse) {
  // Check for secret to confirm this is a valid request
  if (req.query.revalidate_secret !== process.env.REVALIDATE_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    // We revalidate next js api related to home page
    await res.revalidate(`/_site/${req.query.domain}`)
    return res.json({ revalidated: true })
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}