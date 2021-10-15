import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KitRoutingModule } from './kit-routing.module';
import { KitComponent } from './kit.component';


@NgModule({
  declarations: [
    KitComponent
  ],
  imports: [
    CommonModule,
    KitRoutingModule
  ]
})
export class KitModule { }
