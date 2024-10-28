import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuscripcionPage } from './suscripcion.page';

const routes: Routes = [
  {
    path: '',
    component: SuscripcionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuscripcionPageRoutingModule {}
