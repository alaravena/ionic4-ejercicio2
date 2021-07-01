import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule }  from '@ionic/angular';

import { EncabezadoComponent } from './encabezado/encabezado.component';

@NgModule({
  declarations: [
    EncabezadoComponent,
    //aqui declaramos todos los componentes
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    EncabezadoComponent,
    //aqui exportamos todos los componentes
  ]
})
export class ComponentsModule { }
