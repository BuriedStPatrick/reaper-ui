import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { catchError, first, map, switchMap } from 'rxjs/operators';
import { BeatposState, TrackState, TransportState } from 'src/app/shared/models';
import { toBeatposState, toTrackCount, toTrackState, toTransportState } from 'src/app/shared/reaper-helpers';

@Injectable()
export class ReaperService {

  private readonly baseUrl = '/_/';

  private _error$ = new BehaviorSubject<Error | any>(null);
  error$ = this._error$.asObservable();

  constructor(
    private http: HttpClient
  ) {
  }

  public pollTransportState = (interval: number): Observable<TransportState> =>
    timer(0, interval)
      .pipe(
        switchMap(_ => this.requestState('TRANSPORT')),
        toTransportState
      )

  public pollBeatposState = (interval: number): Observable<BeatposState> =>
    timer(0, interval)
      .pipe(
        switchMap(_ => this.requestState('BEATPOS')),
        toBeatposState
      )

  public pollTrackCount = (interval: number): Observable<number> =>
    timer(0, interval)
      .pipe(
        switchMap(_ => this.requestState('NTRACK')),
        toTrackCount
      )

  public pollTrackState = (interval: number): Observable<TrackState[]> =>
    timer(0, interval)
      .pipe(
        switchMap(_ => this.requestState('TRACK')),
        toTrackState
      )

  public play = () => this.runAction(40073)
    .pipe(first())
    .subscribe()

  public runAction = (id: number): Observable<any> =>
    this.http.get(`${this.baseUrl}${id}`).pipe(
      catchError((err: Error, caught: Observable<any>) => {
        this._error$.next(err);
        return caught;
      })
    )

  private requestState = (key: string): Observable<any> => this.http.get<HttpResponse<any>>(`${this.baseUrl}${key};`, {
    headers: this.getHeaders(),
    observe: 'response',
    responseType: 'text'
  } as any).pipe(
    map(res => (res as HttpResponse<any>).body)
  )

  private getHeaders = (): HttpHeaders =>
    new HttpHeaders({
      Accept: 'text/plain',
      'Content-Type': 'text/plain'
    })
}
