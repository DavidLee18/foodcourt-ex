import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Route, Router, RouterModule, RouterStateSnapshot, UrlSegmentGroup, UrlTree } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { OwnerRegisterComponent } from './owner-register/owner-register.component';
import { ShopsComponent } from './shops/shops.component';
import { ShopFoodsComponent } from './shop-foods/shop-foods.component';
import { OrderComponent } from './order/order.component';
import { OwnerOrdersComponent } from './owner-orders/owner-orders.component';
import { Auth, authState } from '@angular/fire/auth';
import { map } from 'rxjs';

const loggedIn: CanActivateFn = (next, state) => {
  let auth = inject(Auth);
  let authState$ = authState(auth);

  return authState$.pipe(map(user => user !== null));
};

const redirectUnauthorized: CanActivateFn = (next, state) => {
  let auth = inject(Auth);
  let authState$ = authState(auth);
  let router = inject(Router);

  return authState$.pipe(map(user => user !== null), map(l => l ? true : router.parseUrl('/login')));
};

const routes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'owner/register', component: OwnerRegisterComponent },
  { path: 'shops', component: ShopsComponent, canActivate: [redirectUnauthorized], children: [
    { path: ':id/foods', component: ShopFoodsComponent },
    { path: ':id/order', component: OrderComponent },
  ] },
  { path: 'owner/orders', component: OwnerOrdersComponent, canActivate: [redirectUnauthorized] },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
