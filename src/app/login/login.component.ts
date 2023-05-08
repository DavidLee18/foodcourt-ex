import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { setError } from '../state/error-description.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.email]),
    pw: new FormControl('', [Validators.required, Validators.minLength(10)])
  });
  hide = true;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private store: Store
  ) {}

  async login() {
    let cred = await signInWithEmailAndPassword(this.auth, this.form.get('id')?.value, this.form.get('pw')?.value)
      .catch(error => this.store.dispatch(setError({ errorCode: error.code, errorMessage: error.message })))
    if((cred as UserCredential).user == undefined) return

    cred = cred as UserCredential

    const uid = cred.user.uid;

    let memberSnap = await getDoc(doc(this.firestore, `members/${uid}`));
    let ownerSnap = await getDoc(doc(this.firestore, `owners/${uid}`));

    if(memberSnap.exists()) await this.router.navigateByUrl('/shops');
    else if(ownerSnap.exists()) if(memberSnap.exists()) await this.router.navigateByUrl('owner/orders');
    else console.error('impossible user state: logged in yet neither a member nor an owner');
  }
}
