# ReaperWebapp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Examples
### Polling REAPER DAW data
```typescript
import { ReaperService } from './shared/reaper.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [ReaperService]
})
export class AppComponent implements OnInit, OnDestroy {
    private readonly abandon$ = new Subject<void>;
    transportState$: Observable<TransportState>;
    
    constructor(
        private reaperService: ReaperService
    ) { }
    
    ngOnDestroy(): void {
        this.abandon$.next();
    }

    ngOnInit(): void {
        // When subscribed to (suggested in html with async-pipe) updates transport-state every .5 seconds
        // Terminates subscription when component is dropped
        this.transportState$ = this.reaperService.pollTransportState(500).pipe(
            takeUntil(this.abandon$)
        );
    }
}
```
