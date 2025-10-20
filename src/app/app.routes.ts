import { Routes } from '@angular/router';
import { Instructor } from './instructor/instructor';
import { Erudite } from './erudite/erudite';

export const routes: Routes = [
  { path: 'instructor', component: Instructor },
  { path: 'erudite', component: Erudite },
  {path: '', redirectTo: 'instructor', pathMatch: 'full' }
];
