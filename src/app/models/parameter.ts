export class Parameter {
  id: string = '';
  type:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'month'
    | 'week'
    | 'url'
    | 'tel'
    | 'search'
    | 'radio'
    | 'checkbox'
    | 'color' = 'text';
  value: any = null;
  label: string = '';
  min?: number = 0;
  max?: number = 100;
  store?: any = [];
}
