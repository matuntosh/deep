function SwitchComponent (name, on, switchAction, switchLabelOption) {
    LabeledComponent.call(this, name, switchAction);
	this._on = on;
	this._switch = null;
    this._switchLabels = switchLabelOption || {on: 'on', off: 'off'};
}
inherits(SwitchComponent, LabeledComponent);

SwitchComponent.prototype.on = function (on, sender) {
	if (on != undefined && this._on != on) {
		this._on = on
		this.switch().innerHTML = this.labelAtState(this._on)
		if (this._on) {
			this.component().classList.add('on')
		} else {
			this.component().classList.remove('on')
		}
		if (this.action() && sender == undefined) {
			this.action()(this)
		}
	}
	return this._on
}
SwitchComponent.prototype.switchLabels = function (labels) {
    if (labels !== undefined) {
        this._switchLabels = labels;
        this.switch().innerHTML = this.labelAtState(this.on());
    }
    return this._switchLabels;
};

SwitchComponent.prototype.createComponent = function () {
	var component = LabeledComponent.prototype.createComponent.call(this)
	component.appendChild(this.switch())
	if (this.on()) {
		component.classList.add('on')
	}
	return component
}

SwitchComponent.prototype.labelAtState = function (boolean) {
    let string = boolean ? 'on' : 'off';
    return this.switchLabels()[string];
};
SwitchComponent.prototype.switch = function () {
	if (!this._switch) {
		this._switch = document.createElement('button');
		this._switch.className = 'toggleButton';
		this._switch.innerHTML = this.labelAtState(this.on());
		var self = this;
		this._switch.addEventListener('mouseup', function (evt) {
			self.on(!self.on());
			this.focus();
		}, false);
	}
	return this._switch;
};

SwitchComponent.prototype.enable = function (aBoolean) {
    if (aBoolean !== undefined) {
        this.switch().disabled = !aBoolean
    }
    return !this.switch().disabled
}
