import { Injectable, OnDestroy } from '@angular/core';
import { arraysMatch } from '@app/shared/array-helpers';
import { TrackState } from '@app/shared/models';
import { toTrackCount, toTrackStates } from '@app/shared/reaper-helpers';
import { ReaperService } from '@app/shared/reaper.service';
import { interval, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';

@Injectable()
export class TrackMasterStateService implements OnDestroy {

    tracks$: Observable<TrackState[]>;
    trackCount$: Observable<number>;
    abandon$ = new Subject<void>();
    update$ = new Subject<void>();

    constructor(private reaperService: ReaperService) {
        this.tracks$ = this.update$.pipe(
            switchMap(_ => this.reaperService.requestState('TRACK')),
            toTrackStates,
            distinctUntilChanged(arraysMatch),
            takeUntil(this.abandon$)
        );

        this.trackCount$ = this.update$.pipe(
            switchMap(_ => this.reaperService.requestState('NTRACK')),
            toTrackCount,
            distinctUntilChanged(),
            takeUntil(this.abandon$)
        );

        interval(1000).pipe(
            tap(_ => this.update()),
            takeUntil(this.abandon$),
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.abandon$.next();
    }

    update(): void {
        this.update$.next();
    }
}
