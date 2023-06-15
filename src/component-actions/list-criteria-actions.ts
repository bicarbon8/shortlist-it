import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";

export function startEditingCriteria(criteriaId: string, stateMgr: ShortlistItStateManager): void {
    stateMgr.state.editingCriteriaId = criteriaId;
    stateMgr.setState({...stateMgr.state});
}

export function stopEditingCriteria(stateMgr: ShortlistItStateManager): void {
    stateMgr.state.editingCriteriaId = null;
    stateMgr.setState({...stateMgr.state});
}