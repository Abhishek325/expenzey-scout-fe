import type { OpportunityDetail } from "@/types/ai";

export interface OpportunityLockedPreview {
  title: string;
  type: string;
}

export interface OpportunitiesListResponse {
  items: OpportunityDetail[];
  freeVisibleCount: number;
  lockedCount: number;
  lockedPreviews: OpportunityLockedPreview[];
  total: number;
}
