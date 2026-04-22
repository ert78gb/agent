import { SecondaryRoleAdvancedStrategyTimeoutAction } from './secondary-role-advanced-strategy-timeout-action.js';
import { SecondaryRoleAdvancedStrategyTimeoutType } from './secondary-role-advanced-strategy-timeout-type.js';
import { SecondaryRoleAdvancedStrategyTriggeringEvent } from './secondary-role-advanced-strategy-triggering-event.js';
import { SecondaryRoleStrategy } from './secondary-role-strategy.js';

export interface AdvancedSecondaryRoleConfiguration {
    secondaryRoleAdvancedStrategyTimeout: number;
    secondaryRoleAdvancedStrategyMinimumHoldTime: number;
    secondaryRoleAdvancedStrategyTrigger: SecondaryRoleAdvancedStrategyTriggeringEvent;
    secondaryRoleAdvancedStrategyTimeoutAction: SecondaryRoleAdvancedStrategyTimeoutAction;
    secondaryRoleAdvancedStrategyTimeoutType: SecondaryRoleAdvancedStrategyTimeoutType;
    secondaryRoleAdvancedStrategySafetyMargin: number;
    secondaryRoleAdvancedStrategyDoubletapToPrimary: boolean;
    secondaryRoleAdvancedStrategyTriggerByMouse: boolean;
    secondaryRoleAdvancedStrategyTriggerFromSameHalf: boolean;
}

export const ADVANCED_SECONDARY_ROLE_CONFIGURATION_FIELD_NAMES: Array<keyof AdvancedSecondaryRoleConfiguration> = [
    'secondaryRoleAdvancedStrategyTimeout',
    'secondaryRoleAdvancedStrategyMinimumHoldTime',
    'secondaryRoleAdvancedStrategyTrigger',
    'secondaryRoleAdvancedStrategyTimeoutAction',
    'secondaryRoleAdvancedStrategyTimeoutType',
    'secondaryRoleAdvancedStrategySafetyMargin',
    'secondaryRoleAdvancedStrategyDoubletapToPrimary',
    'secondaryRoleAdvancedStrategyTriggerByMouse',
    'secondaryRoleAdvancedStrategyTriggerFromSameHalf'
]

export const ADVANCED_SECONDARY_ROLE_CONFIGURATION_FIELD_SET = new Set<keyof AdvancedSecondaryRoleConfiguration>(ADVANCED_SECONDARY_ROLE_CONFIGURATION_FIELD_NAMES)

export interface AdvancedSecondaryRoleConfigurationPreset {
    name: string;
    strategy: SecondaryRoleStrategy;
    configuration: AdvancedSecondaryRoleConfiguration;
}

export const CUSTOM_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET_NAME = 'Custom';
export const HRM_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET_NAME = 'HRM';
export const SIMPLE_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET_NAME = 'Simple';
export const SIMPLE_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET: AdvancedSecondaryRoleConfigurationPreset = {
    name: SIMPLE_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET_NAME,
    strategy: SecondaryRoleStrategy.Simple,
    configuration: {
        secondaryRoleAdvancedStrategyTimeout: 350,
        secondaryRoleAdvancedStrategyMinimumHoldTime: 0,
        secondaryRoleAdvancedStrategyTimeoutAction: SecondaryRoleAdvancedStrategyTimeoutAction.Secondary,
        secondaryRoleAdvancedStrategyTimeoutType: SecondaryRoleAdvancedStrategyTimeoutType.Active,
        secondaryRoleAdvancedStrategyTrigger: SecondaryRoleAdvancedStrategyTriggeringEvent.Release,
        secondaryRoleAdvancedStrategySafetyMargin: 50,
        secondaryRoleAdvancedStrategyDoubletapToPrimary: true,
        secondaryRoleAdvancedStrategyTriggerByMouse: false,
        secondaryRoleAdvancedStrategyTriggerFromSameHalf: true,
    }
}

export const HRM_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET: AdvancedSecondaryRoleConfigurationPreset = {
    name: HRM_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET_NAME,
    strategy: SecondaryRoleStrategy.Advanced,
    configuration: {
        secondaryRoleAdvancedStrategyTimeout: 300,
        secondaryRoleAdvancedStrategyMinimumHoldTime: 0,
        secondaryRoleAdvancedStrategyTimeoutAction: SecondaryRoleAdvancedStrategyTimeoutAction.None,
        secondaryRoleAdvancedStrategyTimeoutType: SecondaryRoleAdvancedStrategyTimeoutType.Passive,
        secondaryRoleAdvancedStrategyTrigger: SecondaryRoleAdvancedStrategyTriggeringEvent.Release,
        secondaryRoleAdvancedStrategySafetyMargin: -40,
        secondaryRoleAdvancedStrategyDoubletapToPrimary: true,
        secondaryRoleAdvancedStrategyTriggerByMouse: true,
        secondaryRoleAdvancedStrategyTriggerFromSameHalf: false,
    }
}

export const BUILTIN_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESETS: AdvancedSecondaryRoleConfigurationPreset[] = [
    SIMPLE_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET,
    HRM_ADVANCED_SECONDARY_ROLE_CONFIGURATION_PRESET,
];
