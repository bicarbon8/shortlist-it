import { Criteria } from "./criteria/criteria";
import { Shortlist } from "./shortlist";

export type ShortlistItState = {
    lists: Array<Shortlist>;
    showArchived: boolean;
    listToBeDeleted?: string;
    criteriaToBeDeleted?: string;
    criteriaTemplateToBeDeleted?: string;
    entryToBeDeleted?: string;
    filterText: string;
    editingListTitleMap: Map<string, boolean>;
    editingEntryId?: string;
    editingCriteriaId?: string;
    criteriaTemplates: Map<string, Omit<Criteria, 'id'>>;
    showAddCriteriaModalForList?: string;
};