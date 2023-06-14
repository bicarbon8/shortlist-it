export const CriteriaTypeArray = ['worst-to-best', 'yes-no', 'positives', 'negatives'] as const;
export type CriteriaType = typeof CriteriaTypeArray[number];