import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import {
    SecondaryRoleStrategy,
    SecondaryRoleAdvancedStrategyTimeoutAction,
    SecondaryRoleAdvancedStrategyTimeoutType,
    SecondaryRoleAdvancedStrategyTriggeringEvent,
} from 'uhk-common';

import { AppState, getUserConfiguration } from '../../../store';
import { SetUserConfigurationValueAction } from '../../../store/actions/user-config';

@Component({
    selector: 'typing-behavior-page',
    standalone: false,
    templateUrl: './typing-behavior-page.component.html',
    styleUrls: ['./typing-behavior-page.component.scss'],
    host: {
        'class': 'container-fluid d-block'
    }
})
export class TypingBehaviorPage implements OnInit, OnDestroy {
    faSlidersH = faSlidersH;
    SecondaryRoleStrategy = SecondaryRoleStrategy;
    SecondaryRoleAdvancedStrategyTimeoutAction = SecondaryRoleAdvancedStrategyTimeoutAction;
    SecondaryRoleAdvancedStrategyTriggeringEvent = SecondaryRoleAdvancedStrategyTriggeringEvent;
    SecondaryRoleAdvancedStrategyTimeoutType = SecondaryRoleAdvancedStrategyTimeoutType;

    secondaryRoleStrategy = SecondaryRoleStrategy.Simple;
    secondaryRoleAdvancedStrategyTimeout = 350;
    secondaryRoleAdvancedStrategyTimeoutAction = SecondaryRoleAdvancedStrategyTimeoutAction.Secondary;
    secondaryRoleAdvancedStrategyTrigger = SecondaryRoleAdvancedStrategyTriggeringEvent.Release;
    secondaryRoleAdvancedStrategySafetyMargin = 50;
    secondaryRoleAdvancedStrategyDoubletapToPrimary = true;
    secondaryRoleAdvancedStrategyDoubletapTimeout = 200;
    secondaryRoleAdvancedStrategyTriggerByMouse = false;
    secondaryRoleAdvancedStrategyTriggerFromSameHalf = true;
    secondaryRoleAdvancedStrategyMinimumHoldTime = 0;
    secondaryRoleAdvancedStrategyTimeoutType = SecondaryRoleAdvancedStrategyTimeoutType.Active;

    doubletapTimeout = 400;
    keystrokeDelay = 0;

    private userConfigSubscription: Subscription;

    constructor(private store: Store<AppState>,
        private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.userConfigSubscription = this.store.select(getUserConfiguration)
            .subscribe(config => {
                this.secondaryRoleStrategy = config.secondaryRoleStrategy;
                this.secondaryRoleAdvancedStrategyTimeout = config.secondaryRoleAdvancedStrategyTimeout;
                this.secondaryRoleAdvancedStrategyTimeoutAction = config.secondaryRoleAdvancedStrategyTimeoutAction;
                this.secondaryRoleAdvancedStrategyTrigger = config.secondaryRoleAdvancedStrategyTrigger;
                this.secondaryRoleAdvancedStrategySafetyMargin = config.secondaryRoleAdvancedStrategySafetyMargin;
                this.secondaryRoleAdvancedStrategyDoubletapToPrimary = config.secondaryRoleAdvancedStrategyDoubletapToPrimary;
                this.secondaryRoleAdvancedStrategyDoubletapTimeout = config.secondaryRoleAdvancedStrategyDoubletapTimeout;
                this.secondaryRoleAdvancedStrategyTriggerByMouse = config.secondaryRoleAdvancedStrategyTriggerByMouse;
                this.secondaryRoleAdvancedStrategyTriggerFromSameHalf = config.secondaryRoleAdvancedStrategyTriggerFromSameHalf;
                this.secondaryRoleAdvancedStrategyMinimumHoldTime = config.secondaryRoleAdvancedStrategyMinimumHoldTime;
                this.secondaryRoleAdvancedStrategyTimeoutType = config.secondaryRoleAdvancedStrategyTimeoutType;

                this.doubletapTimeout = config.doubletapTimeout;
                this.keystrokeDelay = config.keystrokeDelay;

                this.cdRef.detectChanges();
            });
    }

    ngOnDestroy(): void {
        if (this.userConfigSubscription) {
            this.userConfigSubscription.unsubscribe();
        }
    }

    onSetPropertyValue(propertyName: string, value: number): void {
        this.store.dispatch(new SetUserConfigurationValueAction({
            propertyName,
            value
        }));
    }
}
