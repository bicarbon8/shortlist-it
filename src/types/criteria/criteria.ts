import { ElementHelper } from "../../utilities/element-helper";
import { CriteriaType } from "./criteria-type";

export type Criteria = {
    id: string;
    name?: string;
    type?: CriteriaType;
    values: Array<string>;
    allowMultiple?: boolean;
    weight: number;
    listId?: string;
};

export module Criteria {
    export function nameToElementId(name: string): string {
        const formatted = ElementHelper.idEncode(name) ?? 'unknown';
        return `criteria-name-${formatted}`;
    }
}