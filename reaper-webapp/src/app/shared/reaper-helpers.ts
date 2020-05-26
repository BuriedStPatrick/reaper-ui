import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransportState } from 'src/app/shared/models';

export const toTransportState = (input: Observable<string>): Observable<TransportState> => input.pipe(
  map(body => body.split('\t')),
  map(split => ({
        playing: split[1] === '1',
        positionSeconds: Number.parseFloat(split[2]),
        isRepeatOn: split[3] === '1',
        positionString: split[4],
        positionStringBeats: split[5]?.replace('\n', '')
      } as TransportState
    )
  )
);
