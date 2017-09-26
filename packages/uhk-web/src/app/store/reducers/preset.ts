import { Action } from '@ngrx/store';
import { Keymap } from 'uhk-common';

import { KeymapActions } from '../actions/keymap';

const initialState: Keymap[] = [];

export default function(state = initialState, action: Action): Keymap[] {
    switch (action.type) {
        case KeymapActions.LOAD_KEYMAPS_SUCCESS: {
            return action.payload;
        }

        default:
            return state;
    }
}
