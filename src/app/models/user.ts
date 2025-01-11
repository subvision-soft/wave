import {Category} from './category';

export interface User {
  id: number;
  label: string;
  firstname: string;
  lastname: string;
  category: Category;
}
