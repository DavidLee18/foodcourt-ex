import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Food, Order, Shop } from '../model';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, getDocs, limit, orderBy, query, where } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';


@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css'],
    standalone: true,
    imports: [MatTableModule, DatePipe]
})
export class OrderComponent {
  readonly displayedColumns: string[] = ['position', 'name', 'price', 'count']
  order?: Order
  ownerId = ''
  uid?: string
  shopName?: string

  constructor(private route: ActivatedRoute, private firestore: Firestore, private auth: Auth) {
    this.ownerId = route.snapshot.params['id']

    user(auth).subscribe(async user_ => {
      this.uid = user_?.uid;
      let orderQuery = query(collection(firestore, 'orders'),
        where('memberId', '==', this.uid),
        where('ownerId', '==', this.ownerId),
        orderBy('when', 'desc'), limit(1))
      let order = (await getDocs(orderQuery)).docs.map(d => d.data())[0]
      this.order = order as Order

      let shopQuery = query(collection(firestore, 'shops'), where('ownerId', '==', this.order.ownerId), limit(1))

      let shop = (await getDocs(shopQuery)).docs.map(d => d.data())[0]

      this.shopName = shop['name']
    })
  }

  foodCount(food: Food) {
    return this.order?.foods.filter(f => f === food).length;
  }

  get totalPrice() {
    return this.order?.foods.map(f => f.price).reduce((a, b) => a + b);
  }
}
