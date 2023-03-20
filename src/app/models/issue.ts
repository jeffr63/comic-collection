export interface Issue {
  id?: number;
  publisher: string;
  title: string;
  issue: number | null;
  coverPrice: number;
  url: string;
}

export interface IssueData {
  name: string;
  value: number;
}
