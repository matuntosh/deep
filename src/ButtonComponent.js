class ButtonComponent extends UIComponent {
	constructor(html, action) {
		super()
		this._html = html
		this._action = action
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
