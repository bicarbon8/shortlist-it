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
        const formatted = name?.replace(/(\s)/g, '-') ?? 'unknown';
        return `criteria-name-${formatted}`;
    }
}