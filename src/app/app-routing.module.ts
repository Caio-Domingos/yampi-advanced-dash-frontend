import { YampiCredentialsGuard } from './../guards/yampi-credentials.guard';
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
    canActivate: [YampiCredentialsGuard],
    loadChildren: () =>
      import('./pages/product/product.module').then((m) => m.ProductModule),
  },
  {
    path: 'kit',
    canActivate: [YampiCredentialsGuard],
    loadChildren: () =>
      import('./pages/kit/kit.module').then((m) => m.KitModule),
  },
  {
    path: 'upsell',
    canActivate: [YampiCredentialsGuard],
    loadChildren: () =>
      import('./pages/upsell/upsell.module').then((m) => m.UpsellModule),
  },
  {
    path: 'order-bump',
    canActivate: [YampiCredentialsGuard],
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
