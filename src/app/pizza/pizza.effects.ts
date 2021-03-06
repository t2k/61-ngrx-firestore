import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

import * as actions from './pizza.actions';
import * as fromPizza from './pizza.reducer';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';

@Injectable()
export class PizzaEffects {
  constructor(private actions$: Actions, private afs: AngularFirestore) {}

  // Listen for the 'QUERY' action, must be the first effect you trigger
  // tslint:disable-next-line:member-ordering
  @Effect()
  query$: Observable<Action> = this.actions$.ofType(actions.QUERY).pipe(
    switchMap(action => {
      const ref = this.afs.collection<fromPizza.Pizza>('pizzas');
      return ref.snapshotChanges().pipe(
        map(arr => {
          return arr.map(doc => {
            const data = doc.payload.doc.data();
            return { id: doc.payload.doc.id, ...data } as fromPizza.Pizza;
          });
        })
      );
    }),
    map(arr => {
      console.log(arr);
      return new actions.AddAll(arr);
    })
  );

  // Listen for the 'CREATE' action
  // tslint:disable-next-line:member-ordering
  @Effect()
  create$: Observable<Action> = this.actions$.ofType(actions.CREATE).pipe(
    map((action: actions.Create) => action.pizza),
    switchMap(pizza => {
      const ref = this.afs.doc<fromPizza.Pizza>(`pizzas/${pizza.id}`);
      return from(ref.set(pizza));
    }),
    map(() => {
      return new actions.Success();
    })
  );

  // Listen for the 'UPDATE' action
  // tslint:disable-next-line:member-ordering
  @Effect()
  update$: Observable<Action> = this.actions$.ofType(actions.UPDATE).pipe(
    map((action: actions.Update) => action),
    switchMap(data => {
      const ref = this.afs.doc<fromPizza.Pizza>(`pizzas/${data.id}`);
      return from(ref.update(data.changes));
    }),
    map(() => {
      return new actions.Success();
    })
  );

  // Listen for the 'DELETE' action
  // tslint:disable-next-line:member-ordering
  @Effect()
  delete$: Observable<Action> = this.actions$.ofType(actions.DELETE).pipe(
    map((action: actions.Delete) => action.id),
    switchMap(id => {
      const ref = this.afs.doc<fromPizza.Pizza>(`pizzas/${id}`);
      return from(ref.delete());
    }),
    map(() => {
      return new actions.Success();
    })
  );
}
