import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription, take } from 'rxjs';
import { Inspection, TempAndCondition } from '../../bees.model';
import { InspectionService } from '../../services/inspections.service';
import { WeatherService } from '../../services/weather.service';
import { HeaderComponent } from "../../header/header.component";
import { AlertsComponent } from "../../alerts/alerts.component";

@Component({
  selector: 'app-end',
  imports: [HeaderComponent, AlertsComponent],
  templateUrl: './end.component.html',
  styleUrl: './end.component.css'
})
export class EndComponent implements OnInit {
  loading: boolean = false;
  message: string | null = null;
  error: string | null = null;
  weather: TempAndCondition = new TempAndCondition(0, "");
  inspectionID: number = 0;
  countdownSubscription?: Subscription;
  newInspection: Inspection = new Inspection(0, 0, "", "", "", 0, "", "", "", "", "", "", "", false, false, false, false, "");
  allFilledIn: boolean = false;

  constructor(
    private weatherService: WeatherService,
    private inspectionService: InspectionService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    let paraminspectionID = this.route.snapshot.queryParamMap.get('inspectionID');
    if (!paraminspectionID) {
      this.errorCountdown();
    } else {
      this.inspectionID = +paraminspectionID;
      let paramQueen = this.route.snapshot.queryParamMap.get('queen');
      if (paramQueen) {
        if (paramQueen === 'true') {
          this.newInspection.queen_spotted = true;
        }
      }
      this.newInspection.inspection_id = +paraminspectionID;
      this.inspectionService.getInspectionForID(this.inspectionID).subscribe({
        next: (data) => {
          this.newInspection.hive_id = data.hive_id;
          this.newInspection.hive_name = data.hive_name;
          this.newInspection.start_time = data.start_time;
          this.newInspection.inspection_date = data.inspection_date;
        }, error: (error) => {
          if (this.error) {
            this.error = this.error + " and " + error;
          } else {
            this.error = error;
          }
        },
      });
      this.fetchWeather();
    }
  }


  fetchWeather() {
    this.weatherService.getCurrentWeather().subscribe({
      next: (data) => {
        this.newInspection.weather_condition = data.condition;
        this.newInspection.weather_temp = Math.round(data.temp);
      }, error: (error) => {
        if (this.error) {
          this.error = this.error + " and " + error;
        } else {
          this.error = error;
        }
      },
    });
  }

  errorCountdown() {
    let counter = 7;
    this.error = `Error, inspection not set, redirecting to homepage in ${counter} seconds. Please try again`;
    this.countdownSubscription = interval(1000)
      .pipe(take(7))
      .subscribe({
        next: () => {
          counter--;
          this.error = `Error, inspection not set, redirecting to homepage in ${counter} seconds. Please try again`;
        },
        complete: () => {
          this.router.navigate(['./']);
        },
      });
  }

  onClick(key: string, value: string) {
    switch (key) {
      case "temerament": {
        this.newInspection.bee_temperament = value;
        this.checkIfAllFilled();
        break;
      }
      case "beePop": {
        this.newInspection.bee_population = value;
        this.checkIfAllFilled();
        break;
      }
      case "dronePop": {
        this.newInspection.drone_population = value;
        this.checkIfAllFilled();
        break;
      }
      case "laying": {
        this.newInspection.laying_pattern = value;
        this.checkIfAllFilled();
        break;
      }
      case "beetles": {
        this.newInspection.hive_beetles = value;
        this.checkIfAllFilled();
        break;
      }
      case "pests": {
        this.newInspection.other_pests = value;
        this.checkIfAllFilled();
        break;
      }
      default: {
        this.error = "Error. Unkown value";
        break;
      }
    }
  }

  checkIfAllFilled() {
    this.message = null;
    let errors: string[] = [];
    if (this.newInspection.bee_temperament === '') {
      errors.push("bee temperament");
    }
    if (this.newInspection.bee_population === '') {
      errors.push("bee population");
    }
    if (this.newInspection.drone_population === '') {
      errors.push("drone population");
    }
    if (this.newInspection.laying_pattern === '') {
      errors.push("laying pattern");
    }
    if (this.newInspection.hive_beetles === '') {
      errors.push("hive beetles");
    }
    if (this.newInspection.other_pests === '') {
      errors.push("other pests");
    }
    if (errors.length > 0) {
      this.message = errors.join(", ") + " must be selected";
      this.allFilledIn = false;
    } else {
      this.allFilledIn = true;
    }
  }

  finishInspection() {
    this.inspectionService.updateInspection(this.newInspection).subscribe({
      next: (data) => {
        this.router.navigate(['./']);
      }
    })
  }

}
