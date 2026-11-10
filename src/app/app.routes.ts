import { Routes } from '@angular/router';
import { Signin } from './features/signin/signin';
import { Signup } from './features/signup/signup';

export const routes: Routes = [
    { path: '', component: Signin },
    { path: 'signup', component: Signup },

];
