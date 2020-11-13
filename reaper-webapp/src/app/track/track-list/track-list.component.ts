import { Component, OnInit } from '@angular/core';
import { TrackMasterStateService } from '@app/track/track-master/track-master-state.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-track-list',
    templateUrl: './track-list.component.html',
    styleUrls: ['./track-list.component.scss']
})
export class TrackListComponent implements OnInit {

    trackNumbers$: Observable<number[]>;

    constructor(
        private state: TrackMasterStateService
    ) { }

    ngOnInit(): void {
        this.trackNumbers$ = this.state.trackCount$.pipe(
            map(count => [...Array(count).keys(), count])
        );
    }
}
