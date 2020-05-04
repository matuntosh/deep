function InputNumberComponent (name, value, increment, unit, filter, action) {
	InputStringComponent.call(this, name, value, action);
	this._increment = increment;
	this._unit = unit;
	this._filter = filter ? filter : function (value) { return value; };

	this._unitLabel = null;
}
inherits(InputNumberComponent, InputStringComponent);

InputNumberComponent.prototype.value = function (value, sender) {
	if (value != undefined) {
		this._previousValue = this._value;
		this._value = this._filter(value);
		this.valueField().value = this._value;
		if (this.action() && sender == undefined) {
			this.action()(this);
		}
	}
	return this._value;
};
InputNumberComponent.prototype.increment = function (increment) {
	if (increment != undefined) {
		this._increment = increment;
	}
	return this._increment;
};
InputNumberComponent.prototype.unit = function (unit) {
	if (unit != undefined) {
		this._unit = unit;
	}
	return this._unit;
};

InputNumberComponent.prototype.createComponent = function () {
	var component = InputStringComponent.prototype.createComponent.call(this);
	component.appendChild(this.unitLabel());
	return component;
};
InputNumberComponent.prototype.valueField = function () {
	if (!this._valueField) {
		this._valueField = document.createElement('input')
		this._valueField.type = 'number'
		this._valueField.value = this.value()
		this._valueField.step = this.increment()
		this._valueField.addEventListener('change', (evt) => {
			this.value(parseFloat(this._valueField.value))
		}, false)
	}
	return this._valueField
};
InputNumberComponent.prototype.unitLabel = function () {
	if (!this._unitLabel) {
		this._unitLabel = document.createElement('label');
        this._unitLabel.className = 'unit';
		this._unitLabel.textContent = this.unit();
	}
	return this._unitLabel;
};
