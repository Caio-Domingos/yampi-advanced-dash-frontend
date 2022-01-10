import { MaterialAngularBundleModule } from './../../core/material-angular/material-angular-bundle.module';
import { ProductsPickerComponent } from './../../core/components/products-picker/products-picker.component';
import { ComponentsModule } from './../../core/components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KitRoutingModule } from './kit-routing.module';
import { KitComponent } from './kit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KitSelectorComponent } from './kit-selector/kit-selector.component';

@NgModule({
  declarations: [KitComponent, KitSelectorComponent],
  imports: [
    CommonModule,
    KitRoutingModule,
    ComponentsModule,
    MaterialAngularBundleModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [ProductsPickerComponent],
})
export class KitModule {}
