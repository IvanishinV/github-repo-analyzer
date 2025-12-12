export interface Webhook {
  id: string;
  url: string | null;
  events: string[];
  active: boolean;
}

export interface RepositoryDetails {
  fullName: string;
  name: string;
  owner: string;
  size: number;
  visibility: string;
  numberOfFiles: number;
  sampleYmlPath?: string | null;
  sampleYmlContent?: string | null;
  activeWebhooks: Webhook[];
}

export interface RepoResult {
  fullName: string;
  data?: RepositoryDetails | null;
  error?: string | null;
}
