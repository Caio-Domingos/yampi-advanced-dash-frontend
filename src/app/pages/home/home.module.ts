import { StoreCredentialsFormComponent } from './../../core/components/store-credentials-form/store-credentials-form.component';
import { MaterialAngularBundleModule } from './../../core/material-angular/material-angular-bundle.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, MaterialAngularBundleModule],
  entryComponents: [StoreCredentialsFormComponent],
})
export class HomeModule {}
