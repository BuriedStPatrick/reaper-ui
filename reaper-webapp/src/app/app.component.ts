import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ReaperService } from './shared/reaper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ReaperService]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'reaper-webapp';

  private readonly abandon$ = new Subject<void>();

  constructor(
    private reaperService: ReaperService
  ) { }

  ngOnDestroy(): void {
    this.reaperService.stopPolling();
    this.abandon$.next();
  }

  ngOnInit(): void {
    this.reaperService.startPolling(3000).pipe(
      tap(res => console.log(res)),
      takeUntil(this.abandon$)
    )
    .subscribe();
  }

  public play(): void {
    this.reaperService.play();
  }
}
