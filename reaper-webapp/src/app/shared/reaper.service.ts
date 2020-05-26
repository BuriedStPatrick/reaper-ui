import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { catchError, first, map, switchMap, takeUntil } from 'rxjs/operators';
import { TransportState } from 'src/app/shared/models';
import { toTransportState } from 'src/app/shared/reaper-helpers';

@Injectable()
export class ReaperService {

  private readonly baseUrl = '/_/';
  private readonly stopPolling$ = new Subject<void>();

  private _error$ = new BehaviorSubject<Error | any>(null);
  error$ = this._error$.asObservable();

  constructor(
    private http: HttpClient
  ) {
  }

  public startPolling = (interval: number): Observable<TransportState> =>
    timer(0, interval)
      .pipe(
        switchMap(_ => this.requestState()),
        takeUntil(this.stopPolling$)
      )

  public stopPolling = () =>
    this.stopPolling$.next()

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

  private requestState = (): Observable<TransportState> => this.http.get<HttpResponse<any>>(`${this.baseUrl}TRANSPORT;`, {
    headers: this.getHeaders(),
    observe: 'response',
    responseType: 'text'
  } as any).pipe(
    map(res => (res as HttpResponse<any>).body),
    toTransportState
  )

  private getHeaders = (): HttpHeaders =>
    new HttpHeaders({
      Accept: 'text/plain',
      'Content-Type': 'text/plain'
    })
}
