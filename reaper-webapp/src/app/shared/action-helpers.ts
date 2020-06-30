import { ReaperAction } from 'src/app/shared/action.service';

export const toReaperAction = (input: string): ReaperAction => {
    const split = input.split('\t');
    return {
        section: split[0],
        id: split[1],
        action: split[2]
    } as ReaperAction;
};

export const reaperActionIcons: { [actionname: string]: string; } = {
    '.*\t.*\t(Track:)': 'list',
    '.*\t.*\t(View:)': 'view_quilt',
    '.*\t.*\t(Transport:)': 'equalizer'
};
