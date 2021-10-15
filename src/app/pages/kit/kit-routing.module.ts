import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KitComponent } from './kit.component';

const routes: Routes = [{ path: '', component: KitComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KitRoutingModule { }
