import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderBumpComponent } from './order-bump.component';

const routes: Routes = [{ path: '', component: OrderBumpComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderBumpRoutingModule { }
