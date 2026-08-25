// -------------------------------------------------------
// Mannat Events — Reference Package Config
// Holds reference-only Social packages and other static configs.
// -------------------------------------------------------

export interface SocialPackage {
  id: string
  name: string
  type: 'veg' | 'non-veg' | 'mixed'
  pricePerHead: number
  description: string
}

// Social Packages (Reference Only - not shown in user-facing wizard)
export const SOCIAL_VEG_DINNER_PACKAGES: SocialPackage[] = [
  { id: 'social-veg-gold', name: 'Gold Social Veg Dinner', type: 'veg', pricePerHead: 2100, description: 'Standard social veg dinner package' },
  { id: 'social-veg-platinum', name: 'Platinum Social Veg Dinner', type: 'veg', pricePerHead: 2800, description: 'Premium social veg dinner package' },
  { id: 'social-veg-diamond', name: 'Diamond Social Veg Dinner', type: 'veg', pricePerHead: 3600, description: 'Elite social veg dinner package' },
]

export const SOCIAL_GATHERING_PACKAGES: SocialPackage[] = [
  { id: 'social-gathering-silver', name: 'Silver Social Gathering', type: 'mixed', pricePerHead: 1400, description: 'Basic gathering package' },
  { id: 'social-gathering-gold', name: 'Gold Social Gathering', type: 'mixed', pricePerHead: 2100, description: 'Standard gathering package' },
  { id: 'social-gathering-platinum', name: 'Platinum Social Gathering', type: 'mixed', pricePerHead: 2800, description: 'Premium gathering package' },
  { id: 'social-gathering-diamond', name: 'Diamond Social Gathering', type: 'mixed', pricePerHead: 3600, description: 'Elite gathering package' },
]
