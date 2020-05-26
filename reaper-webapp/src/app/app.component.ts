import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ReaperService } from './shared/reaper.service';

export interface Action {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ReaperService]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'reaper-webapp';

  private readonly abandon$ = new Subject<void>();

  private _actions$ = new BehaviorSubject<Action[] | null>(null);
  actions$ = this._actions$.asObservable();

  constructor(
    private reaperService: ReaperService
  ) { }

  ngOnDestroy(): void {
    this.reaperService.stopPolling();
    this.abandon$.next();
  }

  ngOnInit(): void {
    this.reaperService.startPolling(3000).pipe(
      tap(res => console.log(res)),
      takeUntil(this.abandon$)
    )
    .subscribe();
  }

  public play = () =>
    this.reaperService.play()

  public runAction = (action: Action) =>
    this.reaperService
      .runAction(action.id)
      .subscribe()

  public addAction(): void {
    const actions = this._actions$.getValue() ?? [];

    actions.push({
      id: 1016,
      name: 'Stop'
    } as Action);

    this._actions$.next(actions);
  }
}
