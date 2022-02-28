import { FormsModule } from '@angular/forms';
import { MaterialAngularBundleModule } from './../material-angular/material-angular-bundle.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsPickerComponent } from './products-picker/products-picker.component';
import { ErrorsViewerComponent } from './errors-viewer/errors-viewer.component';
import { LoadingModalComponent } from './loading-modal/loading-modal.component';
import { StoreCredentialsFormComponent } from './store-credentials-form/store-credentials-form.component';

@NgModule({
  declarations: [
    ProductsPickerComponent,
    ErrorsViewerComponent,
    LoadingModalComponent,
    StoreCredentialsFormComponent,
  ],
  imports: [CommonModule, FormsModule, MaterialAngularBundleModule],
  exports: [
    ProductsPickerComponent,
    ErrorsViewerComponent,
    LoadingModalComponent,
    StoreCredentialsFormComponent,
  ],
  entryComponents: [ProductsPickerComponent],
})
export class ComponentsModule {}
