import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HivesService } from '../services/hives.service';
import { Hive, Inspection, TempAndCondition } from '../bees.model';
import { InspectionService } from '../services/inspections.service';
import { HeaderComponent } from "../header/header.component";
import { AlertsComponent } from "../alerts/alerts.component";

@Component({
  selector: 'app-inspection',
  imports: [HeaderComponent, AlertsComponent],
  templateUrl: './inspection.component.html',
  styleUrl: './inspection.component.css'
})
export class InspectionComponent implements OnInit {
  hives: Hive[] | null = null;
  loading: boolean = false;
  message: string | null = null;
  error: string | null = null;
  weather: TempAndCondition = new TempAndCondition(0, "");
  selectedHiveID: number = 0;
  inspection: Inspection | undefined;

  constructor(
    private hiveService: HivesService,
    private inspectionService: InspectionService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.fetchHives();
  }

  fetchHives() {
    this.error = null;
    this.hiveService.getAllHives(true).subscribe({
      next: (response) => {
        this.hives = response;
        console.log(`Search component: Fetched ${response.length} hives.`)
      },
      error: (error) => {
        this.error = error;
      },
    });
  }

  startNewIspection(hive: Hive) {
    let newInspection: Inspection = new Inspection(0, hive.hive_id, this.getFormattedDate(), hive.hive_name, this.getStartTime(), 0, "", "", "", "", "", "", "", false, false, false, false, "");
      this.inspectionService.createInspection(newInspection).subscribe({
        next: (data) => {
          this.inspection = data;
          console.log(`Created new inspection with ID: ${this.inspection.inspection_id}`);
          this.router.navigate(['./frames'], { queryParams: { inspectionID: this.inspection.inspection_id, hiveID: hive.hive_id, hiveName: hive.hive_name} });
        },
      error: (error) => {
        this.error = error;
      },
      })
    
  }

  getFormattedDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  getStartTime() {
    const today = new Date();
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }


}
