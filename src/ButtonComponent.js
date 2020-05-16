class ButtonComponent extends UIComponent {
	static nextSvgString() {
		return '<svg version="1.1" viewBox="0 0 6.3499999 12.7" height="48" width="24"><path d="M 2.1166666,2.1166666 4.2333333,6.3499999 2.1166666,10.583333" style="fill:none;stroke:#000000;stroke-width:1.32291666;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:1;stroke-miterlimit:4;stroke-dasharray:none" /></svg>'
	}
	static previousSvgString() {
		return '<svg viewBox="0 0 6.3499999 12.7" height="48" width="24"><path d="M 4.2333255,2.1166666 2.1166588,6.3499999 4.2333255,10.583333" style="fill:none;stroke:#000000;stroke-width:1.32292;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" /></svg>'
	}
	static NextButton(action) {
		return new ButtonComponent(this.nextSvgString(), action)
	}
	static PreviousButton(action) {
		return new ButtonComponent(this.previousSvgString(), action)
	}
	constructor(html, action) {
		super()
		this._html = html
		this._action = action || function (button) {}
		this._button = null
		this.shiftKey = false
	}
	html(html) {
		if (html) {
			this._html = html
			if (this._html) {
				this.button().innerHTML = this._html
			}
		}
		return this._html
	}
	action(action) {
		if (action) {
			this._action = action
		}
		return this._action
	}

	createComponent() {
		let c = super.createComponent()
		c.appendChild(this.button())
		return c
	}
	button() {
		if (!this._button) {
			this._button = document.createElement('button')
			this._button.className = 'button'
			if (this._html) {
				this._button.innerHTML = this.html()
			}
			this._button.addEventListener('mouseup', (evt) => {
				this._button.focus()
				evt.preventDefault()
				this.shiftKey = evt.shiftKey
				this.push()
			})
			this._button.addEventListener('touchend', (evt) => {
				this._button.focus()
				evt.preventDefault()
				this.shiftKey = evt.shiftKey
				this.push()
			})
		}
		return this._button
	}

	select() {
		this.button().classList.add('select')
	}
	deselect() {
		this.button().classList.remove('select')
	}
	enable(aBoolean) {
		if (aBoolean !== undefined) {
			this.button().disabled = !aBoolean
		}
		return !this.button().disabled
	}
	push() {
		if (!this.action()) {
			return
		}
		this.action()(this)
	}
}
