export interface Issue {
  id: number | null;
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
