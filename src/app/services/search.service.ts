import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, min, retry } from 'rxjs/operators';
import { Inspection, InspectionListItem, Notes } from '../bees.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  baseURL: string = "http://localhost:3000/search/";

  constructor(private http: HttpClient) {}

  getInspectionsForHiveID(hiveID: number): Observable<InspectionListItem[]> {
    return this.http.get<InspectionListItem[]>(`${this.baseURL}hives/${hiveID}`).pipe(
      catchError(this.handleError)
    );
  }

  getInspectionsByDateRange(startDate: string, endDate: string): Observable<InspectionListItem[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    // Make the GET request to your Node.js endpoint
    return this.http.get<InspectionListItem[]>(`${this.baseURL}date-range`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getInspectionsByTempRange(minTemp: number, maxTemp: number): Observable<InspectionListItem[]> {
    let params = new HttpParams()
      .set('minTemp', minTemp)
      .set('maxTemp', maxTemp);
      return this.http.get<InspectionListItem[]>(`${this.baseURL}temp-range`, { params }).pipe(
        catchError(this.handleError)
      );
  }

  getInspectionByWeather(condition: string): Observable<InspectionListItem[]> {
    let params = new HttpParams().set('weatherCondition', condition)
    return this.http.get<InspectionListItem[]>(`${this.baseURL}weather`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  FilterQueenSpotted(queenSpotted: boolean): Observable<InspectionListItem[]> {
    let params = new HttpParams().set('queenSpotted', queenSpotted)
    return this.http.get<InspectionListItem[]>(`${this.baseURL}queen`, { params }).pipe(
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
