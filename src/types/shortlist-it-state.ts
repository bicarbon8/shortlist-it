import { Shortlist } from "./shortlist";

export type ShortlistItState = {
    lists: Array<Shortlist>,
    showArchived: boolean,
    listToBeDeleted?: string;
    filterText: string;
    editingListMap: Map<string, boolean>
    editingListEntryMap: Map<string, boolean>
};