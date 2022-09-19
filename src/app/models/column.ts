export interface Column {
  key: string;
  name: string;
  width: string;
  type: 'sort' | 'action' | '';
  position?: 'right' | 'left';
  sortDefault?: boolean;
}
