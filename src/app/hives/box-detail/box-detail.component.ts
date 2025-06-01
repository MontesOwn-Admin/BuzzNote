import { Component, Input, OnInit } from '@angular/core';
import { Box } from '../../bees.model';
import { Router, ActivatedRoute } from '@angular/router';
import { BoxesService } from '../../services/boxes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HivesService } from '../../services/hives.service';

@Component({
  selector: 'app-box-detail',
  imports: [FormsModule, CommonModule],
  templateUrl: './box-detail.component.html',
  styleUrl: './box-detail.component.css'
})
export class BoxDetailComponent implements OnInit {
  @Input() hiveID: number = 0;
  @Input() numBoxes: number = 0;
  boxes: Box[] | null = null;
  loading = false;
  error: string | null = null;
  message: string | null = null;
  showEdit: boolean = false;
  showAdd: boolean = false;
  updatedBox: Box = new Box(0, 0, "", 0, "", false, false);
  newBox: Box = new Box(0, 0, "", 0, "", false, false);

  constructor(
    private boxService: BoxesService,
    private hiveService: HivesService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.fetchBoxes();
    this.newBox = new Box(0, this.hiveID, "", 0, "", false, false);
  }

  fetchBoxes() {
    this.loading = true;
    this.boxService.getBoxesForHiveID(this.hiveID, false).subscribe({
      next: (data) => {
        this.boxes = data;
        console.log(`Box Detail component: found ${data.length} boxes`);
        this.loading = false;
      }, error: (error) => {
        this.error = error;
        this.loading = false;
      },
    });
  }

  editBox(boxId: number) {
    this.updatedBox = this.boxes?.find((box) => box.box_id === boxId)!;
    this.showEdit = true;
  }

  onSubmit(action: number) {
    if (action === 1) {
      // update box
      this.boxService.updateBox(this.updatedBox.box_id, this.updatedBox).subscribe({
        next: (data) => {
          this.showEdit = false;
          this.message = "Updated box succefully";
          setTimeout(() => {
            this.message = null;
          }, 5000);
          this.fetchBoxes();
        }
      })
    } else if (action === 2) {
      // cancel update box
      this.showEdit = false;
      this.updatedBox = new Box(0, 0, "", 0, "", false, false);
    } else if (action === 3) {
      // add new box
      this.boxService.addNewBox(this.newBox).subscribe({
        next: (data) => {
          this.numBoxes += 1;
          this.hiveService.updateNumBoxesForID(this.hiveID, this.numBoxes).subscribe({
            next: (data) => {
              this.showAdd = false;
            }
          });
          this.message = `Added new box succefully. This hive now has ${this.numBoxes} boxes`;
              setTimeout(() => {
                this.message = null;
              }, 5000);
              this.fetchBoxes();
        }
      })
    } else if (action === 4) {
      // cancel add new box
      this.showAdd = false;
      this.newBox = new Box(0, this.hiveID, "", 0, "", false, false);
    }
  }

}
