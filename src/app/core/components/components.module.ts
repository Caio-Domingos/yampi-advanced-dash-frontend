import { MaterialAngularBundleModule } from './../material-angular/material-angular-bundle.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsPickerComponent } from './products-picker/products-picker.component';

@NgModule({
  declarations: [ProductsPickerComponent],
  imports: [CommonModule, MaterialAngularBundleModule],
  exports: [ProductsPickerComponent],
  entryComponents: [ProductsPickerComponent],
})
export class ComponentsModule {}
