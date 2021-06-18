import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError, Observable, Subject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StarWarsService {
  public people$ = new Subject<any>();

  constructor(private http: HttpClient) { }
  getPeople(): Observable<any> {
    const swapiUrl = 'https://swapi.dev/api/people';
    return this.http.get<any>(swapiUrl);
  }

  getPersonData(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getMoreResults(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

}
