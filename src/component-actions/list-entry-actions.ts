import { Entry } from "../types/entries/entry";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";

export function startEditingEntry(entryId: string, stateMgr: ShortlistItStateManager): void {
    stateMgr.state.editingEntryId = entryId;
    stateMgr.setState({...stateMgr.state});
}

export function stopEditingEntry(stateMgr: ShortlistItStateManager): void {
    stateMgr.state.editingEntryId = null;
    stateMgr.setState({...stateMgr.state});
}

export function getEntry(entryId: string, stateMgr: ShortlistItStateManager): Entry {
    let entry: Entry;
    const list = stateMgr.state.lists.find(l => l.entries.find(e => {
        if (e.id === entryId) {
            entry = e;
        }
        return entry != null;
    }));
    entry.listId = list.id;
    return entry;
}