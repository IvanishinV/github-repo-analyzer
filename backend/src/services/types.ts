export type RepoResult =
    | { fullName: string; data: RepositoryDetails }
    | { fullName: string; error: string };

export type RepositoryDetails = {
    fullName: string;
    name: string;
    owner: string;
    size: number;
    visibility: "private" | "public";
    numberOfFiles: number;
    sampleYmlPath: string | null;
    sampleYmlContent: string | null;
    activeWebhooks: Array<{ id: number | string; url: string | null; events: string[]; active: boolean }>;
};
