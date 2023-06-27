import { Criteria } from "./criteria/criteria";
import { Shortlist } from "./shortlist";

export type ShortlistItState = {
    lists: Array<Shortlist>;
    showArchived: boolean;
    filterText: string;
    criteriaTemplates: Map<string, Omit<Criteria, 'id'>>;
    showAddCriteriaModalForList?: string;
};