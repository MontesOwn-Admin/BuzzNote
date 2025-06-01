import { Component, OnInit } from '@angular/core';
import { Inspection, Notes } from '../../bees.model';
import { InspectionService } from '../../services/inspections.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AverageDetailsComponent } from "../average-details/average-details.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../header/header.component";
import { AlertsComponent } from "../../alerts/alerts.component";

@Component({
  selector: 'app-inspection-detail',
  imports: [AverageDetailsComponent, FormsModule, CommonModule, HeaderComponent, AlertsComponent],
  templateUrl: './inspection-detail.component.html',
  styleUrl: './inspection-detail.component.css'
})
export class InspectionDetailComponent implements OnInit {
  inspectionId: number = 0;
  inspection: Inspection | null = null;
  loading = false;
  error: string | null = null;
  message: string | null = null;
  notes: string = "";
  notesLines: string[] = [];
  newNotes: string = "";
  showTextArea: boolean = false;
  backLink: {page: string, year: string | undefined} = {page: "/past", year: undefined}

  constructor(
    private inspectionService: InspectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.inspectionId = Number(this.route.snapshot.paramMap.get('id'));
    let paramSearch = this.route.snapshot.queryParamMap.get('search');
    if (paramSearch){
      this.backLink.page = "/search";
    } else {
      this.backLink.page = "/past";
    }
    this.fetchInspection();
  }

  fetchInspection() {
    this.loading = true;
    this.error = null;

    this.inspectionService.getInspectionForID(this.inspectionId).subscribe({
      next: (response) => {
        this.inspection = response;
        this.notes = response.notes;
        this.newNotes = response.notes;
        this.formatNotes();
        if (this.backLink.page === "/past") {
          this.backLink.year = response.inspection_date.split("-")[0];
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }

  onSubmit(action: number) {
    if (action === 1) {
      this.showTextArea = false;
      this.inspectionService.updateNotes(this.inspectionId, new Notes(this.newNotes)).subscribe({
        next: (data) => {
          if (data.notes === this.newNotes) {
            this.message = "Updated notes succefully";
            setTimeout(() => {
              this.message = null;
            }, 5000);
            this.notes = data.notes;
          } else {
            console.log(data);
          }
        }
      })
    } else {
      this.showTextArea = false;
      this.newNotes = this.notes;
    }
  }

  formatDate() {
    return this.inspection?.inspection_date.toString().split('T')[0];
  }

  formatNotes() {
    let lines = this.notes.split("\\n");
    let formattedNotes: string = ""
    lines.forEach(line => {
      formattedNotes += line;
      formattedNotes += "<br/>"
    });
    this.notes = formattedNotes;
  }
}