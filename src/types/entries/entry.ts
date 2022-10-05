export type Entry = {
    description: string;
    ranking?: number;
    values?: Map<string, string | Array<string>>;
};