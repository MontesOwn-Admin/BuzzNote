export class Inspection {
    constructor(
        public inspection_id: number,
        public hive_id: number,
        public inspection_date: string,
        public hive_name: string,
        public start_time: string,
        public weather_temp: number,
        public weather_condition: string,
        public bee_temperament: string,
        public bee_population: string,
        public drone_population: string,
        public laying_pattern: string,
        public hive_beetles: string,
        public other_pests: string,
        public brood_eggs: boolean,
        public brood_larva: boolean,
        public brood_capped: boolean,
        public queen_spotted: boolean,
        public notes: string
    ) {}
}

export class InspectionListItem {
    constructor(
        public inspection_id: number,
        public hive_name: string,
        public inspection_date: string,
        public start_time: string,
        public num_boxes: number,
        public total_frames: number
    ) {}
}

export class Average {
    constructor(
        public average_id: number,
        public inspection_id: number,
        public box_name: string,
        public num_frames: number,
        public honey: string,
        public nectar: string,
        public brood: string,
        public queen_cells: string,
        public drawn_comb: string,
        public queen_spotted: string,
    ) {}
}

export class AverageDetail {
    constructor(
        public average_id: number,
        public inspection_id: number,
        public box_name: string,
        public num_frames: number,
        public honey: string,
        public nectar: string,
        public brood: string,
        public queen_cells: string,
        public drawn_comb: string,
        public queen_spotted: string,
        public showFrames: boolean
    ) {
        showFrames = false;
    }
}

export class Notes {
    constructor(
        public notes: string
    ) {}
}

export class Hive {
    constructor(
        public hive_id: number,
        public hive_name: string,
        public num_boxes: number,
        public active: boolean
    ) {}
}

export class Box {
    constructor(
        public box_id: number,
        public hive_id: number,
        public box_name: string,
        public num_frames: number,
        public box_type: string,
        public overwinter: boolean,
        public active: boolean
    ) {}
}

export class TempAndCondition {
    constructor(
      public temp: number,
      public condition: string
    ) {}
  }

export class Frame {
    constructor(
        public frame_id: number,
        public box_id: number, 
        public inspection_id: number, 
        public box_name: string, 
        public frame_number: string, 
        public drawn_comb: boolean, 
        public honey: boolean, 
        public nectar: boolean, 
        public brood: boolean, 
        public queen_cells: boolean
    ) {}
}

export class FrameFormGroup {
    constructor(
        public honey: FramePair,
        public nectar: FramePair,
        public brood: FramePair,
        public queenSpotted: FramePair,
        public queen_cells: FramePair,
        public drawn_comb: FramePair
    ) {}
}

export class FramePair {
    constructor(
        public sideA: boolean,
        public sideB: boolean
    ) {}
}