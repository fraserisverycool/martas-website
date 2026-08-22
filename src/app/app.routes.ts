import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { PortfolioComponent } from './components/portfolio/portfolio';
import { ProjectsComponent } from './components/projects/projects';
import { AboutComponent } from './components/about/about';
import { ContactComponent } from './components/contact/contact';
import { AdminComponent } from './components/admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'marta', component: AdminComponent },
];
