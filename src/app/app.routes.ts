import { Routes } from '@angular/router';
import { Instructor } from './instructor/instructor';
import { Erudite } from './erudite/erudite';
import { Landingpage } from './landingpage/landingpage';
import { Signup } from './signup/signup';
import { Login } from './login/login';
import { Notfound } from './notfound/notfound';

export const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' }, // ✅ default route
  { path: 'landing', component: Landingpage },
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'instructor', component: Instructor, },
  { path: 'student', component: Erudite, },
  { path: '404page', component: Notfound },
  { path: '**', redirectTo: '404page' } // ✅ wildcard last
];
