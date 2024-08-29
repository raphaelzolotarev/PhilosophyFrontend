import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component'; 
import { HomeComponent } from './home/home.component';
import { TermsComponent } from './terms/terms.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { BlogComponent } from './blog/blog.component';
import { CommunityComponent } from './community/community.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }  ,
  { path: 'contact', component: ContactComponent }  ,
  { path: 'terms', component: TermsComponent }  ,
  { path: 'signin', component: SigninComponent }  ,
  { path: 'signup', component: SignupComponent }  ,
  { path: 'blog', component: BlogComponent }  ,
  { path: 'community', component: CommunityComponent }  
];

