import { Component } from '@angular/core';
import { Firestore, collection, collectionSnapshots, doc, getDoc, getDocs, onSnapshot } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Shop } from '../model';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css']
})
export class ShopsComponent {
  shops: Observable<Shop[]>;

  constructor(private firestore: Firestore) {
    this.shops = collectionSnapshots(collection(firestore, 'shops'))
      .pipe(map(snaps => snaps.map(snap => snap.data() as Shop)))
  }
}
