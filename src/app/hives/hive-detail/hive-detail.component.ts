import { Component, OnInit } from '@angular/core';
import { Hive } from '../../bees.model';
import { Router, ActivatedRoute } from '@angular/router';
import { HivesService } from '../../services/hives.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoxDetailComponent } from "../box-detail/box-detail.component";
import { HeaderComponent } from "../../header/header.component";
import { AlertsComponent } from "../../alerts/alerts.component";

@Component({
  selector: 'app-hive-detail',
  imports: [FormsModule, CommonModule, BoxDetailComponent, HeaderComponent, AlertsComponent],
  templateUrl: './hive-detail.component.html',
  styleUrl: './hive-detail.component.css'
})
export class HiveDetailComponent implements OnInit {
  hiveID: number = 0;
  hive: Hive | null = null;
  updatedHive!: Hive;
  loading = false;
  error: string | null = null;
  showEdit: boolean = false;
  message: string | null = null;

  constructor(
    private hiveService: HivesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.hiveID = Number(this.route.snapshot.paramMap.get('id'));
    console.log(`Hive Detail component: hiveID: ${this.hiveID}`);
    this.fetchHiveDetails();
  }

  fetchHiveDetails() {
    this.loading = true;
    this.error = null;
    this.message = null;
    this.hiveService.getHiveForID(this.hiveID).subscribe({
      next: (data) => {
        this.hive = data;
        console.log(`Hive Detail component: got data for ${data.hive_name} - ${data.num_boxes} boxes`);
        this.updatedHive = data;
        this.loading = false;
      },error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }

  onSubmit(action: number) {
    if (action === 1) {
      // update hive
      this.hiveService.updateHive(this.hiveID, this.updatedHive).subscribe({
        next: (data) => {
          this.showEdit = false;
          this.message = "Hive updated succefully";
          setTimeout(() => {
            this.message = null;
          }, 5000);
          this.fetchHiveDetails();
        }
      });
    } else if (action === 2) {
      // cancel
      this.showEdit = false;
      if (this.hive) this.updatedHive = this.hive;
    }
  }
}
