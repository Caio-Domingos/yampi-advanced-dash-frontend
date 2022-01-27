import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpsellRoutingModule } from './upsell-routing.module';
import { UpsellComponent } from './upsell.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsPickerComponent } from 'src/app/core/components/products-picker/products-picker.component';
import { MaterialAngularBundleModule } from 'src/app/core/material-angular/material-angular-bundle.module';
import { UpsellSelectorComponent } from './upsell-selector/upsell-selector.component';
import { ComponentsModule } from 'src/app/core/components/components.module';

@NgModule({
  declarations: [UpsellComponent, UpsellSelectorComponent],
  imports: [
    CommonModule,
    UpsellRoutingModule,
    MaterialAngularBundleModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [ProductsPickerComponent],
})
export class UpsellModule {}
