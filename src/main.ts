import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { errorDescriptionReducer } from './app/state/error-description.reducer';
import { StoreModule } from '@ngrx/store';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { ko } from 'date-fns/locale';
import { MAT_DATE_LOCALE } from '@angular/material/core';


bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            BrowserModule,
            AppRoutingModule,
            provideFirebaseApp(() => initializeApp(environment.firebase)),
            provideAuth(() => getAuth()),
            provideFirestore(() => getFirestore()),
            provideMessaging(() => getMessaging()),
            ReactiveFormsModule,
            StoreModule.forRoot({ errorDescription: errorDescriptionReducer })
        ),
        { provide: MAT_DATE_LOCALE, useValue: ko },
        provideAnimations()
    ]
})
  .catch(console.error);
