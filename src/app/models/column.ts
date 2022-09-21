export interface Column {
  key: string;
  name: string;
  width: string;
  type: 'sort' | 'currency_sort' | 'link' | 'action' | 'view' | '';
  position?: 'right' | 'left';
  sortDefault?: boolean;
}
