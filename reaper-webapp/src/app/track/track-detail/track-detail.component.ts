import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, first, map, takeUntil, tap } from 'rxjs/operators';
import { isDark } from 'src/app/shared/colors';
import { TrackFlag, TrackState } from 'src/app/shared/models';
import { hasFlag } from 'src/app/shared/reaper-helpers';
import { ReaperService } from 'src/app/shared/reaper.service';
import { TrackMasterStateService } from 'src/app/track/track-master/track-master-state.service';

export interface TrackDetail extends TrackState {
    isFolder: boolean;
    isMuted: boolean;
    isRecordArmed: boolean;
    isSelected: boolean;
}

@Component({
    selector: 'app-track-detail',
    templateUrl: './track-detail.component.html',
    styleUrls: ['./track-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackDetailComponent implements OnInit, OnDestroy {

    @Input() trackNumber: number;

    track$: Observable<TrackDetail>;

    private readonly abandon$ = new Subject<void>();

    constructor(
        private state: TrackMasterStateService,
        private reaperService: ReaperService
    ) { }

    ngOnInit(): void {
        this.track$ = this.state.tracks$.pipe(
            map(tracks => tracks.find(t => t.tracknumber === this.trackNumber)),
            distinctUntilChanged(),
            map(track => ({
                ...track,
                isFolder: hasFlag(track, TrackFlag.folder),
                isMuted: hasFlag(track, TrackFlag.muted),
                isRecordArmed: hasFlag(track, TrackFlag.recordArmed),
                isSelected: hasFlag(track, TrackFlag.selected)
            } as TrackDetail)),
            takeUntil(this.abandon$)
        );
    }

    ngOnDestroy(): void {
        this.abandon$.next();
    }

    select = (track: TrackDetail): void => {
        this.reaperService.select(track).pipe(
            first(),
            tap(_ => this.state.update()),
            takeUntil(this.abandon$)
        ).subscribe();
    }

    toggleMute = (track: TrackDetail): void => {
        this.reaperService.toggleMute(track).pipe(
            first(),
            tap(_ => this.state.update()),
            takeUntil(this.abandon$)
        ).subscribe();
    }

    toggleRecordArm = (track: TrackDetail): void => {
        this.reaperService.toggleRecordArm(track).pipe(
            first(),
            tap(_ => this.state.update()),
            takeUntil(this.abandon$)
        ).subscribe();
    }

    isTrackDark = (track: TrackDetail): boolean =>
        isDark(track.color)

}
