import { CriteriaType } from "./criteria-type";

export type Criteria = {
    name: string;
    type: CriteriaType;
    values?: Array<string>;
    multiple?: boolean;
};