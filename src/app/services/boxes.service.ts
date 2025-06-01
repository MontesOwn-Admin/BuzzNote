import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Box } from '../bees.model';

@Injectable({
  providedIn: 'root'
})
export class BoxesService {
  baseURL: string = "http://localhost:3000/boxes";

  constructor(private http: HttpClient) {}

  getBoxesForHiveID(hiveID: number, active: boolean): Observable<Box[]> {
    let url: string = "";
    if (active) {
      url = `${this.baseURL}/hives/${hiveID}/active`;
    } else {
      url = `${this.baseURL}/hives/${hiveID}`;
    }
    console.log(`Getting boxes for hive ${hiveID}`);
    return this.http.get<Box[]>(url).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  updateBox(boxID: number, box: Box): Observable<Box> {
    const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        };
        return this.http.put<Box>(`${this.baseURL}/${boxID}`, box, httpOptions).pipe(
          retry(3),
            catchError(this.handleError)
        );
  }

  addNewBox(box: Box): Observable<Box> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<Box>(`${this.baseURL}`, box, httpOptions).pipe(
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
