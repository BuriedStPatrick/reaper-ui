import { Component } from '@angular/core';
import { TrackMasterStateService } from 'src/app/track/track-master/track-master-state.service';

@Component({
  selector: 'app-track-master',
  templateUrl: './track-master.component.html',
  styleUrls: ['./track-master.component.scss'],
  providers: [TrackMasterStateService]
})
export class TrackMasterComponent {
}
