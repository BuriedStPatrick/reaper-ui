import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toReaperAction } from '@app/shared/action-helpers';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ReaperAction {
    id: string;
    section: string;
    action: string;
}

@Injectable({
    providedIn: 'root'
})
export class ActionService {
    private readonly baseUrl: string = '/assets/ActionList.txt';

    constructor(
        private http: HttpClient
    ){
    }

    query = (filterQuery?: (value: ReaperAction) => boolean): Observable<ReaperAction[]> =>
        this.http.get(`${this.baseUrl}`, { observe: 'response', responseType: 'text' }).pipe(
            map(res => res.body.split('\n').filter(line => line.trim() !== '')),
            map(lines => lines.map(toReaperAction)),
            map(actions => filterQuery ? actions.filter(filterQuery) : actions)
        )

    get = (id: string): Observable<ReaperAction> =>
        this.http.get(`${this.baseUrl}`, { observe: 'response', responseType: 'text' }).pipe(
            map(res => res.body.split('\n')),
            map(lines => lines.find(l => l.indexOf(id) > 0)), // TODO: Match with regex as it's more accurate
            map(line => toReaperAction(line))
        )
}
