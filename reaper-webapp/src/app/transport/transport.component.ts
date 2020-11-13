import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransportState } from '@app/shared/models';
import { ReaperService } from '@app/shared/reaper.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-transport',
    templateUrl: './transport.component.html',
    styleUrls: ['./transport.component.scss']
})
export class TransportComponent implements OnInit, OnDestroy {

    transportState$: Observable<TransportState>;
    private readonly abandon$ = new Subject<void>();

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
    }

    public play = (): Subscription =>
        this.reaperService.play()
}
