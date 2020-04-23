import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'password-reset',
    loadChildren: () =>
      import('./pages/password-reset/password-reset.module').then(
        m => m.PasswordResetPageModule
      )
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'shop-list',
    loadChildren: () =>
      import('./pages/shop-list/shop-list.module').then(m => m.ShopListPageModule),
    canActivate: [AuthGuard]
  },
  {
  path: 'shop-list/:teamid',
    loadChildren: () =>
      import('./pages/shop-list/shop-list.module').then(m => m.ShopListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'shop-list/:teamid/:businesstype',
      loadChildren: () =>
        import('./pages/shop-list/shop-list.module').then(m => m.ShopListPageModule),
      canActivate: [AuthGuard]
    },
  {
    path: 'shop',
    loadChildren: () =>
      import('./pages/shop/shop.module').then(m => m.ShopPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'shop/:shopid/:teamid/:businesstype',
    loadChildren: () =>
      import('./pages/shop/shop.module').then(m => m.ShopPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sku-list',
    loadChildren: () =>
      import('./pages/sku-list/sku-list.module').then(m => m.SKUListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sku-list/:teamid',
    loadChildren: () =>
      import('./pages/sku-list/sku-list.module').then(m => m.SKUListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sku-list/:teamid/:businesstype',
    loadChildren: () =>
      import('./pages/sku-list/sku-list.module').then(m => m.SKUListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sku-list/:skuid/:teamid/:businesstype',
    loadChildren: () =>
      import('./pages/sku-list/sku-list.module').then(m => m.SKUListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sku',
    loadChildren: () =>
      import('./pages/sku/sku.module').then(m => m.SKUPageModule),
    canActivate: [AuthGuard]
  },  {
    path: 'sku/:skuId',
    loadChildren: () =>
      import('./pages/sku/sku.module').then(m => m.SKUPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sku/:skuId/:teamid',
    loadChildren: () =>
      import('./pages/sku/sku.module').then(m => m.SKUPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sku/:skuId/:teamid/:businesstype',
    loadChildren: () =>
      import('./pages/sku/sku.module').then(m => m.SKUPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'shop/:shopId/:teamid',
    loadChildren: () =>
      import('./pages/shop/shop.module').then(m => m.ShopPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'order-shops',
    loadChildren: () =>
      import('./pages/order-shops/order-shops.module').then(m => m.OrderShopsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'order-shops/:teamid',
    loadChildren: () =>
      import('./pages/order-shops/order-shops.module').then(m => m.OrderShopsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'order-skus',
    loadChildren: () =>
      import('./pages/order-skus/order-skus.module').then(m => m.OrderSKUsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'order-skus/:shopname/:shopemail/:shopphone/:contactname/:shopaddr/:shoplocality/:shopType/:shopId/:teamid',
    loadChildren: () =>
      import('./pages/order-skus/order-skus.module').then(m => m.OrderSKUsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'shopping-cart',
    loadChildren: () =>
      import('./pages/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartPageModule),
    canActivate: [AuthGuard]
  },
   {
    path:
    'shopping-cart/:shopname/:shopemail/:shopphone/:contactname/:shopaddr/:shoplocality/:shopType/:shopId/:teamid/:orderdt/:dispatchdt',
    loadChildren: () =>
      import('./pages/shopping-cart/shopping-cart.module').then(m => m.ShoppingCartPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'order-list',
    loadChildren: () =>
      import('./pages/order-list/order-list.module').then(m => m.OrderListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'order-list/:teamid',
    loadChildren: () =>
      import('./pages/order-list/order-list.module').then(m => m.OrderListPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'order-display',
    loadChildren: () =>
      import('./pages/order-display/order-display.module').then(m => m.OrderDisplayPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'order-display/:orderid/:teamid',
    loadChildren: () =>
      import('./pages/order-display/order-display.module').then(m => m.OrderDisplayPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
