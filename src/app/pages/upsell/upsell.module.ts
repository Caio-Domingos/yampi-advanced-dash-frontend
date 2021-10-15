import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpsellRoutingModule } from './upsell-routing.module';
import { UpsellComponent } from './upsell.component';


@NgModule({
  declarations: [
    UpsellComponent
  ],
  imports: [
    CommonModule,
    UpsellRoutingModule
  ]
})
export class UpsellModule { }
