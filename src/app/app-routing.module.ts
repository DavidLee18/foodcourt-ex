import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Route, RouterModule, RouterStateSnapshot } from '@angular/router';
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

const routes: Route[] = [
  { path: 'login', component: LoginComponent },
  { path: 'signUp', component: SignUpComponent },
  { path: 'owner/register', component: OwnerRegisterComponent },
  { path: 'shops', component: ShopsComponent, canActivate: [loggedIn] },
  { path: 'shops/:id/foods', component: ShopFoodsComponent, canActivate: [loggedIn] },
  { path: 'shops/:id/order', component: OrderComponent, canActivate: [loggedIn] },
  { path: 'owner/orders', component: OwnerOrdersComponent, canActivate: [loggedIn] },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
