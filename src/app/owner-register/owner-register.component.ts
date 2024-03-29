import { Component } from '@angular/core';
import { Auth, UserCredential, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import { FormArray, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { setError } from '../state/error-description.action';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';

@Component({
    selector: 'app-owner-register',
    templateUrl: './owner-register.component.html',
    styleUrls: ['./owner-register.component.css'],
    standalone: true,
    imports: [
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      CommonModule,
      MatDatepickerModule,
      MatButtonModule,
      MatIconModule,
      MatDateFnsModule,
    ]
})
export class OwnerRegisterComponent {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    birth: new FormControl(new Date(), Validators.required),
    addr: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    pw: new FormControl('', [Validators.required, Validators.minLength(10)]),
    shopName: new FormControl('', Validators.required),
    menus: new FormArray([
      new FormGroup({
        name: new FormControl('', Validators.required),
        price: new FormControl(0, Validators.required),
      })
    ]),
  });
  hide = true;
  foodIndex = 0;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private store: Store
  ) {}

  newFoodForm() {
    this.menusForm.push(new FormGroup({
      name: new FormControl('', Validators.required),
      price: new FormControl(0, Validators.required),
    }));
  }

  toFormGroup(control: any) {
    return control as FormGroup;
  }
  
  public get menusForm() {
    return this.form.get('menus') as FormArray;
  }

  // addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
  //   console.log(`${type}: ${event.value}`)
  //   // this.form.get('birth')?.setValue(event.value)
  //   console.log(`form: ${this.form.get('birth')?.value}`)
  // }

  async register() {
    if(this.form.invalid) { console.log(this.form.value); return; }

    let cred = await createUserWithEmailAndPassword(this.auth, this.form.get('email')?.value ?? '', this.form.get('pw')?.value ?? '')
      .catch(error => this.store.dispatch(setError({ errorCode: error.code, errorMessage: error.message })))
    if((cred as UserCredential).user == undefined) return

    cred = cred as UserCredential

    let uid = cred.user.uid;

    await setDoc(doc(this.firestore, 'owners', uid), {
      name: this.form.get('name')?.value,
      birth: this.form.get('birth')?.value?.toISOString().split('T')[0],
      addr: this.form.get('addr')?.value,
      profit: 0,
    });

    await addDoc(collection(this.firestore, 'shops'), {
      name: this.form.get('shopName')?.value,
      ownerId: uid,
      menus: this.menusForm.controls.map(control => {
        let group = this.toFormGroup(control);

        return {
          name: group.get('name')?.value,
          price: group.get('price')?.value
        }
      })
    });

    await this.router.navigateByUrl('/owner/orders');
  }
}
