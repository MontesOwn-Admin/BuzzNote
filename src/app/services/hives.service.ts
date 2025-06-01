import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Hive } from '../bees.model';

@Injectable({
  providedIn: 'root'
})
export class HivesService {
  baseURL: string = "http://localhost:3000/hives";

  constructor(private http: HttpClient) {}

  getAllHives(active: boolean): Observable<Hive[]> {
    let url: string = "";
    if (active) {
      url = `${this.baseURL}/active`;
    } else {
      url = this.baseURL;
    }

    return this.http.get<Hive[]>(url).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getHiveForID(ID: number): Observable<Hive> {
    return this.http.get<Hive>(`${this.baseURL}/${ID}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  updateHive(ID: number, hive: Hive): Observable<Hive> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.put<Hive>(`${this.baseURL}/${ID}`, hive, httpOptions).pipe(
      retry(3),
        catchError(this.handleError)
    )
  }

  addNewHive(hive: Hive): Observable<Hive> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<Hive>(`${this.baseURL}`, hive, httpOptions).pipe(
      retry(3),
        catchError(this.handleError)
    );
  }

  updateNumBoxesForID(hiveID: number, numBoxes: number): Observable<Hive> {
    let num_boxes = {"num_boxes": numBoxes};
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.put<Hive>(`${this.baseURL}/${hiveID}/boxes`, num_boxes, httpOptions).pipe(
      retry(3),
        catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
      return throwError(() => 'An error occurred: ' + error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
      return throwError(
        () => `Backend returned an error: ${error.status}, ${error.message}`
      );
    }
    return throwError(() => 'Something bad happened; please try again later.');
  }
}
