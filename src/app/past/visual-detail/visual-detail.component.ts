import { Component, Input, OnInit } from '@angular/core';
import { Frame } from '../../bees.model';
import { FramesService } from '../../services/frames.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visual-detail',
  imports: [CommonModule],
  templateUrl: './visual-detail.component.html',
  styleUrl: './visual-detail.component.css'
})
export class VisualDetailComponent implements OnInit {
  @Input() inspectionID: number = 0;
  @Input() boxName: string = "";
  @Input() queen: string = ""
  frames: Frame[] = [];

  constructor(private framesService: FramesService) {}

  ngOnInit(): void {
    this.framesService.getFramesForInspectionIDAndBoxName(this.inspectionID, this.boxName).subscribe({
      next: (data) => {
        this.frames = data;
      }
    });
  }

  addClasses(frame: Frame): string {
    if (frame.brood) {
      return "brood";
    } else if (frame.honey || frame.nectar) {
      return "honey";
    } else if (frame.drawn_comb) {
      return "draw-comb";
    } else {
      return "none";
    }
  }
}
