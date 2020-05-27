import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionListComponent } from 'src/app/action-list/action-list.component';
import { TrackListComponent } from 'src/app/track-list/track-list.component';


const routes: Routes = [
    {
        path: 'tracks',
        component: TrackListComponent
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
