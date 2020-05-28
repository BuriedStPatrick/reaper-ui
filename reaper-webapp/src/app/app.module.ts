import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActionListComponent } from './action-list/action-list.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrackDetailComponent } from './track/track-detail/track-detail.component';
import { TrackListComponent } from './track/track-list/track-list.component';
import { TrackMasterComponent } from './track/track-master/track-master.component';
import { TransportComponent } from './transport/transport.component';


@NgModule({
  declarations: [
    AppComponent,
    TrackListComponent,
    ActionListComponent,
    TransportComponent,
    TrackDetailComponent,
    TrackMasterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
