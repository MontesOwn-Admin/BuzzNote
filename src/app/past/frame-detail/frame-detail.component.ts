import { Component, Input, OnInit } from '@angular/core';
import { Frame, Inspection } from '../../bees.model';
import { FramesService } from '../../services/frames.service';

@Component({
  selector: 'app-frame-detail',
  imports: [],
  templateUrl: './frame-detail.component.html',
  styleUrl: './frame-detail.component.css'
})
export class FrameDetailComponent implements OnInit {
  @Input() inspectionID: number = 0;
  @Input() boxName: string = "";
  frames: Frame[] = [];

  constructor(private framesService: FramesService) {}
  
  ngOnInit(): void {
    this.framesService.getFramesForInspectionIDAndBoxName(this.inspectionID, this.boxName).subscribe({
      next: (data) => {
        this.frames = data;
      }
    })
  }

}
