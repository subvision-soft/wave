import { Target } from '@angular/compiler';

interface Session {
  date: Date;
  description: string;
  title: string;
  targets: Target[];
  users: User[];
}
