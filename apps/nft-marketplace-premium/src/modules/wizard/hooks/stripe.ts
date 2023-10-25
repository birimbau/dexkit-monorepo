import { useMutation, useQuery } from "@tanstack/react-query";
import { getCheckSiteStripeSubscription, getSiteCancelSubscription, getSiteStripeCheckout } from "../services/stripe";

const CHECK_STRIPE_SUBSCRIPTION = 'CHECK_STRIPE_SUBSCRIPTION';

export function useCheckStripeSubscriptionQuery({ siteId }: { siteId?: number }) {

  return useQuery([CHECK_STRIPE_SUBSCRIPTION, siteId], async () => {
    if (!siteId) {
      return;
    }
    return await getCheckSiteStripeSubscription({ siteId });
  })
}

export function useSiteStripeCheckoutMutation() {

  return useMutation(async ({ siteId }: { siteId?: number }
  ) => {
    if (!siteId) {
      return;
    }
    return await getSiteStripeCheckout({ siteId });
  })
}

export function useSiteCancelSubscriptionMutation() {

  return useMutation(async ({ siteId }: { siteId?: number }
  ) => {
    if (!siteId) {
      return;
    }
    return await getSiteCancelSubscription({ siteId });
  })
}