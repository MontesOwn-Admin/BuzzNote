import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription, take } from 'rxjs';
import { Average, Box, Frame, FrameFormGroup } from '../../bees.model';
import { BoxesService } from '../../services/boxes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FrameToggleButtonComponent } from "./frame-toggle-button/frame-toggle-button.component";
import { FramesService } from '../../services/frames.service';
import { AveragesService } from '../../services/averages.service';
import { HeaderComponent } from "../../header/header.component";
import { AlertsComponent } from "../../alerts/alerts.component";

class AverageCounts {
  constructor(
    public boxName: string,
    public honey: number,
    public nectar: number,
    public cells: number,
    public brood: number,
    public comb: number,
    public queen: string
  ) { }
}

@Component({
  selector: 'app-frames',
  imports: [FormsModule, CommonModule, FrameToggleButtonComponent, HeaderComponent, AlertsComponent],
  templateUrl: './frames.component.html',
  styleUrl: './frames.component.css'
})
export class FramesComponent implements OnInit {
  error: string | null = null;
  message: string | null = null;
  loading: boolean = false;
  hiveName: string = "";
  hiveID: number = 0;
  inspectionID: number = 0;
  boxes: Box[] = [];
  countdownSubscription?: Subscription;
  showBoxSelection: boolean = false;
  currentFrameNumber: number = 1;
  currentBox: Box = new Box(0, 0, "", 0, "", false, false);
  currentFrame: FrameFormGroup = new FrameFormGroup(
    { sideA: false, sideB: false },
    { sideA: false, sideB: false },
    { sideA: false, sideB: false },
    { sideA: false, sideB: false },
    { sideA: false, sideB: false },
    { sideA: false, sideB: false });
  currentBoxAverages: AverageCounts = new AverageCounts("", 0, 0, 0, 0, 0, "Not Spotted");
  queen_spotted: string = 'false';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private boxService: BoxesService,
    private frameService: FramesService,
    private averageService: AveragesService) { }

  ngOnInit(): void {
    let paramHiveID = this.route.snapshot.queryParamMap.get('hiveID');
    let paramHiveName = this.route.snapshot.queryParamMap.get('hiveName');
    let paramInspectionID = this.route.snapshot.queryParamMap.get('inspectionID');
    if (paramHiveID && paramHiveName && paramInspectionID) {
      this.hiveID = +paramHiveID;
      this.hiveName = paramHiveName;
      this.inspectionID = +paramInspectionID;
      console.log(`Got inspectionID: ${this.inspectionID}, hiveID: ${this.hiveID}, hiveName: ${this.hiveName}. the code is still updating`);

      this.boxService.getBoxesForHiveID(this.hiveID, true).subscribe({
        next: (data) => {
          this.boxes = data;
          this.showBoxSelection = true;
        }, error: (error) => {
          this.error = error;
        }
      });
    } else {
      this.errorCountdown();
    }
  }

  errorCountdown() {
    let counter = 7;
    this.error = `Error, hive or inspection not set, redirecting to homepage in ${counter} seconds. Please try again`;
    this.countdownSubscription = interval(1000)
      .pipe(take(7))
      .subscribe({
        next: () => {
          counter--;
          this.error = `Error, hive or inspection not set, redirecting to homepage in ${counter} seconds. Please try again`;
        },
        complete: () => {
          this.router.navigate(['./']);
        },
      });
  }

  selectBox(box: Box) {
    this.currentBox = box;
    this.currentBoxAverages.boxName = box.box_name;
    this.showBoxSelection = false;
    this.message = `Box ${this.currentBox.box_name} selected. ${this.currentBox.num_frames} Frames`
  }

  nextFrame() {
    //Add to average count
    this.error = null;
    this.currentBoxAverages.honey += (this.currentFrame.honey.sideA ? 1 : 0) + (this.currentFrame.honey.sideB ? 1 : 0);
    this.currentBoxAverages.nectar += (this.currentFrame.nectar.sideA ? 1 : 0) + (this.currentFrame.nectar.sideB ? 1 : 0);
    this.currentBoxAverages.cells += (this.currentFrame.queen_cells.sideA ? 1 : 0) + (this.currentFrame.queen_cells.sideB ? 1 : 0);
    this.currentBoxAverages.brood += (this.currentFrame.brood.sideA ? 1 : 0) + (this.currentFrame.brood.sideB ? 1 : 0);
    this.currentBoxAverages.comb += (this.currentFrame.drawn_comb.sideA ? 1 : 0) + (this.currentFrame.drawn_comb.sideB ? 1 : 0);
    if (this.currentFrame.queenSpotted.sideA === true) {
      this.currentBoxAverages.queen = `${this.currentFrameNumber}A`;
      this.queen_spotted = 'true';
    } else if (this.currentFrame.queenSpotted.sideB) {
      this.currentBoxAverages.queen = `${this.currentFrameNumber}B`;
      this.queen_spotted = 'true';
    }
    //reset current frame values
    this.currentFrame = new FrameFormGroup(
      { sideA: false, sideB: false },
      { sideA: false, sideB: false },
      { sideA: false, sideB: false },
      { sideA: false, sideB: false },
      { sideA: false, sideB: false },
      { sideA: false, sideB: false });
      this.currentFrameNumber += 1;
  }

  onSubmit(action: number) {
    //Add side A to DB
    let newFrameSideA = new Frame(
      0, this.currentBox.box_id, this.inspectionID, this.currentBox.box_name,
      `${this.currentFrameNumber}A`, this.currentFrame.drawn_comb.sideA, this.currentFrame.honey.sideA, this.currentFrame.nectar.sideA,
      this.currentFrame.brood.sideA, this.currentFrame.queen_cells.sideA);
    this.frameService.addNewFrame(newFrameSideA).subscribe({
      next: (data) => {
        //Add side B to DB
        let newFrameSideB = new Frame(0, this.currentBox.box_id, this.inspectionID, this.currentBox.box_name,
          `${this.currentFrameNumber}B`, this.currentFrame.drawn_comb.sideB, this.currentFrame.honey.sideB, this.currentFrame.nectar.sideB,
          this.currentFrame.brood.sideB, this.currentFrame.queen_cells.sideB);
        this.frameService.addNewFrame(newFrameSideB).subscribe({
          next: (data) => {
            if (action === 1) {
              this.nextFrame();
            } else if (action === 2) {
              this.nextBox();
            } else {
              this.goToEnd();
            }
          }, error: (error) => {
            this.error = error;
          },
        })
      },
      error: (error) => {
        this.error = error;
      },
    })
  }

  nextBox() {
    //add average to DB
    let newAverage = new Average(0, this.inspectionID, this.currentBox.box_name, this.currentBox.num_frames,
      `${(this.currentBoxAverages.honey / this.currentBox.num_frames) * 100}`,
      `${(this.currentBoxAverages.nectar / this.currentBox.num_frames) * 100}`,
      `${(this.currentBoxAverages.brood / this.currentBox.num_frames) * 100}`,
      `${(this.currentBoxAverages.cells / this.currentBox.num_frames) * 100}`,
      `${(this.currentBoxAverages.comb / this.currentBox.num_frames) * 100}`,
      this.currentBoxAverages.queen);
    this.averageService.addAverage(newAverage).subscribe({
      next: (data) => {
        console.log(`Submitted average: ${JSON.stringify(data)}`)
        //reset average count
    this.currentBoxAverages = new AverageCounts("", 0, 0, 0, 0, 0, "Not Spotted");
    //show box selection screen
    this.currentFrame = new FrameFormGroup(
      { sideA: false, sideB: false },
      { sideA: false, sideB: false },
      { sideA: false, sideB: false },
      { sideA: false, sideB: false },
      { sideA: false, sideB: false },
      { sideA: false, sideB: false });
    this.currentFrameNumber = 1;
      }
    });
    //Only show box selection screen if there are boxes left to inspect
    this.boxes = this.boxes.filter(box => box.box_id !== this.currentBox?.box_id);
    if (this.boxes.length > 0) {
      this.currentFrameNumber = 1;
      this.showBoxSelection = true;
    }
  }

  goToEnd() {
    this.nextBox();
    this.router.navigate(['./end'], { queryParams: { inspectionID: this.inspectionID, queen: this.queen_spotted  } });
  }
}
