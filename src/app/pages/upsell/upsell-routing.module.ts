import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpsellComponent } from './upsell.component';

const routes: Routes = [{ path: '', component: UpsellComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpsellRoutingModule { }
