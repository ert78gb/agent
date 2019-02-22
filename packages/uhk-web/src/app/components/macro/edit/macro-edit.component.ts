import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Macro, MacroAction } from 'uhk-common';

import { Observable, Subscription } from 'rxjs';

import {
    AddMacroActionAction,
    DeleteMacroActionAction,
    ReorderMacroActionAction,
    SaveMacroActionAction,
    SelectMacroAction
} from '../../../store/actions/macro';
import { AppState, getSelectedMacro, macroPlaybackSupported } from '../../../store';
import { pluck } from 'rxjs/operators';

@Component({
    selector: 'macro-edit',
    templateUrl: './macro-edit.component.html',
    styleUrls: ['./macro-edit.component.scss'],
    host: {
        'class': 'container-fluid'
    }
})
export class MacroEditComponent implements OnDestroy {
    macro: Macro;
    isNew: boolean;
    macroId: number;
    macroPlaybackSupported$: Observable<boolean>;

    private selectedMacroSubscription: Subscription;
    private routeSubscription: Subscription;

    constructor(private store: Store<AppState>,
                public route: ActivatedRoute) {

        this.routeSubscription = route
            .params
            .pipe(
                pluck<{}, string>('id')
            )
            .subscribe(id => store.dispatch(new SelectMacroAction(+id)));

        this.selectedMacroSubscription = store.select(getSelectedMacro)
            .subscribe((macro: Macro) => {
                this.macro = macro;
            });

        this.isNew = this.route.snapshot.params['empty'] === 'new';
        this.macroPlaybackSupported$ = this.store.select(macroPlaybackSupported);
    }

    ngOnDestroy() {
        this.selectedMacroSubscription.unsubscribe();
        this.routeSubscription.unsubscribe();
    }

    addAction(macroId: number, action: MacroAction) {
        this.store.dispatch(new AddMacroActionAction({ id: macroId, action }));
    }

    editAction(macroId: number, index: number, action: MacroAction) {
        this.store.dispatch(new SaveMacroActionAction({ id: macroId, index, action }));
    }

    deleteAction(macroId: number, index: number, action: MacroAction) {
        this.store.dispatch(new DeleteMacroActionAction({ id: macroId, index, action }));
    }

    reorderAction(macroId: number, oldIndex: number, newIndex: number) {
        this.store.dispatch(new ReorderMacroActionAction({ id: macroId, oldIndex, newIndex }));
    }
}
