import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TrackFlag, TrackState } from 'src/app/shared/models';
import { hasFlag } from 'src/app/shared/reaper-helpers';
import { ReaperService } from 'src/app/shared/reaper.service';

export interface Track extends TrackState {
    isFolder: boolean;
    isMuted: boolean;
}

@Component({
    selector: 'app-track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.scss'],
    providers: [ReaperService]
})
export class TrackListComponent implements OnInit, OnDestroy {

    tracks$: Observable<Track[]>;
    private readonly abandon$ = new Subject<void>();

    constructor(private reaperService: ReaperService) { }

    ngOnInit(): void {
        this.tracks$ = this.reaperService.pollTrackState(1000).pipe(
            map(tracks => tracks.map(track => ({
                ...track,
                isFolder: hasFlag(track, TrackFlag.folder),
                isMuted: hasFlag(track, TrackFlag.muted)
            } as Track))),
            takeUntil(this.abandon$)
        );
    }

    ngOnDestroy(): void {
        this.abandon$.next();
    }
}
