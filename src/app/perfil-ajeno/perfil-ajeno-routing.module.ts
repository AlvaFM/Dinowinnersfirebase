import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilAjenoPage } from './perfil-ajeno.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilAjenoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilAjenoPageRoutingModule {}
