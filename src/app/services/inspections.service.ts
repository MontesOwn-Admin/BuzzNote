import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Inspection, InspectionListItem, Notes } from '../bees.model';

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  baseURL: string = "http://localhost:3000/inspections";

  constructor(private http: HttpClient) {}

  getInspectionsList(): Observable<InspectionListItem[]> {
    return this.http.get<InspectionListItem[]>(`${this.baseURL}/list`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getInspectionForID(ID: number): Observable<Inspection> {
    return this.http.get<Inspection>(`${this.baseURL}/get/${ID}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  getLatestInspectionID(): Observable<number> {
    return this.http.get<number>(`${this.baseURL}/next`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  createInspection(inspection: Inspection): Observable<Inspection> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http
      .post<Inspection>(`${this.baseURL}`, inspection, httpOptions)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  updateNotes(ID: number, notes: Notes): Observable<Inspection> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http
      .put<Inspection>(`${this.baseURL}/${ID}`, notes, httpOptions)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  updateInspection(inspection: Inspection): Observable<Inspection> {
    let ID = inspection.inspection_id;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    return this.http
      .put<Inspection>(`${this.baseURL}/${ID}`, inspection, httpOptions)
      .pipe(
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
