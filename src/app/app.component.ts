import { Component, OnInit } from '@angular/core';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'foodcourt-ex';
  links = [
    { path: '/login', name: '로그인', show: true },
    { path: '/sign-up', name: '회원가입', show: true },
    { path: '/owner/register', name: '가게 등록', show: true },
    { path: '/shops', name: '음식점 보기', show: true, for: 'member' },
    { path: '/owner/orders', name: '주문 보기', show: true, for: 'owner' },
  ];
  uid: Observable<string | undefined>;

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {
    this.uid = authState(this.auth).pipe(map(user => user?.uid));
  }

  ngOnInit() {
      this.uid.subscribe(async u => {
        if(!u) this.links.forEach(link => { link.show = !link.for; });
        else {
          let memberSnap = await getDoc(doc(this.firestore, `members/${u}`));
          let ownerSnap = await getDoc(doc(this.firestore, `owners/${u}`));

          if(memberSnap.exists()) this.links.forEach(l => { l.show = l?.for == 'member' });
          else if(ownerSnap.exists()) if(memberSnap.exists()) this.links.forEach(l => { l.show = l?.for == 'owner' });
          else console.error('impossible user state: logged in yet neither a member nor an owner');
        }
      });
  }

  logout() { signOut(this.auth); this.router.navigateByUrl('/login') }
}
