import { CriteriaType } from "./criteria-type";

export type Criteria = {
    name: string;
    criteriaType: CriteriaType;
    values: Array<string>;
    allowMultiple?: boolean;
};