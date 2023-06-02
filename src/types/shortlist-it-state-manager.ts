import { ShortlistItState } from "./shortlist-it-state";

export type ShortlistItStateManager = {
    readonly state: ShortlistItState,
    setState: React.Dispatch<React.SetStateAction<ShortlistItState>>;
};