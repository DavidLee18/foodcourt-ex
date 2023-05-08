import { Component, Inject, OnInit } from '@angular/core';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { ErrorDescription } from './state/error-description.reducer';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { setError } from './state/error-description.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'foodcourt-ex';
  links = [
    { path: '/login', name: '로그인', show: true },
    { path: '/sign-up', name: '회원가입', show: true },
    { path: '/owner/register', name: '가게 등록', show: true },
    { path: '/shops', name: '음식점 보기', show: true, for: 'member' },
    { path: '/owner/orders', name: '주문 보기', show: true, for: 'owner' },
  ];
  uid: Observable<string | undefined>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private store: Store<{ errorDescription: ErrorDescription }>,
    private dialog: MatDialog,
  ) {
    this.uid = authState(this.auth).pipe(map(user => user?.uid));
    this.uid.subscribe(async u => {
      if (!u) this.links.forEach(link => { link.show = !link.for; });
      else {
        let memberSnap = await getDoc(doc(this.firestore, `members/${u}`));
        let ownerSnap = await getDoc(doc(this.firestore, `owners/${u}`));

        if (memberSnap.exists()) this.links.forEach(l => { l.show = l?.for == 'member' });
        else if (ownerSnap.exists()) if (memberSnap.exists()) this.links.forEach(l => { l.show = l?.for == 'owner' });
        else console.error('impossible user state: logged in yet neither a member nor an owner');
      }
    });
    store.pipe(map(({ errorDescription }) => errorDescription))
    .subscribe((errD) => {
      if(errD.error) {
        const dialogRef = dialog.open(ErrorDialog, { data: errD })
      }
    })
  }

  logout() {
    signOut(this.auth).catch(error => this.store.dispatch(setError({ errorCode: error.code, errorMessage: error.message })))
    this.router.navigateByUrl('/login')
  }
}

@Component({
  selector: 'error-dialog',
  template: `<h1 mat-dialog-title>Error Occured</h1>
  <div mat-dialog-content>
    <h2>{{ data.errorCode }}</h2> <br>
    {{ data.errorMessage }}
  </div>
  <div mat-dialog-actions>
    <button mat-button (click)="onClick()">확인</button>
  </div>`
})
export class ErrorDialog {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ErrorDescription,
  ) { }

  onClick() {
    this.dialogRef.close();
  }
}
