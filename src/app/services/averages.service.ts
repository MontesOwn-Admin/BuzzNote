import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Average, AverageDetail } from '../bees.model';

@Injectable({
  providedIn: 'root'
})
export class AveragesService {
  baseURL: string = "http://localhost:3000/averages";

  constructor(private http: HttpClient) {}

  getAverageForID(ID: number): Observable<AverageDetail[]> {
    return this.http.get<AverageDetail[]>(`${this.baseURL}/${ID}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  addAverage(average: Average): Observable<Average> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<Average>(this.baseURL, average, httpOptions).pipe(
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
