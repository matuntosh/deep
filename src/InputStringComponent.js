class InputStringComponent extends LabeledComponent {
	constructor(name, value, action) {
		super(name, action)
		this._value = value
		this._previousValue = value
		this._valueField = null
	}
	value(value, sender) {
		if (value != undefined) {
			this._previousValue = this._value
			this._value = value
			this.valueField().value = this._value
			if (this.action() && sender == undefined) {
				this.action()(this)
			}
		}
		return this._value
	}
	previousValue() {
		return this._previousValue
	}
	createComponent() {
		var component = super.createComponent()
		component.appendChild(this.valueField())
		return component
	}
	valueField() {
		if (!this._valueField) {
			this._valueField = document.createElement('input')
			this._valueField.type = 'text'
			if (this.value() != undefined && this.value() != '') {
				this._valueField.value = this.value()
			}
			this._valueField.addEventListener('change', (evt) => {
				this.value(this._valueField.value)
			}, false)
		}
		return this._valueField
	}
	focus() {
		this.valueField().focus()
	}
	placeHolder(string) {
		if (string) {
			this.valueField().placeholder = string
		}
		return this.valueField().placeholder
	}
}
