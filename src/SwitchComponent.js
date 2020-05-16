class SwitchComponent extends LabeledComponent {
	static resumeSvgString(className) {
		return '<svg width="24" height="48" viewBox="0 0 6.3499999 12.7"><path class="' + className + '" d="M 1.5875,2.1166667 5.8208333,6.35 1.5875,10.583333 Z" /></svg>'
	}
	static backSvgString(className) {
		return '<svg width="24" height="48" viewBox="0 0 6.3499999 12.7"><path class="' + className + '" d="M 5.2916666,2.1166667 1.0583333,6.35 5.2916666,10.583333 Z" /></svg>'
	}
	static PauseResumeSwitch(name, on, action) {
		return new SwitchComponent(name, on, action, {
			on: SwitchComponent.resumeSvgString('on'),
			off: SwitchComponent.resumeSvgString('off')
		})
	}
	static PauseBackSwitch(name, on, action) {
		return new SwitchComponent(name, on, action, {
			on: SwitchComponent.backSvgString('on'),
			off: SwitchComponent.backSvgString('off')
		})
	}
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
				this._switch.focus()
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
