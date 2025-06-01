import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Frame } from '../bees.model';

@Injectable({
  providedIn: 'root'
})
export class FramesService {
  baseURL: string = "https://montesown.com/buzznote-api/frames";

  constructor(private http: HttpClient) {}

  getFramesForInspectionIDAndBoxName(inspectionID: number, boxName: string): Observable<Frame[]> {
    return this.http.get<Frame[]>(`${this.baseURL}/${inspectionID}/${boxName}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  addNewFrame(frame: Frame): Observable<Frame> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http.post<Frame>(this.baseURL, frame, httpOptions).pipe(
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
