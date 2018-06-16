import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PasswordlessAuthComponent } from './passwordless-auth/passwordless-auth.component';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { PizzaModule } from './pizza/pizza.module';
import { reducers } from './reducers';

import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';

import { AngularFirestoreModule } from 'angularfire2/firestore';

import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [AppComponent, PasswordlessAuthComponent],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    EffectsModule.forRoot([]),
    PizzaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

// export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
//   return function(state, action) {
//     console.log('state', state);
//     console.log('action', action);

//     return reducer(state, action);
//   }
// }

// export const metaReducers: MetaReducer<any>[] = [debug];
