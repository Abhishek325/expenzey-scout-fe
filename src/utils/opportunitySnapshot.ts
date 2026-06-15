import type {
  OpportunityDetail,
  OpportunityStateRecord,
  OpportunityStateSnapshot,
} from "@/types/ai";

export function buildOpportunitySnapshot(
  item: OpportunityDetail,
  actionProgress?: { completed: number[] },
): OpportunityStateSnapshot {
  return {
    id: item.id,
    type: item.type,
    badge: item.badge,
    priority: item.priority,
    title: item.title,
    description: item.description,
    recommendation: item.recommendation,
    impactLevel: item.impactLevel,
    listMetric: item.listMetric,
    estimatedImpact: item.estimatedImpact,
    productName: item.productName,
    productImageUrl: item.productImageUrl,
    actions: item.actions,
    ...(actionProgress ? { actionProgress } : {}),
  };
}

export function getCompletedActionIndices(record?: OpportunityStateRecord): number[] {
  return record?.snapshot?.actionProgress?.completed ?? [];
}
