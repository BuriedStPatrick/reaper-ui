import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TrackState } from 'src/app/shared/models';
import { TrackMasterStateService } from 'src/app/track/track-master/track-master-state.service';

export interface Track extends TrackState {
    isFolder: boolean;
    isMuted: boolean;
    isRecordArmed: boolean;
    isSelected: boolean;
}

@Component({
    selector: 'app-track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.scss']
})
export class TrackListComponent implements OnInit {

    tracks$: Observable<TrackState[]>;

    constructor(
        private state: TrackMasterStateService
    ) { }

    ngOnInit(): void {
        this.tracks$ = this.state.tracks$;
    }
}
