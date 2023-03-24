import * as UI from "@minecraft/server-ui";
import * as ComponentTypes from "./ComponentTypes.js";
export class ActionFormData {
    constructor({ title = "", body = "" }) {
        this.title = title;
        this.body = body;
        
        this.buttons =[];
        
        this.ui = new UI.ActionFormData()
        this.ui.title(this.title);
        this.ui.body(this.body);
    };
    
    addButton({ customId, text, iconPath, customData }) {
        this.ui.button(text, iconPath);
        this.buttons.push({
            id: this.buttons.length,
            customId,
            type: ComponentTypes.Button,
            text,
            iconPath,
            customData,
        });
        
        return this;
    };
    
    addButtons(buttons) {
        for(const button of buttons) this.addButton(button);
        return this;
    };
    
    async open(player) {
        if(!player) throw new Error("No player provided.");
        
        const response = await this.ui.show(player);
        if(response.canceled) return {
            canceled: response.canceled,
            cancelationReason: response.cancelationReason,
        };
            
        return {
            canceled: response.canceled,
            cancelationReason: response.cancelationReason,
            selection: this.buttons.find(b => b.id == response.selection),
        };
    };
    
    async forceOpen(player) {
        while (true) {
            const response = await this.open(player);
            if(response. cancelationReason !== "userBusy") {
                return response;
            };
        };
    };
};

export class MessageFormData {
    constructor({ title = "", body = "", buttons }) {
        this.title = title;
        this.body = body;
        this.button1 = buttons[0];
        this.button2 = buttons[1];
        
        this.buttons = [];
        
        this.ui = new UI.MessageFormData()
        this.ui.title(this.title);
        this.ui.body(this.body);
        this.ui.button1(this.button1.text);
        this.ui.button2(this.button2.text);
        
        this.buttons.push({
            id: 0,
            customId: this.button2.customId,
            type: ComponentTypes.Button,
            text: this.button2.text,
            customData: this.button2.customData,
        });
        
        this.buttons.push({
            id: 1,
            customId: this.button1.customId,
            type: ComponentTypes.Button,
            text: this.button1.text,
            customData: this.button1.customData,
        });
    };
    
    async open(player) {
        if(!player) throw new Error("No player provided.");
        
        const response = await this.ui.show(player);
        if(response.canceled) return {
            canceled: response.canceled,
            cancelationReason: response.cancelationReason,
        };
            
        return {
            canceled: response.canceled,
            cancelationReason: response.cancelationReason,
            selection: this.buttons.find(b => b.id == response.selection),
        };
    };
    
    async forceOpen(player) {
        while (true) {
            const response = await this.open(player);
            if(response.cancelationReason !== "userBusy") {
                return response;
            };
        };
    };
};

export class ModalFormData {
    constructor({ title = "" }) {
        this.title = title;
        
        this.components =[];
        
        this.ui = new UI.ModalFormData()
        this.ui.title(this.title);
    };
    
    addDropdown({ customId, label, options, defaultValue }) {
        this.ui.dropdown(label, options.map((o) => o.text), defaultValue);
        
        const mainOptions = [];
        for(let i = 0; i < options.length; i++) {
            mainOptions.push({
                id: i,
                ...options[i],
            });
        };
        
        this.components.push({
            id: this.components.length,
            type: ComponentTypes.Dropdown,
            customId,
            label,
            options: mainOptions,
            defaultValue,
        });
        
        return this;
    };
    
    addSlider({ customId, label, minimumValue, maximumValue, valueStep, defaultValue }) {
        this.ui.slider(label, minimumValue, maximumValue, valueStep, defaultValue);
        this.components.push({
            id: this.components.length,
            type: ComponentTypes.Slider,
            customId,
            label,
            minimumValue,
            maximumValue,
            valueStep,
            defaultValue,
        });
        
        return this;
    };
    
    addTextField({ customId, label, placeholderText, defaultValue }) {
        this.ui.textField(label, placeholderText, defaultValue);
        this.components.push({
            id: this.components.length,
            type: ComponentTypes.TextField,
            customId,
            label,
            placeholderText,
            defaultValue,
        });
        
        return this;
    };
    
    addToggle({ customId, label, defaultValue }) {
        this.ui.toggle(label, defaultValue);
        this.components.push({
            id: this.components.length,
            type: ComponentTypes.Toggle,
            customId,
            label,
            defaultValue,
        });
        
        return this;
    };
    
    addComponents(components) {
        for(const component of components) {
            if(component.type == ComponentTypes.Dropdown) this.addDropdown(component);
            else if(component.type == ComponentTypes.Slider) this.addSlider(component);
            else if(component.type == ComponentTypes.TextField) this.addTextField(component);
            else if(component.type == ComponentTypes.Toggle) this.addToggle(component);
        };
        
        return this;
    };
    
    async open(player) {
        if(!player) throw new Error("No player provided.");
        
        const response = await this.ui.show(player);
        if(response.canceled) return {
            canceled: response.canceled,
            cancelationReason: response.cancelationReason,
        };
            
        const formValues = [];
        for(let i = 0; i < response.formValues.length; i++) {
            const component = this.components.find(b => b.id == i);
            if(component.type == ComponentTypes.Dropdown) {
                component.value = component.options.find(o => o.id == response.formValues[i]);
            } else {
                component.value = response.formValues[i];
            };
                
            formValues.push(component);
        };
            
        return {
            canceled: response.canceled,
            cancelationReason: response.cancelationReason,
            formValues,
        };
    };
    
    async forceOpen(player) {
        while (true) {
            const response = await this.open(player);
            if(response. cancelationReason !== "userBusy") {
                return response;
            };
        };
    };
};