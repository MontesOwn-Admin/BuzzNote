import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Hive } from '../bees.model';
import { HivesService } from '../services/hives.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { AlertsComponent } from "../alerts/alerts.component";
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-hives',
  imports: [FormsModule, CommonModule, HeaderComponent, AlertsComponent, LoadingComponent],
  templateUrl: './hives.component.html',
  styleUrl: './hives.component.css'
})
export class HivesComponent implements OnInit {
  hives: Hive[] | null = null;
  newHive: Hive = new Hive(0, "", 0, true);
  loading = false;
  error: string | null = null;
  message: string | null = null;
  showEdit: boolean = false;
  showAdd: boolean = false;

  constructor(
    private hiveService: HivesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.fetchHives();
  }

  fetchHives() {
    this.loading = true;
    this.error = null;
    this.hiveService.getAllHives(false).subscribe({
      next: (response) => {
        this.hives = response;
        this.loading = false;
        console.log(`Hives component: Fetched ${response.length} hives.`)
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }

  viewHive(hiveID: number) {
    this.router.navigate([`./hives/${hiveID}`]);
  }

  onSubmit(action: number) {
    if (action === 1) {
      this.hiveService.addNewHive(this.newHive).subscribe({
        next: (data) => {
          this.message = "Added hive";
          setTimeout(() => {
            this.message = null;
          }, 3000);
          this.fetchHives();
          this.showAdd = false;
          this.newHive = new Hive(0, "", 0, true);
        }
      })
    } else {
      this.showAdd = false;
      this.newHive = new Hive(0, "", 0, true);
    }
  }
}
