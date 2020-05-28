import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';
import { isDark } from 'src/app/shared/colors';
import { TrackFlag, TrackState } from 'src/app/shared/models';
import { hasFlag } from 'src/app/shared/reaper-helpers';
import { ReaperService } from 'src/app/shared/reaper.service';
import { Track } from 'src/app/track/track-list/track-list.component';
import { TrackMasterStateService } from 'src/app/track/track-master/track-master-state.service';

@Component({
    selector: 'app-track-detail',
    templateUrl: './track-detail.component.html',
    styleUrls: ['./track-detail.component.scss']
})
export class TrackDetailComponent implements OnInit, OnDestroy {

    // @Input() tracknumber: number;
    @Input() track: TrackState;

    private readonly abandon$ = new Subject<void>();

    private _track$ = new BehaviorSubject<Track | null>(null);
    track$: Observable<Track> = this._track$.asObservable();

    constructor(
        private state: TrackMasterStateService,
        private reaperService: ReaperService
    ) { }

    ngOnInit(): void {
        this._track$.next(({
            ...this.track,
            isFolder: hasFlag(this.track, TrackFlag.folder),
            isMuted: hasFlag(this.track, TrackFlag.muted),
            isRecordArmed: hasFlag(this.track, TrackFlag.recordArmed),
            isSelected: hasFlag(this.track, TrackFlag.selected)
        } as Track));
    }

    ngOnDestroy(): void {
        this.abandon$.next();
    }

    select = (track: Track): void => {
        this.reaperService.select(track).pipe(
            first(),
            tap(_ => this.state.update()),
            takeUntil(this.abandon$)
        ).subscribe();
    }

    toggleMute = (track: Track): void => {
        this.reaperService.toggleMute(track).pipe(
            first(),
            tap(_ => this.state.update()),
            takeUntil(this.abandon$)
        ).subscribe();
    }

    toggleRecordArm = (track: Track): void => {
        this.reaperService.toggleRecordArm(track).pipe(
            first(),
            tap(_ => this.state.update()),
            takeUntil(this.abandon$)
        ).subscribe();
    }

    isTrackDark = (track: Track): boolean =>
        isDark(track.color)

}
