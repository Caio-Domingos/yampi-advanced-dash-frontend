import { MaterialAngularBundleModule } from './../material-angular/material-angular-bundle.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsPickerComponent } from './products-picker/products-picker.component';
import { ErrorsViewerComponent } from './errors-viewer/errors-viewer.component';

@NgModule({
  declarations: [ProductsPickerComponent, ErrorsViewerComponent],
  imports: [CommonModule, MaterialAngularBundleModule],
  exports: [ProductsPickerComponent, ErrorsViewerComponent],
  entryComponents: [ProductsPickerComponent],
})
export class ComponentsModule {}
