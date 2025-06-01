import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TempAndCondition } from '../bees.model';

interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = 'https://api.open-meteo.com/v1/forecast';
  private latitude = 41.44;
  private longitude = -81.39;
  private temperatureUnit = 'fahrenheit';
  private timezone = 'America/New_York';

  constructor(private http: HttpClient) { }

  getCurrentWeather(): Observable<TempAndCondition> {
    const url = `${this.apiUrl}?latitude=${this.latitude}&longitude=${this.longitude}&current_weather=true&temperature_unit=${this.temperatureUnit}&timezone=${this.timezone}`;

    return this.http.get<WeatherData>(url).pipe(
      // catchError handles HTTP errors
      catchError(this.handleError),
      map((data: WeatherData) => {
        let response = new TempAndCondition(+data.current_weather.temperature, this.parseWeatherCode(data.current_weather.weathercode));
        return response;
      })
    );
  }

  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  private parseWeatherCode(weatherCode: number): string {
    switch (weatherCode) {
      case 0:
      case 1:
        return "Clear Sky"
      case 2: return "Partly Cloudy";
      case 3: return "Overcast";
      case 45:
      case 48:
        return "Fog";
      case 51:
      case 53:
      case 55:
        return "Drizzle";
      case 61:
      case 63:
      case 65:
      case 80:
      case 81:
      case 82:
        return "Rain";
      case 66:
      case 67:
        return "Freezing Rain";
      case 71:
      case 73:
      case 75:
      case 77:
      case 85:
      case 86:
        return "Snow";
      case 95:
      case 96:
      case 99:
        return "Thunderstorm";
      default: return "Unknown";
    }
  }
}
