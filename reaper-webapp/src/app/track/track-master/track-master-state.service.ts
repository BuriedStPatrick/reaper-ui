import { Injectable, OnDestroy } from '@angular/core';
import { interval, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';
import { arraysMatch } from 'src/app/shared/array-helpers';
import { TrackState } from 'src/app/shared/models';
import { toTrackStates } from 'src/app/shared/reaper-helpers';
import { ReaperService } from 'src/app/shared/reaper.service';

@Injectable()
export class TrackMasterStateService implements OnDestroy {

    tracks$: Observable<TrackState[]>;
    abandon$ = new Subject<void>();
    update$ = new Subject<void>();

    constructor(private reaperService: ReaperService) {
        this.tracks$ = this.update$.pipe(
            switchMap(_ => this.reaperService.requestState('TRACK')),
            toTrackStates,
            distinctUntilChanged(arraysMatch),
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
