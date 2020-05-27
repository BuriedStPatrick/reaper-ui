import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { BeatposState, TrackFlag, TrackState, TransportState } from 'src/app/shared/models';
import { hasFlag } from 'src/app/shared/reaper-helpers';
import { ReaperService } from './shared/reaper.service';

export interface Action {
    id: number;
    name: string;
}

export interface Track extends TrackState {
    isFolder: boolean;
    isMuted: boolean;
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

    transportState$: Observable<TransportState>;
    beatposState$: Observable<BeatposState>;
    trackCount$: Observable<number>;
    tracks$: Observable<Track[]>;

    constructor(
        private reaperService: ReaperService
    ) { }

    ngOnDestroy(): void {
        this.abandon$.next();
    }

    ngOnInit(): void {
        this.transportState$ = this.reaperService.pollTransportState(500).pipe(
            takeUntil(this.abandon$)
        );

        this.beatposState$ = this.reaperService.pollBeatposState(1000).pipe(
            takeUntil(this.abandon$)
        );

        this.trackCount$ = this.reaperService.pollTrackCount(5000).pipe(
            takeUntil(this.abandon$)
        );

        this.tracks$ = this.reaperService.pollTrackState(1000).pipe(
            map(tracks => tracks.map(track => ({...track,
                isFolder: hasFlag(track, TrackFlag.folder),
                isMuted: hasFlag(track, TrackFlag.muted)
            } as Track))),
            takeUntil(this.abandon$)
        );
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
