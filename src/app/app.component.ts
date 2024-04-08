import { Component } from '@angular/core';
import { BehaviorSubject, EMPTY, interval } from 'rxjs';
import {
  map,
  scan,
  startWith,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  duree = 30;
  currentDuree = this.duree;
  playSub: BehaviorSubject<boolean> = new BehaviorSubject(true);
  play$ = this.playSub.asObservable();
  counter$ = this.play$.pipe(
    switchMap((play) =>
      play
        ? interval(1000).pipe(
            startWith(this.currentDuree),
            map(() => 1),
            scan((acc, cur) => acc - cur, this.currentDuree + 1),
            takeWhile((a) => a >= 0),
            tap((a) => {
              console.log(a);
              this.currentDuree = a;
            })
          )
        : EMPTY
    )
  );

  onPause() {
    this.playSub.next(false);
  }

  onStart() {
    this.playSub.next(true);
  }

  onReset() {
    this.currentDuree = this.duree;
    this.onStart();
  }
}
