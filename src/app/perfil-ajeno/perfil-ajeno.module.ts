import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilAjenoPageRoutingModule } from './perfil-ajeno-routing.module';

import { PerfilAjenoPage } from './perfil-ajeno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilAjenoPageRoutingModule
  ],
  declarations: [PerfilAjenoPage]
})
export class PerfilAjenoPageModule {}
