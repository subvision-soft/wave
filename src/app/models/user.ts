import { Category } from './category';
import { Target } from './target';

export interface User {
  id: string;
  name: string;
  category: Category;
  targets: Target[];
}
