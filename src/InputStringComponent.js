function InputStringComponent (name, value, action) {
    LabeledComponent.call(this, name, action);
	this._value = value;
	this._previousValue = value;

	this._valueField = null;
}
inherits(InputStringComponent, LabeledComponent);

InputStringComponent.prototype.value = function (value, sender) {
	if (value != undefined) {
		this._previousValue = this._value;
		this._value = value;
		this.valueField().value = this._value;
		if (this.action() && sender == undefined) {
			this.action()(this);
		}
	}
	return this._value;
};
InputStringComponent.prototype.previousValue = function () {
	return this._previousValue;
};

InputStringComponent.prototype.createComponent = function () {
	var component = LabeledComponent.prototype.createComponent.call(this);
	component.appendChild(this.valueField());
	return component;
};
InputStringComponent.prototype.valueField = function () {
	if (!this._valueField) {
		this._valueField = document.createElement('input')
		this._valueField.type = 'text'
		if (this.value() != undefined && this.value() != '') {
			this._valueField.value = this.value()
		}
		this._valueField.addEventListener('change', (evt) => {
			this.value(this._valueField.value)
		}, false)
//		this._valueField.size = 3
	}
	return this._valueField
}
InputStringComponent.prototype.focus = function () {
	this.valueField().focus();
};

InputStringComponent.prototype.placeHolder = function (string) {
	if (string) {
		this.valueField().placeholder = string
	}
	return this.valueField().placeholder
}
