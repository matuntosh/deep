class SwitchComponent extends LabeledComponent {
	constructor(name, on, switchAction, switchLabelOption) {
		super(name, switchAction)
		this._on = on
		this._switch = null
		this._switchLabels = switchLabelOption || {on: 'on', off: 'off'}
	}
	on(on, sender) {
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
	switchLabels(labels) {
		if (labels !== undefined) {
			this._switchLabels = labels
			this.switch().innerHTML = this.labelAtState(this.on())
		}
		return this._switchLabels
	}
	createComponent() {
		var component = LabeledComponent.prototype.createComponent.call(this)
		component.appendChild(this.switch())
		if (this.on()) {
			component.classList.add('on')
		}
		return component
	}
	labelAtState(boolean) {
		let string = boolean ? 'on' : 'off'
		return this.switchLabels()[string]
	}
	switch() {
		if (!this._switch) {
			this._switch = document.createElement('button')
			this._switch.className = 'toggleButton'
			this._switch.innerHTML = this.labelAtState(this.on())
			this._switch.addEventListener('mouseup', (evt) => {
				this.on(!this.on())
				this.focus()
			}, false)
		}
		return this._switch
	}
	enable(aBoolean) {
		if (aBoolean !== undefined) {
			this.switch().disabled = !aBoolean
		}
		return !this.switch().disabled
	}
}
