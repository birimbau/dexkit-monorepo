import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";


const subscription = async (req: NextApiRequest, res: NextApiResponse) => {
  const { siteId } = req.query as { siteId: string };
  if (!siteId) {
    return res.status(401).json({ message: "You must pass a site Id." });
  }


  if (req.method !== "GET") {
    return res.status(400).json({
      error: "Invalid method. Only GET supported.",
    });
  }

  const refreshToken = req.cookies?.refresh_token_auth || req.cookies?.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({
      error: "Must be logged in to cancel a subcription",
    });
  }

  /*const { data } = await getUserByRefreshToken({ refreshToken })
  const user = data;
  const { data: siteData } = await getSiteById(siteId);
  console.log(user);

  if ((user as any)?.accounts[0].address.toLowerCase() !== siteData?.address.toLowerCase()) {
    return res.status(401).json({
      error: "Must be owner to cancel a subcription",
    });
  }*/

  const { STRIPE_SECRET_KEY } = process.env;
  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({
      error: "Stripe secret key not set",
    });
  }

  const domain = 'https://dexappbuilder.dexkit.com'


  if (!domain) {
    return res
      .status(500)
      .send("Missing NEXT_PUBLIC_AUTH_DOMAIN environment variable");
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });

  // Find associated stripe customer with user wallet
  const customers = await stripe.customers.search({
    query: `metadata["siteId"]:"${siteId}"`,
  });

  if (customers.data.length === 0) {
    // If there is no customer, then we know there is no subscription
    return res.status(200).json(`User  has no subscription.`);
  }

  // If there is a customer, then we can check if they have a subscription
  const customer = customers.data[0];
  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
  });

  if (subscriptions?.data.length === 0) {
    // If there is no subscription, return
    return res.status(200).json(`User  has no subscription.`);
  }


  const deleted = await stripe.subscriptions.cancel(subscriptions?.data[0].id);
  // If there is a subscription, return the subscription ID
  return res
    .status(200)
    .json(
      deleted
    );
};

export default subscription;