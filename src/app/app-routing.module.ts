import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'curso',
    loadChildren: () => import('./curso/curso.module').then( m => m.CursoPageModule)
  },
  {
    path: 'suscripcion/:id/:name/:autor',
    loadChildren: () => import('./suscripcion/suscripcion.module').then(m => m.SuscripcionPageModule)
  },
  {
    path: 'perfil-ajeno/:uid',
    loadChildren: () => import('./perfil-ajeno/perfil-ajeno.module').then( m => m.PerfilAjenoPageModule)
  },
  
  {
    path: 'carrito',
    loadChildren: () => import('./carrito/carrito.module').then(m => m.CarritoPageModule)
  }
  

  


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
