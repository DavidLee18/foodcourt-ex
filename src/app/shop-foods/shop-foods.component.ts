import { Component } from '@angular/core';
import { Firestore, addDoc, collection, collectionSnapshots, onSnapshot } from '@angular/fire/firestore';
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Food, Order } from '../model';
import { Auth, user } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-shop-foods',
    templateUrl: './shop-foods.component.html',
    styleUrls: ['./shop-foods.component.css'],
    standalone: true,
    imports: [NgIf, ReactiveFormsModule, MatListModule, NgFor, MatFormFieldModule, MatInputModule, MatButtonModule, AsyncPipe]
})
export class ShopFoodsComponent {
  form?: FormArray<FormControl<number | null>>;
  foods?: Observable<Food[]>;
  ownerId = '';
  orderComplete = false;
  readonly atLeastOne: ValidatorFn = control => {
    let array = control as FormArray;
    if (array.controls.every(c => c.value === 0)) return { 'atLeastOne': true };
    else return null;
  }

  constructor(private firestore: Firestore, private route: ActivatedRoute, private auth: Auth, private router: Router) {
    this.ownerId = route.snapshot.params['id']
    this.foods = collectionSnapshots(collection(firestore, 'shops', this.ownerId, 'menus'))
      .pipe(map(docs => docs.map(doc => doc.data() as Food)))
    this.foods.subscribe(foods_ => {
      this.form = new FormArray(foods_.map(_ => new FormControl(0, Validators.min(0))), this.atLeastOne)
    })
  }

  stripUndefined(control: any): FormControl { return control }

  confirmOrder() {
    let uid = user(this.auth).pipe(map(u => u?.uid))

    uid.subscribe(u => {
      this.foods?.subscribe(async fs => {
        let order: Order = {
          memberId: u!,
          ownerId: this.ownerId,
          when: new Date(),
          foods: []
        }
        for (let i = 0; i < (this.form?.controls.length ?? 0); i++) {
          const foodCount = this.form?.controls[i].value ?? 0
          if (foodCount > 0) {
            order.foods.concat(Array<Food>(foodCount).fill(fs[i]))
          }
        }

        await addDoc(collection(this.firestore, 'orders'), order)
        await this.router.navigateByUrl(`shops/${this.ownerId}/order`)
      });
    });
  }
}
