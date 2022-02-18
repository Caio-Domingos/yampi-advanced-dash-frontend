import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderBumpRoutingModule } from './order-bump-routing.module';
import { OrderBumpComponent } from './order-bump.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/core/components/components.module';
import { MaterialAngularBundleModule } from 'src/app/core/material-angular/material-angular-bundle.module';
import { OrderBumpSelectorComponent } from './order-bump-selector/order-bump-selector.component';

@NgModule({
  declarations: [OrderBumpComponent, OrderBumpSelectorComponent],
  imports: [
    CommonModule,
    OrderBumpRoutingModule,
    MaterialAngularBundleModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class OrderBumpModule {}
