import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuscripcionPageRoutingModule } from './suscripcion-routing.module';

import { SuscripcionPage } from './suscripcion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuscripcionPageRoutingModule
  ],
  declarations: [SuscripcionPage]
})
export class SuscripcionPageModule {}
