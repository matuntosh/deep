function ButtonComponent (html, action) {
	UIComponent.call(this);
	this._html = html;
	this._action = action;
	this._button = null;
    this.shiftKey = false;
}
inherits(ButtonComponent, UIComponent);

ButtonComponent.prototype.html = function (html) {
	if (html) {
		this._html = html;
        if (this._html) {
            this.button().innerHTML = this._html;
        }
	}
	return this._html;
};
ButtonComponent.prototype.action = function (action) {
	if (action) {
		this._action = action;
	}
	return this._action;
};

ButtonComponent.prototype.createComponent = function () {
	let c = UIComponent.prototype.createComponent.call(this);
	c.appendChild(this.button());
	return c;
};
ButtonComponent.prototype.button = function () {
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

ButtonComponent.prototype.select = function () {
	this.button().classList.add('select');
};
ButtonComponent.prototype.deselect = function () {
	this.button().classList.remove('select');
};
ButtonComponent.prototype.enable = function (aBoolean) {
    if (aBoolean !== undefined) {
        this.button().disabled = !aBoolean;
    }
    return !this.button().disabled;
};
ButtonComponent.prototype.push = function () {
	if (!this.action()) {
		return
	}
	this.action()(this)
}