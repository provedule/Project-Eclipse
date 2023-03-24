import * as ComponentTypes from "./ComponentTypes.js";
export class Button {
    constructor({ id, text, iconPath, data }) {
        return {
            customId: id,
            type: ComponentTypes.Button,
            text,
            iconPath,
            customData: data,
        };
    };
};

export class Dropdown {
    constructor({ id, label, options, defaultValue }) {
        return {
            customId: id,
            type: ComponentTypes.Dropdown,
            label,
            options,
            defaultValue,
        }
    };
};

export class DropdownOption {
    constructor({ id, text, data }) {
        return {
            customId: id,
            text,
            customData: data,
        }
    };
};

export class Slider {
    constructor({ id, label, minimumValue, maximumValue, valueStep, defaultValue }) {
        return {
            customId: id,
            type: ComponentTypes.Slider,
            label,
            minimumValue,
            maximumValue,
            valueStep,
            defaultValue,
        }
    };
};

export class TextField {
    constructor({ id, label, placeholderText, defaultValue }) {
        return {
            customId: id,
            type: ComponentTypes.TextField,
            label,
            placeholderText,
            defaultValue,
        }
    };
};

export class Toggle {
    constructor({ id, label, defaultValue }) {
        return {
            customId: id,
            type: ComponentTypes.Toggle,
            label,
            defaultValue,
        }
    };
};