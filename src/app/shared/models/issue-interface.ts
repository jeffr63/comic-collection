export interface Issue {
  publisher: string;
  title: string;
  issue: number | null;
  coverPrice: number;
  url: string;
  id?: number | null;
}

export interface IssueChartData {
  name: string;
  value: number;
}
