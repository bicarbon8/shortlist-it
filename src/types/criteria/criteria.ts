import { CriteriaType } from "./criteria-type";

export type Criteria = {
    id: string;
    name?: string;
    type?: CriteriaType;
    values: Array<string>;
    allowMultiple?: boolean;
    weight: number;
};