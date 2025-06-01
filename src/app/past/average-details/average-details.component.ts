import { Component, Input, OnInit } from '@angular/core';
import { AveragesService } from '../../services/averages.service';
import { Average, AverageDetail } from '../../bees.model';
import { FrameDetailComponent } from "../frame-detail/frame-detail.component";
import { VisualDetailComponent } from "../visual-detail/visual-detail.component";
import { LoadingComponent } from "../../loading/loading.component";

@Component({
  selector: 'app-average-details',
  imports: [FrameDetailComponent, VisualDetailComponent, LoadingComponent],
  templateUrl: './average-details.component.html',
  styleUrl: './average-details.component.css'
})
export class AverageDetailsComponent implements OnInit {
  @Input() inspectionID: number = 0;
  averages: AverageDetail[] | null = null;
  loading = false;
  error: string | null = null;
  showTable: boolean = true;

  constructor(private averageService: AveragesService) {}
  
  ngOnInit(): void {
    this.loading = true;
    this.error = null;
    this.averageService.getAverageForID(this.inspectionID).subscribe({
      next: (response) => {
        this.averages = response;
        if (response.length === 0) {
          this.showTable = false;
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }


}
