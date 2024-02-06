import { GetServerSideProps } from "next";

function generateSiteMap({ urls, baseUrl }: { urls: string[], baseUrl: string }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
  <! - Add the static URLs manually →
  <url>
  <loc>${baseUrl}</loc>
  </url>
  ${urls
      .map((url) => {
        return `
  <url>
  <loc>${`${url}`}</loc>
  <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  `;
      })
      .join("")}
  </urlset>
  `;
}
type Params = {
  site?: string;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {

  // Generate the XML sitemap with the blog data
  const sitemap = generateSiteMap({ urls: [], baseUrl: 'localhost:3000' });
  res.setHeader("Content-Type", "text/xml");
  // Send the XML to the browser
  res.write(sitemap);
  res.end();
  return {
    props: {},
  };
}
export default function SiteMap() { }