import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BeatposState, TrackFlag, TrackState, TransportState } from 'src/app/shared/models';

export const toTransportState = (input: Observable<string>): Observable<TransportState> => input.pipe(
  map(body => body.split('\t')),
  map(split => ({
        playstate: split[1] === '1',
        positionSeconds: Number.parseFloat(split[2]),
        isRepeatOn: split[3] === '1',
        positionString: split[4],
        positionStringBeats: split[5]?.replace('\n', '')
      } as TransportState
    )
  )
);

export const toBeatposState = (input: Observable<string>): Observable<BeatposState> => input.pipe(
  map(body => body.split('\t')),
  map(split => ({
    playstate: split[1] === '1',
    positionSeconds: Number.parseFloat(split[2]),
    fullBeatPosition: Number.parseFloat(split[3]),
    measureCount: Number.parseInt(split[4], 10),
    beatsInMeasure: Number.parseFloat(split[5]),
    tsNumerator: Number.parseInt(split[6], 10),
    tsDenominator: Number.parseInt(split[7], 10)
  } as BeatposState))
);

export const toTrackCount = (input: Observable<string>): Observable<number> => input.pipe(
  map(body => Number.parseInt(body.split('\t')[1], 10))
);

export const toTrackState = (input: Observable<string>): Observable<TrackState> => input.pipe(
    map(body => body.split('\t')),
    map(split => ({
        tracknumber: Number.parseInt(split[1], 10),
        trackname: split[2],
        trackflags: Number.parseInt(split[3], 10),
        volume: Number.parseFloat(split[4]),
        pan: Number.parseFloat(split[5]),
        lastMeterPeak: Number.parseFloat(split[6]) / 10,
        lastMeterPos: Number.parseFloat(split[7]) / 10,
        widthPan2: Number.parseInt(split[8], 10),
        panmode: Number.parseInt(split[9], 10),
        sendCount: Number.parseInt(split[10], 10),
        receiveCount: Number.parseInt(split[11], 10),
        hardwareOutCount: Number.parseInt(split[12], 10),
        color: toHexColor(Number.parseInt(split[13], 10))
    } as TrackState))
);

export const toTrackStates = (input: Observable<string>): Observable<TrackState[]> => input.pipe(
  map(body => body.split('\n').filter(b => b.trim() !== '')),
  map(trackBodies => trackBodies.map(
    trackBody => {
      const split = trackBody.split('\t');
      return {
        tracknumber: Number.parseInt(split[1], 10),
        trackname: split[2],
        trackflags: Number.parseInt(split[3], 10),
        volume: Number.parseFloat(split[4]),
        pan: Number.parseFloat(split[5]),
        lastMeterPeak: Number.parseFloat(split[6]) / 10,
        lastMeterPos: Number.parseFloat(split[7]) / 10,
        widthPan2: Number.parseInt(split[8], 10),
        panmode: Number.parseInt(split[9], 10),
        sendCount: Number.parseInt(split[10], 10),
        receiveCount: Number.parseInt(split[11], 10),
        hardwareOutCount: Number.parseInt(split[12], 10),
        color: toHexColor(Number.parseInt(split[13], 10))
      } as TrackState;
    }
  ))
);

export const toHexColor = (input: number): string | null =>
  input === 0
    ? '#ffffff'
    : `#${input.toString(16).substring(1)}`;

export const hasFlag = (track: TrackState, input: TrackFlag): boolean =>
  (track.trackflags & input) !== 0;
