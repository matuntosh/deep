class InputNumberComponent extends InputStringComponent {
	constructor(name, value, increment, unit, filter, action) {
		super(name, value, action)
		this._increment = increment
		this._unit = unit
		this._filter = filter ? filter : function (value) { return value }
		this._unitLabel = null
	}
	value(value, sender) {
		if (value != undefined) {
			this._previousValue = this._value
			this._value = this._filter(value)
			this.valueField().value = this._value
			if (this.action() && sender == undefined) {
				this.action()(this)
			}
		}
		return this._value
	}
	increment(increment) {
		if (increment != undefined) {
			this._increment = increment
		}
		return this._increment
	}
	unit(unit) {
		if (unit != undefined) {
			this._unit = unit
		}
		return this._unit
	}
	createComponent() {
		var component = super.createComponent()
		component.appendChild(this.unitLabel())
		return component
	}
	valueField() {
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
	}
	unitLabel() {
		if (!this._unitLabel) {
			this._unitLabel = document.createElement('label')
			this._unitLabel.className = 'unit'
			this._unitLabel.textContent = this.unit()
		}
		return this._unitLabel
	}
}
