import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";


const checkout = async (req: NextApiRequest, res: NextApiResponse) => {
  const { siteId } = req.query as { siteId: string };
  if (!siteId) {
    return res.status(401).json({ message: "You must pass a site Id." });
  }
  console.log(req.url);


  if (req.method !== "GET") {
    return res.status(400).json({
      error: "Invalid method. Only GET supported.",
    });
  }

  /*const refreshToken = req.cookies?.refresh_token_auth || req.cookies?.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({
      error: "Must be logged in to create a checkout session",
    });
  }

  const { data } = await getUserByRefreshToken({ refreshToken })

  const {data: siteData} = await getSiteById(siteId);
  const user = data;
  if(siteData.owner.toLowerCase() !== user.address.toLowerCase()){
    return res.status(401).json({
      error: "You are not owner of this site",
    });
  }*/

  const { STRIPE_SECRET_KEY, } =
    process.env;

  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({
      error: "Stripe secret key not set",
    });
  }
  const domain = 'https://dexappbuilder.dexkit.com'


  if (!domain) {
    return res
      .status(500)
      .send("Missing NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN environment variable");
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });

  // Check for stripe customers already associated with site Id
  const customers = await stripe.customers.search({
    query: `metadata["siteId"]:"${siteId}"`,
  });

  let customer;
  if (customers.data.length > 0) {
    // If there is already a customer for this wallet, use it
    customer = customers.data[0];
  } else {
    // Otherwise create a new customer associated with this siteId
    customer = await stripe.customers.create({
      metadata: {
        siteId: siteId,
      },
    });
  }

  // Finally, create a new checkout session for the customer to send to the client-side
  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    success_url: domain,
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    cancel_url: domain,
    mode: "subscription",
  });

  return res.status(200).json(session);
};

export default checkout;