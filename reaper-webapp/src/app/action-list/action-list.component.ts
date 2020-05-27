import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, filter, first, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ActionService, ReaperAction } from 'src/app/shared/action.service';
import { ReaperService } from 'src/app/shared/reaper.service';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss']
})
export class ActionListComponent implements OnInit {

    private readonly abandon$ = new Subject<void>();
    actions$: Observable<ReaperAction[]>;

    private _favoriteActions$ = new BehaviorSubject<ReaperAction[] | null>(null);
    favoriteActions$ = this._favoriteActions$.asObservable();

    query$ = new Subject<string>();

    constructor(
        private actionService: ActionService,
        private reaperService: ReaperService
    ) { }

    ngOnInit(): void {
        this.actions$  = this.query$.pipe(
            debounceTime(500),
            switchMap(query => this.actionService.query(a => a.action?.indexOf(query) > 0)),
            takeUntil(this.abandon$)
        );

        this.favoriteActions$.pipe(
            filter(favoriteActions => !!favoriteActions),
            tap(favoriteActions => localStorage.setItem('favorite-actions', JSON.stringify(favoriteActions))),
            takeUntil(this.abandon$)
        ).subscribe();

        of(localStorage.getItem('favorite-actions')).pipe(
            filter(value => !!value),
            map(value => JSON.parse(value) as ReaperAction[]),
            tap(favoriteActions => this._favoriteActions$.next(favoriteActions)),
            takeUntil(this.abandon$)
        ).subscribe();
    }

    runAction = (action: ReaperAction): void => {
        this.reaperService.runAction(action.id).pipe(
            first(),
            takeUntil(this.abandon$)
        ).subscribe();
    }

    toggleFavorite = (action: ReaperAction): void => {
        let favoriteActions = this._favoriteActions$.getValue() ?? [];

        if (favoriteActions.findIndex(a => a.id === action.id) === -1) {
            favoriteActions.push(action);
        } else {
            favoriteActions = favoriteActions.filter(a => a.id !== action.id);
        }

        this._favoriteActions$.next(favoriteActions);
    }

    public setQuery(query: string): void {
        this.query$.next(query);
    }
}
