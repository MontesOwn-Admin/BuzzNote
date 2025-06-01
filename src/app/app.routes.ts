import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InspectionDetailComponent } from './past/inspection-detail/inspection-detail.component';
import { PastComponent } from './past/past.component';
import { HivesComponent } from './hives/hives.component';
import { HiveDetailComponent } from './hives/hive-detail/hive-detail.component';
import { SearchComponent } from './search/search.component';
import { InspectionComponent } from './inspection/inspection.component';
import { FramesComponent } from './inspection/frames/frames.component';
import { EndComponent } from './inspection/end/end.component';

export const routes: Routes = [
    {path:'', component: HomeComponent},
    {path:'past', component: PastComponent},
    {path: 'inspections/:id', component: InspectionDetailComponent},
    {path: 'hives', component: HivesComponent},
    {path: 'hives/:id', component: HiveDetailComponent},
    {path: 'search', component: SearchComponent},
    {path: 'start', component: InspectionComponent},
    {path: 'frames', component: FramesComponent},
    {path: 'end', component: EndComponent}
];
