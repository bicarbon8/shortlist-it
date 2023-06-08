import { Criteria } from "./criteria/criteria";
import { Shortlist } from "./shortlist";

export type ShortlistItState = {
    lists: Array<Shortlist>,
    showArchived: boolean,
    listToBeDeleted?: string;
    criteriaToBeDeleted?: string;
    entryToBeDeleted?: string;
    filterText: string;
    editingListMap: Map<string, boolean>
    editingListEntryMap: Map<string, boolean>
    criteriaTemplates: Map<string, Omit<Criteria, 'id'>>
};