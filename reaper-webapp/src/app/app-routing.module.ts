import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionListComponent } from 'src/app/action-list/action-list.component';
import { TrackMasterComponent } from 'src/app/track/track-master/track-master.component';


const routes: Routes = [
    {
        path: 'tracks',
        component: TrackMasterComponent
    },
    {
        path: 'actions',
        component: ActionListComponent
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
