import { Category } from './category';
import { Target } from './target';

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  category: Category;
  targets: Target[];
}
