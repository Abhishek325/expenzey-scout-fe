export interface SnapshotProduct {
  id: string;
  name: string;
  revenue: number;
  growthPercent: number;
}

export interface NeedsAttentionProduct {
  id: string;
  name: string;
  issue: string;
  metric: number;
}

export interface GrowthOpportunity {
  id: string;
  name: string;
  suggestion: string;
  potential: number;
}

export interface StoreSnapshot {
  bestPerformingProduct: SnapshotProduct | null;
  needsAttentionProduct: NeedsAttentionProduct | null;
  growthOpportunity: GrowthOpportunity | null;
}
