export interface Issue {
  id: number;
  publisher: string;
  title: string;
  issue: number;
  coverPrice: number;
  includes: string;
}

export interface IssueData {
  name: string;
  value: number;
}
