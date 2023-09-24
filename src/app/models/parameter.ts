import { ParameterType } from './parameter-type';

export class Parameter {
  id: string = '';
  type: ParameterType = ParameterType.Text;
  value: any = null;
  label: string = '';
  min?: number = 0;
  max?: number = 100;
  store?: any = [];
}
