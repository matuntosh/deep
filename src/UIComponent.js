/*
The MIT License (MIT)

Copyright (c) Tue Jul 05 2016 Software Research Associates, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORTOR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function inherits(ctor, superCtor) {
	"use strict";
	ctor.super_ = superCtor;
	ctor.prototype = Object.create(superCtor.prototype, {
		constructor: {
			value: ctor,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});
}

function UIComponent() {
	this._visible = true;
	this._component = null;
	this._rect = null;
}

UIComponent.prototype.component = function () {
	if (!this._component) {
		this._component = this.createComponent();
	}
	return this._component;
};
UIComponent.prototype.tagName = function () {
	return 'div';
};
UIComponent.prototype.cssClassName = function () {
	return 'UIComponent ' + this.constructor.name;
};
UIComponent.prototype.createComponent = function () {
	var component = document.createElement(this.tagName());
	component.className = this.cssClassName();
	return component;
};
UIComponent.prototype.initializeComponent = function () {
};
UIComponent.prototype.resizeComponent = function () {
	this._rect = null;
};
UIComponent.prototype.clearComponent = function (target) {
	var c = target || this.component(),
		node = null;
	while (c.childNodes.length > 0) {
		node = c.childNodes.item(0);
		c.removeChild(node);
	}
};
UIComponent.prototype.removeComponent = function () {
	if (!this._component) {
		return
	}
	let parent = this.component().parentElement
	if (!parent) {
		return
	}
	parent.removeChild(this.component())

	if (this._messageReceiveEventListener) {
		window.removeEventListener('message', this._messageReceiveEventListener)
		this._messageReceiveEventListener = null
	}
	if (this._resizeEventListener) {
		window.removeEventListener('resize', this._resizeEventListener)
		this._resizeEventListener = null
	}
}
UIComponent.prototype.rect = function (rect) {
	if (rect !== undefined) {
		this._rect = rect;
	}
	if (!this._rect || this._rect.width == 0 || this._rect.height == 0) {
		// position: sticky だと offsetTop が zero になる
		this._rect = {
			x: this.component().offsetLeft,
			y: this.component().offsetTop,
			width: this.component().offsetWidth,
			height: this.component().offsetHeight
		}
	}
	return this._rect;
};
UIComponent.prototype.size = function () {
	return {
		width: this.rect().width,
		height: this.rect().height
	};
};
UIComponent.prototype.visible = function (visible) {
	if (visible != undefined) {
		this._visible = visible;
		if (this._visible) {
			this.component().classList.remove('invisible');
		} else {
			this.component().classList.add('invisible');
		}
	}
	return this._visible;
};
UIComponent.prototype.select = function () {
	this.component().classList.add('select')
};
UIComponent.prototype.deselect = function () {
	this.component().classList.remove('select')
};
UIComponent.prototype.highlight = function () {};
UIComponent.prototype.offlight = function () {};
UIComponent.prototype.messageReceiveEventListener = function () {
	if (!this._messageReceiveEventListener) {
		this._messageReceiveEventListener = (evt) => {
			this.receiveMessage(evt.data)
		}
	}
	return this._messageReceiveEventListener
}
UIComponent.prototype.resizeEventListener = function () {
	if (!this._resizeEventListener) {
		this._resizeEventListener = (evt) => {
			this.resizeComponent()
		}
	}
	return this._resizeEventListener
}
UIComponent.prototype.appendTo = function (toNode, addResizeAction) {
	this.initializeComponent()
	toNode.appendChild(this.component())
	if (toNode == document.body || toNode.parentElement == document.body || addResizeAction == true) {
		window.addEventListener('message', this.messageReceiveEventListener())
		window.addEventListener('resize', this.resizeEventListener())
	}
	this.resizeComponent()
}
UIComponent.prototype.appendToTop = function (toNode, addResizeAction) {
	this.initializeComponent()
	toNode.insertBefore(this.component(), toNode.firstChild)
	if (toNode == document.body || toNode.parentElement == document.body || addResizeAction == true) {
		window.addEventListener('message', this.messageReceiveEventListener())
		window.addEventListener('resize', this.resizeEventListener())
	}
	this.resizeComponent()
}
UIComponent.prototype.receiveMessage = function (message) {
	let json = JSON.parse(message);
	if (!json || !json.action) {
		console.error('unknown message', message);
		return;
	}
	let action = json.action,
		method = this.constructor.prototype[action];
	if (!method) {
//		console.error('unknown method', action);
		return;
	}
	method.call(this, json.value);
};

UIComponent.prototype.saveAsPng = function (action, backgroundColor, domElement) {
	if (window.domtoimage) {
		let timestamp = this.timestamp(),
			extension = 'png',
			element = domElement || this.component();
		domtoimage.toPng(element).then(function (pngData) {
			action(pngData, timestamp, extension)
		}).catch(function (error) {
			console.error('error saveAsPng', error, timestamp, extension);
		});
	} else {
		console.error('needs to include script file dom-to-image.js.');
	}
};
UIComponent.prototype.timestamp = function () {
	let date = new Date(),
		timestamp = [
			[
				date.getFullYear(),
				[
					(date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1),
					(date.getDate() < 10 ? '0' : '') + date.getDate()
				].join('')
			].join('-'),
			[
				(date.getHours() < 10 ? '0' : '') + date.getHours(), (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(), (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
			].join('')
		].join('-');
	return timestamp;
};
UIComponent.prototype.enable = function (aBoolean) {};
UIComponent.prototype.isOpen = function () {
	return this.component().parentElement != null
}

UIComponent.prototype.cursorWait = function () {
    this.component().classList.add('cursorWait');
};
UIComponent.prototype.cursorDefault = function () {
    this.component().classList.remove('cursorWait');
};

function LabeledComponent(name, action) {
	UIComponent.call(this);
	this._name = name;
	this._action = action;
	this._nameLabel = null;
}
inherits(LabeledComponent, UIComponent);

LabeledComponent.prototype.name = function (name) {
	if (name != undefined) {
		this._name = name;
	}
	return this._name;
};
LabeledComponent.prototype.action = function (action) {
	if (action != undefined) {
		this._action = action;
	}
	return this._action;
};
LabeledComponent.prototype.createComponent = function () {
	var component = UIComponent.prototype.createComponent.call(this);
	if (this.name()) {
		component.appendChild(this.nameLabel());
	}
	return component;
};
LabeledComponent.prototype.nameLabel = function () {
	if (!this._nameLabel) {
		this._nameLabel = document.createElement('label');
		this._nameLabel.className = 'name';
		this._nameLabel.textContent = this.name();
	}
	return this._nameLabel;
};
LabeledComponent.prototype.size = function (num) {
	this.valueField().size = num;
};

function ValueComponent(name, value) {
	LabeledComponent.call(this, name);
	this._value = value;
	this._valueComponent = null;
}
inherits(ValueComponent, LabeledComponent);
ValueComponent.prototype.createComponent = function () {
	let c = LabeledComponent.prototype.createComponent.call(this);
	c.appendChild(this.valueComponent());
	return c;
};
ValueComponent.prototype.valueComponent = function () {
	if (!this._valueComponent) {
		this._valueComponent = document.createElement('label')
		this._valueComponent.className = 'value'
		if (this.value() !== undefined) {
			this._valueComponent.innerHTML = this.value()
		}
	}
	return this._valueComponent;
};
ValueComponent.prototype.value = function (value) {
	if (value !== undefined) {
		this._value = value
		this.valueComponent().innerHTML = this._value
	}
	return this._value
}

function DialogComponent () {
    UIComponent.call(this);
	this._parentComponentStyle = null;
}
inherits(DialogComponent, UIComponent);
DialogComponent.prototype.createComponent = function () {
    let c = UIComponent.prototype.createComponent.call(this),
        self = this;
    c.addEventListener('mouseup', function (evt) {
        self.removeComponent();
    });
    return c;
};
DialogComponent.prototype.appendTo = function (toComponent) {
	UIComponent.prototype.appendTo.call(this, toComponent);
	this._parentComponentStyle = {
		overflow: toComponent.style.overflow,
		height: toComponent.style.height
	};
	toComponent.style.overflow = 'hidden';
	toComponent.style.height = '100%';
};
DialogComponent.prototype.removeComponent = function () {
	let parentComponent = this.component().parentElement;
	UIComponent.prototype.removeComponent.call(this);
	if (parentComponent && this._parentComponentStyle) {
		parentComponent.style.overflow = this._parentComponentStyle.overflow;
		parentComponent.style.height = this._parentComponentStyle.height;
		this._parentComponentStyle = null;
	}
};
