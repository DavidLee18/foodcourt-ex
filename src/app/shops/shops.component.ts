import { Component } from '@angular/core';
import { Firestore, collection, collectionSnapshots, doc, getDoc, getDocs, onSnapshot } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Shop } from '../model';
import { RouterLink } from '@angular/router';
import { NgFor, AsyncPipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-shops',
    templateUrl: './shops.component.html',
    styleUrls: ['./shops.component.css'],
    standalone: true,
    imports: [MatListModule, NgFor, RouterLink, AsyncPipe]
})
export class ShopsComponent {
  shops: Observable<Shop[]>;

  constructor(private firestore: Firestore) {
    this.shops = collectionSnapshots(collection(firestore, 'shops'))
      .pipe(map(snaps => snaps.map(snap => snap.data() as Shop)))
  }
}
