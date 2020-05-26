import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TransportState } from 'src/app/shared/models';
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

  private _interval$ = new BehaviorSubject<number | null>(0);
  interval$ = this._interval$.asObservable();

  state$: Observable<TransportState>;

  constructor(
    private reaperService: ReaperService
  ) { }

  ngOnDestroy(): void {
    this.reaperService.stopPolling();
    this.abandon$.next();
  }

  ngOnInit(): void {
    this.state$ = this.reaperService.startPolling(500).pipe(
      takeUntil(this.abandon$)
    );
  }

  public updateInterval = (interval: number) =>
    this._interval$.next(interval)

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
