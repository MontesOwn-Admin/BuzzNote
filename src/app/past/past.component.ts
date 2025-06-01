import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Inspection, InspectionListItem } from '../bees.model';
import { InspectionService } from '../services/inspections.service';
import { HeaderComponent } from "../header/header.component";
import { AlertsComponent } from "../alerts/alerts.component";
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-past',
  imports: [HeaderComponent, AlertsComponent, LoadingComponent],
  templateUrl: './past.component.html',
  styleUrl: './past.component.css'
})
export class PastComponent implements OnInit{
  inspections: InspectionListItem[] | null = null;
  yearToShow: InspectionListItem[] = [];
  years: string[] = [];
  showingYear: string = "";
  loading = false;
  error: string | null = null;
  message: string | null = null;

  constructor(
    private inspectionService: InspectionService,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.fetchInspections();
  }

  fetchInspections() {
    this.loading = true;
    this.error = null;

    this.inspectionService.getInspectionsList().subscribe({
      next: (response) => {
        this.inspections = response;
        console.log(`${this.inspections.length} inspections found`);
        this.getYears();
        let paramYear = this.route.snapshot.queryParamMap.get('year');
        if (paramYear) {
          this.filterYears(paramYear);
        } else {
          this.filterYears(this.years[this.years.length - 1]);
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }

  viewInspection(inspectionId: number) {
    this.router.navigate([`./inspections/${inspectionId}`]);
  }

  getYears() {
    this.inspections?.forEach((inspection) => {
      if (!this.years.includes(this.getYear(inspection.inspection_date))) {
        this.years.push(this.getYear(inspection.inspection_date));
      }
    });
  }

  getYear(date: string): string {
    return date.split("-")[0];
  }

  filterYears(year: string) {
    this.showingYear = year;
    if (this.inspections) {
      this.yearToShow = this.inspections?.filter(inspection => this.getYear(inspection.inspection_date) === year);
    }
  }

}
