import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    birth: new FormControl<Date>(new Date(), Validators.required),
    addr: new FormControl('', [Validators.required, Validators.minLength(6)]),
    money: new FormControl(0, [Validators.required, Validators.min(1000)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    pw: new FormControl('', [Validators.required, Validators.minLength(10)])
  });
  hide = true

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {}

  async signUp() {
    if(this.form.invalid) return
    
    let cred = await createUserWithEmailAndPassword(this.auth, this.form.get('email')?.value ?? '', this.form.get('pw')?.value ?? '');

    let uid = cred.user.uid;

    await setDoc(doc(this.firestore, 'members', `${uid}`), {
      name: this.form.get('name')?.value,
      birth: this.form.get('birth')?.value?.toISOString().split('T')[0],
      addr: this.form.get('addr')?.value,
      money: this.form.get('money')?.value,
    });

    await this.router.navigateByUrl('/shops');
  }
}
