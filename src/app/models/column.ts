export interface Column {
  key: string;
  name: string;
  width: string;
  type: 'sort' | 'action' | 'view' | '';
  position?: 'right' | 'left';
  sortDefault?: boolean;
}
