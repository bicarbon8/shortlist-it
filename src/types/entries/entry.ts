export type Entry = {
    id: string;
    description?: string;
    ranking?: number;
    values: Map<string, Array<string>>;
};