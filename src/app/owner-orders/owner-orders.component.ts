import { Component } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, QueryDocumentSnapshot, collection, collectionSnapshots, orderBy, query, where } from '@angular/fire/firestore';
import { Order } from '../model';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-owner-orders',
  templateUrl: './owner-orders.component.html',
  styleUrls: ['./owner-orders.component.css']
})
export class OwnerOrdersComponent {
  orderDocs?: Observable<QueryDocumentSnapshot[]>
  uid?: string

  constructor(private auth: Auth, private firestore: Firestore) {
    user(auth).subscribe(u => {
      this.uid = u?.uid
      this.orderDocs = collectionSnapshots(query(
        collection(firestore, 'orders'),
        where('ownerId', '==', this.uid),
        orderBy('when', 'desc')))
    })
  }
}
