import { Entry } from "./entries/entry";
import { Criteria } from "./criteria/criteria";

export type Shortlist = {
    id: string;
    title?: string;
    criteria: Array<Criteria>;
    entries: Array<Entry>;
    archived?: boolean;
}