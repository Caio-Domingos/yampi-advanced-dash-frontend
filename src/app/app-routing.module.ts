import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'product',
    loadChildren: () =>
      import('./pages/product/product.module').then((m) => m.ProductModule),
  },
  {
    path: 'kit',
    loadChildren: () =>
      import('./pages/kit/kit.module').then((m) => m.KitModule),
  },
  {
    path: 'upsell',
    loadChildren: () =>
      import('./pages/upsell/upsell.module').then((m) => m.UpsellModule),
  },
  {
    path: 'order-bump',
    loadChildren: () =>
      import('./pages/order-bump/order-bump.module').then(
        (m) => m.OrderBumpModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
