import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderBumpRoutingModule } from './order-bump-routing.module';
import { OrderBumpComponent } from './order-bump.component';


@NgModule({
  declarations: [
    OrderBumpComponent
  ],
  imports: [
    CommonModule,
    OrderBumpRoutingModule
  ]
})
export class OrderBumpModule { }
