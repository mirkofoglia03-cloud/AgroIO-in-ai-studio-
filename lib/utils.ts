import type { SubscriptionPlan } from '../types';

export const isFeatureAllowed = (
  featurePlan: SubscriptionPlan | 'All',
  userPlan: SubscriptionPlan | null
): boolean => {
  if (!userPlan) return false;
  if (featurePlan === 'All') return true;
  
  const planHierarchy = {
    'Gratis': 1,
    'Pro': 2,
    'Business': 3,
  };

  return planHierarchy[userPlan] >= planHierarchy[featurePlan];
};
