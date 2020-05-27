export interface TransportState {
  playstate: boolean;
  positionSeconds: number;
  isRepeatOn: boolean;
  positionString: string;
  positionStringBeats: string;
}

export interface BeatposState {
  playstate: boolean;
  positionSeconds: number;
  fullBeatPosition: number;
  measureCount: number;
  beatsInMeasure: number;
  tsNumerator: number;
  tsDenominator: number;
}

export enum TrackFlag {
  folder = 1,
  selected = 2,
  hasFx = 4,
  muted = 8,
  soloed = 16,
  recordArmed = 64,
  recordMonitoringOn = 128,
  recordMonitoringAuto = 256,
  tcpVisibility = 512,
  mcpVisibility = 1024
}

export interface TrackState {
  tracknumber: number;
  trackname: string;
  trackflags: number;
  volume: number;
  pan: number;
  lastMeterPeak: number;
  lastMeterPos: number;
  widthPan2: number;
  panmode: number;
  sendCount: number;
  receiveCount: number;
  hardwareOutCount: number;
  color: string;
}
