import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, min, retry } from 'rxjs/operators';
import { Inspection, InspectionListItem, Notes } from '../bees.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  baseURL: string = "https://montesown.com/buzznote-api/search/";

  constructor(private http: HttpClient) {}

  getInspectionsForHiveID(hiveID: number): Observable<InspectionListItem[]> {
    return this.http.get<InspectionListItem[]>(`${this.baseURL}hives/${hiveID}`).pipe(
      catchError(this.handleError)
    );
  }

  getInspectionsByDateRange(startDate: string, endDate: string): Observable<InspectionListItem[]> {
    return this.http.get<InspectionListItem[]>(`${this.baseURL}date-range/${startDate}/${endDate}`).pipe(
      catchError(this.handleError)
    );
  }

  getInspectionsByTempRange(minTemp: number, maxTemp: number): Observable<InspectionListItem[]> {
      return this.http.get<InspectionListItem[]>(`${this.baseURL}temp-range/${minTemp}/${maxTemp}`).pipe(
        catchError(this.handleError)
      );
  }

  getInspectionByWeather(condition: string): Observable<InspectionListItem[]> {
    return this.http.get<InspectionListItem[]>(`${this.baseURL}weather/${condition}`).pipe(
      catchError(this.handleError)
    );
  }

  FilterQueenSpotted(queenSpotted: boolean): Observable<InspectionListItem[]> {
    return this.http.get<InspectionListItem[]>(`${this.baseURL}queen/${queenSpotted.toString()}`).pipe(
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
        () => `${JSON.stringify(error.error.message)}`
      );
    }
  }
}
