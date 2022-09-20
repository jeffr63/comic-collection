export interface Issue {
  id: number | null;
  publisher: string;
  title: string;
  issue: number | null;
  coverPrice: number;
  supporting: string;
  antagonist: string;
}

export interface IssueData {
  name: string;
  value: number;
}
