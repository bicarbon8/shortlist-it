import { v4 } from "uuid";
import { Criteria } from "../types/criteria/criteria";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { getList } from "./list-actions";

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