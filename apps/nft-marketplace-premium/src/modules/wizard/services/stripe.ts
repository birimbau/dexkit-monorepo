import axios from 'axios';

export async function getCheckSiteStripeSubscription({ siteId }: { siteId: number }) {
  return await axios.get(`/api/stripe/site/subscription?siteId=${siteId}`, { withCredentials: true });

}

export async function getSiteStripeCheckout({ siteId }: { siteId: number }) {
  return await axios.get(`/api/stripe/site/checkout?siteId=${siteId}`, { withCredentials: true });
}

export async function getSiteCancelSubscription({ siteId }: { siteId: number }) {
  return await axios.get(`/api/stripe/site/cancel-subscription?siteId=${siteId}`, { withCredentials: true });
}