import { v4 } from "uuid";
import { Criteria } from "../types/criteria/criteria";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { getList, updateList } from "./list-actions";

export function getExistingCriteria(criteriaId: string, stateMgr: ShortlistItStateManager): Criteria {
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

export function generateCriteriaFromTemplate(listId: string, stateMgr: ShortlistItStateManager, templateId?: string): Criteria {
    const list = getList(listId, stateMgr);
    if (list) {
        let template: Omit<Criteria, 'id'>;
        if (templateId && stateMgr.state.criteriaTemplates.has(templateId)) {
            template = stateMgr.state.criteriaTemplates.get(templateId);
        }
        if (!template) {
            template = {values: new Array<string>(), weight: 1};
        }
        return {
            ...template,
            id: v4(),
            listId: listId
        };
    }
    return null;
}

export function deleteCriteria(listId: string, criteriaId: string, stateMgr: ShortlistItStateManager): Criteria {
    let criteria: Criteria;
    const list = getList(listId, stateMgr);
    if (list) {
        const index = list.criteria.findIndex(c => c.id === criteriaId);
        if (index >= 0) {
            criteria = list.criteria.splice(index, 1)?.[0];
            updateList(list.id, list, stateMgr);
        }
    }
    return criteria;
}

export function saveCriteria(criteria: Criteria, stateMgr: ShortlistItStateManager): void {
    const list = getList(criteria.listId, stateMgr);
    if (list) {
        const index = list.criteria.findIndex(c => c.id === criteria.id);
        if (index >= 0) {
            list.criteria.splice(index, 1, criteria);
        } else {
            list.criteria.push(criteria);
        }
        updateList(list.id, list, stateMgr);
    }
}

export function deleteCriteriaTemplate(templateName: string, stateMgr: ShortlistItStateManager): Omit<Criteria, 'id'> {
    const template = stateMgr.state.criteriaTemplates.get(templateName);
    if (template) {
        stateMgr.state.criteriaTemplates.delete(templateName);
        stateMgr.setState({...stateMgr.state});
    }
    return template;
}