import { NextApiRequest, NextApiResponse } from "next";


export default function handler(req: NextApiRequest,
  res: NextApiResponse) {

  const domain = req.headers.host;


  const robots =
    `# *
User-agent: *
Allow: /
  
# Host
Host: ${domain}
  
# Sitemaps
Sitemap: ${domain}/sitemap.xml
  `;
  res.send(robots);
}