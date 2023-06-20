import { v4 } from "uuid";
import { Criteria } from "../types/criteria/criteria";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { getList, updateList } from "./list-actions";

export function startEditingCriteria(criteriaId: string, stateMgr: ShortlistItStateManager): void {
    stateMgr.state.editingCriteriaId = criteriaId;
    stateMgr.setState({...stateMgr.state});
}

export function stopEditingCriteria(stateMgr: ShortlistItStateManager): void {
    stateMgr.state.editingCriteriaId = null;
    stateMgr.setState({...stateMgr.state});
}

export function getCriteria(criteriaId: string, stateMgr: ShortlistItStateManager): Criteria {
    let criteria: Criteria;
    const list = stateMgr.state.lists.find(l => l.criteria.find(c => {
        if (c.id === criteriaId) {
            criteria = c;
        }
        return criteria != null;
    }));
    if (criteria) {
        criteria.listId = list?.id;
    }
    return criteria;
}

export function addNewCriteria(listId: string, stateMgr: ShortlistItStateManager, templateId?: string): void {
    const list = getList(listId, stateMgr);
    if (list) {
        let criteria: Criteria;
        if (templateId && stateMgr.state.criteriaTemplates.has(templateId)) {
            criteria = {
                ...stateMgr.state.criteriaTemplates.get(templateId),
                id: v4(),
                listId: listId
            };
        }
        if (!criteria) {
            criteria = {id: v4(), values: new Array<string>(), weight: 1};
        }
        list.criteria.push(criteria);
        updateList(listId, list, stateMgr);
        startEditingCriteria(criteria.id, stateMgr);
    }
}