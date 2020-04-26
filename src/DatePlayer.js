function DatePlayer (selectDateAction, selectorChangeAtion, showButtons) {
	UIComponent.call(this);
    this._dates = [];

	this._showButtons = showButtons != undefined ? showButtons : true;

	this._loadingIndex = 0;
	this._playing = false;
    this._playingBack = false;
    this._playTimer = null;
    this._playBackTimer = null;

	this._previousDateButton = null;
	this._dateSelector = null;
	this._nextDateButton = null;
    this._pauseBackSwitch = null;
	this._pauseResumeSwitch = null;

	this.selectDateAction = selectDateAction;
    this.selectorChangeAction = selectorChangeAtion;

    this._dateCollection = null;
    this._monthCollection = null;
    this._yearCollection = null;

    this._nextDateInterval = null;
}
inherits(DatePlayer, UIComponent);

DatePlayer.prototype.showButtons = function (aBoolean) {
	if (aBoolean !== undefined) {
		this._showButtons = aBoolean;
	}
	return this._showButtons;
};

DatePlayer.prototype.createComponent = function () {
	var c = UIComponent.prototype.createComponent.call(this);
	c.appendChild(this.previousDateButton().component());
	c.appendChild(this.dateSelector());
	c.appendChild(this.nextDateButton().component());
    c.appendChild(this.pauseBackSwitch().component());
	c.appendChild(this.pauseResumeSwitch().component());
	return c;
};
DatePlayer.prototype.previousDateButtonSvgString = function () {
	return '<svg viewBox="0 0 6.3499999 12.7" height="48" width="24"><path d="M 4.2333255,2.1166666 2.1166588,6.3499999 4.2333255,10.583333" style="fill:none;stroke:#000000;stroke-width:1.32292;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" /></svg>'
}
DatePlayer.prototype.previousDateButton = function () {
	if (!this._previousDateButton) {
		var self = this,
			b = new ButtonComponent(this.previousDateButtonSvgString(), function () {
				if (b.component().disabled) {
					return;
				}
				b.component().disabled = true;
				self.previousDate();
		});
		b.component().classList.add('previousDateButton');
		b.visible(this.showButtons());
		this._previousDateButton = b;
	}
	return this._previousDateButton;
};
DatePlayer.prototype.nextDateButtonSvgString = function () {
	return '<svg version="1.1" viewBox="0 0 6.3499999 12.7" height="48" width="24"><path d="M 2.1166666,2.1166666 4.2333333,6.3499999 2.1166666,10.583333" style="fill:none;stroke:#000000;stroke-width:1.32291666;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:1;stroke-miterlimit:4;stroke-dasharray:none" /></svg>'
}
DatePlayer.prototype.nextDateButton = function () {
	if (!this._nextDateButton) {
		var self = this,
			b = new ButtonComponent(this.nextDateButtonSvgString(), function () {
				if (b.component().disabled) {
					return;
				}
				b.component().disabled = true;
				self.nextDate();
			});
		b.component().classList.add('nextDateButton');
		b.visible(this.showButtons());
		this._nextDateButton = b;
	}
	return this._nextDateButton;
};
DatePlayer.prototype.dateSelector = function () {
	if (!this._dateSelector) {
		var self = this;
		this._dateSelector = document.createElement('div');
		this._dateSelector.className = 'dateSelector';
        this._dateSelector.appendChild(this.dateCollection());
        this._dateSelector.appendChild(this.monthCollection());
        this._dateSelector.appendChild(this.yearCollection());
	}
	return this._dateSelector;
};
DatePlayer.prototype.dateCollectionVisible = function (aBoolean) {
    this.dateCollection().style.display = aBoolean ? 'inline-block' : 'none';
};
DatePlayer.prototype.dateCollection = function () {
    if (!this._dateCollection) {
        let self = this;
        this._dateCollection = document.createElement('select');
        this._dateCollection.className = 'date';
        this._dateCollection.addEventListener('change', function (evt) {
            if (this.selectedIndex < 0) {
                return;
            }
            self.changedSelection();
        });
    }
    return this._dateCollection;
};
DatePlayer.prototype.monthCollection = function () {
    if (!this._monthCollection) {
        let self = this;
        this._monthCollection = document.createElement('select');
        this._monthCollection.className = 'month';
        this._monthCollection.addEventListener('change', function (evt) {
            if (this.selectedIndex < 0) {
                return;
            }
            self.changedSelection();
        });
    }
    return this._monthCollection;
};
DatePlayer.prototype.yearCollection = function () {
    if (!this._yearCollection) {
        let self = this;
        this._yearCollection = document.createElement('select');
        this._yearCollection.className = 'year';
        this._yearCollection.addEventListener('change', function (evt) {
            if (this.selectedIndex < 0) {
                return;
            }
            self.changedSelection();
        });
    }
    return this._yearCollection;
};
DatePlayer.prototype.toDateString = function (aDate) {
	var year = aDate.getFullYear(),
		month = aDate.getMonth(),
		date = aDate.getDate() < 10 ? '0' + aDate.getDate() : aDate.getDate(),
		day = aDate.getDay(),
		shortMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		shortDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		str = [shortDay[day], date, shortMonth[month], year].join(' ');
	return str;
};
DatePlayer.prototype.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
DatePlayer.prototype.shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
DatePlayer.prototype.updateDateSelector = function () {
	this.clearComponent(this.dateCollection());
    this.clearComponent(this.monthCollection());
    this.clearComponent(this.yearCollection());
	if (!this.dates()) {
		return;
	}
	var yearCollection = this.yearCollection(),
		self = this,
        year = null;
	this.dates().forEach(function (aDate, index) {
        let y = aDate.getFullYear();
        if (year === null || year != y) {
            year = y;
            var option = document.createElement('option');
            option.className = 'date';
            option.value = year;
            option.innerHTML = year;
            yearCollection.appendChild(option);
        }
	});
};
DatePlayer.prototype.updateSelection = function (selectedDate) {
	if (!this.dates() || !this.date()) {
		return;
	}
    if (this.loadingIndex() < 0 && selectedDate == undefined) {
        return;
    }
    this.clearComponent(this.monthCollection());
	this.clearComponent(this.dateCollection());
	var dateCollection = this.dateCollection(),
        monthCollection = this.monthCollection(),
        yearCollection = this.yearCollection(),
        aDate = selectedDate ? selectedDate : this.dates()[this.loadingIndex()],
		self = this,
        year = aDate.getFullYear(),
        month = aDate.getMonth(),
        date = aDate.getDate(),
        pm = null;
	this.dates().forEach(function (aDate, index) {
        let y = aDate.getFullYear(),
            m = aDate.getMonth(),
            d = aDate.getDate(),
            w = aDate.getDay();
        if (y != year) {
            return;
        }
        if (pm != m) {
            pm = m;
            var option = document.createElement('option');
            option.className = 'date';
            option.value = m;
            option.innerHTML = self.shortMonths[m];
            monthCollection.appendChild(option);
        }
        if (m != month) {
            return;
        }
        var option = document.createElement('option');
        option.className = 'date';
        option.value = d;
        option.innerHTML = self.shortDays[w] + ' ' + (d < 10 ? '0' + d : d);
        dateCollection.appendChild(option);
	});

    for (var i = 0; i < yearCollection.childNodes.length; i += 1) {
        let yearOption = yearCollection.childNodes.item(i);
        if (yearOption.value == year) {
            yearCollection.selectedIndex = i;
            break;
        }
    }
    for (var i = 0; i < monthCollection.childNodes.length; i += 1) {
        let monthOption = monthCollection.childNodes.item(i);
        if (monthOption.value == month) {
            monthCollection.selectedIndex = i;
            break;
        }
    }
    for (var i = 0; i < dateCollection.childNodes.length; i += 1) {
        let dateOption = dateCollection.childNodes.item(i);
        if (dateOption.value == date) {
            dateCollection.selectedIndex = i;
            break;
        }
    }
};
DatePlayer.prototype.pauseResumeSwitchImageSvgString = function (className) {
	if (className) {
		return '<svg width="24" height="48" viewBox="0 0 6.3499999 12.7"><path class="' + className + '" d="M 1.5875,2.1166667 5.8208333,6.35 1.5875,10.583333 Z" /></svg>'
	}
	return '<svg width="24" height="48" viewBox="0 0 6.3499999 12.7"><path d="M 1.5875,2.1166667 5.8208333,6.35 1.5875,10.583333 Z" /></svg>'
}
DatePlayer.prototype.pauseResumeSwitch = function () {
	if (!this._pauseResumeSwitch) {
		var self = this,
		s = new SwitchComponent('', this.playing(), function (s) {
			self.pauseResume(s.on());
		}, {
            on: this.pauseResumeSwitchImageSvgString("on"),
            off: this.pauseResumeSwitchImageSvgString()
        });
        s.component().classList.add('go');
		this._pauseResumeSwitch = s
		s.visible(this.showButtons());
	}
	return this._pauseResumeSwitch;
};
DatePlayer.prototype.pauseBackSwitchImageSvgString = function (className) {
	if (className) {
		return '<svg width="24" height="48" viewBox="0 0 6.3499999 12.7"><path class="' + className + '" d="M 5.2916666,2.1166667 1.0583333,6.35 5.2916666,10.583333 Z" /></svg>'
	}
	return '<svg width="24" height="48" viewBox="0 0 6.3499999 12.7"><path d="M 5.2916666,2.1166667 1.0583333,6.35 5.2916666,10.583333 Z" /></svg>'
}
DatePlayer.prototype.pauseBackSwitch = function () {
    if (!this._pauseBackSwitch) {
        let self = this;
        this._pauseBackSwitch = new SwitchComponent('', this.playingBack(), function (s) {
            self.pauseResumeBack(s.on());
        }, {
            on: this.pauseBackSwitchImageSvgString("on"),
            off: this.pauseBackSwitchImageSvgString()
        });
        this._pauseBackSwitch.component().classList.add('back');
		this._pauseBackSwitch.visible(this.showButtons());
    }
    return this._pauseBackSwitch;
};

DatePlayer.prototype.dates = function (dates) {
	if (dates != undefined) {
		this._dates = dates.sort(function (d1, d2) {
            return d1.getTime() - d2.getTime();
        });
		this.updateDateSelector();
		this.selectDate(0);
	}
	return this._dates;
};
DatePlayer.prototype.loadingIndex = function (index) {
	if (index != undefined) {
		this._loadingIndex = index;
	}
	return this._loadingIndex;
};
DatePlayer.prototype.date = function () {
	return this.dates()[this.loadingIndex()];
};
DatePlayer.prototype.stringOfDate = function () {
    let date = this.date(),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        aDate = date.getDate();
    return [year, month < 10 ? '0' + month : month, aDate < 10 ? '0' + aDate : aDate].join('-');
};
DatePlayer.prototype.didLoad = function () {
    if (this.playing()) {
        this.doNext();
    } else if (this.playingBack()) {
        this.doPrevious();
    }
    this.updateComponent();
};
DatePlayer.prototype.playing = function (val) {
	if (val != undefined) {
		this._playing = val;
	}
	return this._playing;
};
DatePlayer.prototype.playingBack = function (val) {
    if (val !== undefined) {
        this._playingBack = val;
    }
    return this._playingBack;
};
DatePlayer.prototype.doNext = function () {
	if (this.playing()) {
		var self = this;
        if (this._playTimer) {
            clearTimeout(this._playTimer);
            this._playTimer = null;
        }
		if (this.nextDateInterval() == 0) {
			self.nextDate();
		} else {
			this._playTimer = setTimeout(function () {
				self.nextDate();
			}, this.nextDateInterval());
		}
	}
};
DatePlayer.prototype.nextDateInterval = function (ms) {
    if (ms !== undefined) {
        this._nextDateInterval = ms;
    }
    if (this._nextDateInterval == undefined) {
        this._nextDateInterval = 0;
    }
    return this._nextDateInterval;
};
DatePlayer.prototype.doPrevious = function () {
    if (this.playingBack()) {
        let self = this;
        if (this._playBackTimer) {
            clearTimeout(this._playBackTimer);
            this._playBackTimer = null;
        }
		if (this.nextDateInterval() == 0) {
			self.previousDate();
		} else {
			this._playBackTimer = setTimeout(function () {
				self.previousDate();
			}, this.nextDateInterval());
		}
    }
};
DatePlayer.prototype.nextDate = function () {
	var newIndex = this.loadingIndex() + 1;
    if (newIndex >= this.dates().length) {
        this.pause();
        return;
    }
	if (this.loadingIndex() == newIndex) {
		return;
	}
	this.selectDate(newIndex);
};
DatePlayer.prototype.previousDate = function () {
	var newIndex = this.loadingIndex() - 1;
    if (newIndex < 0) {
        this.pauseBack();
        return;
    }
	if (this.loadingIndex() == newIndex) {
		return;
	}
	this.selectDate(newIndex);
};
DatePlayer.prototype.selectDate = function (indexOrDate, sender) {
	var index = indexOrDate;
	if (indexOrDate instanceof Date) {
		var i = 0,
			date = null;
		for (i = 0; i < this.dates().length; i += 1) {
			date = this.dates()[i];
			if (indexOrDate.getTime() == date.getTime()) {
				index = i;
				break;
			}
		}
	}
	if (index < 0) {
		return null;
	}
	return this.selectDateAtIndex(index, sender);
};
DatePlayer.prototype.selectDateAtIndex = function (index, sender) {
	this.loadingIndex(index);
	this.updateSelection();
	var date = this.dates()[index];
	if (this.selectDateAction && sender === undefined) {
		this.selectDateAction(date, index);
	} else {
        this.didLoad();
    }
	return date;
};
DatePlayer.prototype.changedSelection = function () {
    if (this.selectorChangeAction) {
        this.selectorChangeAction(this);
    }
    let year = parseInt(this.yearCollection().childNodes.item(this.yearCollection().selectedIndex).value),
        month = parseInt(this.monthCollection().childNodes.item(this.monthCollection().selectedIndex).value),
        date = parseInt(this.dateCollection().childNodes.item(this.dateCollection().selectedIndex).value),
		selectedTime = Date.UTC(year, month, date, 0, 0, 0, 0),
		selectedDate = new Date(selectedTime);
	var i = 0,
        selectionIndex = -1,
        aDate = null,
		time = null;
    for (i = 0; i < this.dates().length; i += 1) {
        aDate = this.dates()[i];
		time = aDate.getTime();
        if (selectedTime >= time) {
            selectionIndex = i;
            if (selectedTime === time) {
                break;
            }
        } else {
			if (selectedDate.getFullYear() == aDate.getFullYear() && selectedDate.getMonth() == aDate.getMonth()) {
				selectionIndex = i;
			}
			break;
		}
    }
    if (selectionIndex >= 0) {
        this.selectDateAtIndex(selectionIndex);
    } else {
        this.updateSelection(selectedDate);
    }
};

DatePlayer.prototype.pauseResume = function (resume) {
	if (resume) {
		this.resume();
	} else {
		this.pause();
	}
    this.pauseBack();
};
DatePlayer.prototype.resume = function () {
	this.playing(true);
    this.nextDateButton().component().disabled = true;
    this.previousDateButton().component().disabled = true;
    this.dateSelector().disabled = true;
	this.doNext();
};
DatePlayer.prototype.pause = function () {
	this.playing(false);
    this.updateComponent();
};
DatePlayer.prototype.pauseResumeBack = function (resume) {
    if (resume) {
        this.resumeBack();
    } else {
        this.pauseBack();
    }
    this.pause();
};
DatePlayer.prototype.resumeBack = function () {
    this.playingBack(true);
    this.nextDateButton().component().disabled = true;
    this.previousDateButton().component().disabled = true;
    this.dateSelector().disabled = true;
    this.doPrevious();
};
DatePlayer.prototype.pauseBack = function () {
    this.playingBack(false);
    this.updateComponent();
};
DatePlayer.prototype.updateComponent = function () {
    if (!this.dates() || this.loadingIndex() < this.dates().length - 1) {
        this.nextDateButton().component().disabled = false;
    }
    if (this.loadingIndex() > 0) {
        this.previousDateButton().component().disabled = false;
    }
    this.dateSelector().disabled = false;
	this.pauseResumeSwitch().on(this.playing(), this);
    this.pauseResumeSwitch().switch().disabled = !this.dates() || this.loadingIndex() == this.dates().length - 1;
    this.pauseBackSwitch().on(this.playingBack(), this);
    this.pauseBackSwitch().switch().disabled = !this.dates() || this.loadingIndex() == 0;
};

DatePlayer.prototype.indexOfDate = function (date) {
    var index = -1,
        i = null,
        d = null,
        time = date.getTime();
    for (i = 0; i < this.dates().length; i += 1) {
        d = this.dates()[i];
        if (d.getTime() == time) {
            index = i;
            break;
        }
    }
    return index;
};
DatePlayer.prototype.daysFromTo = function (fromDate, toDate, action) {
    var fromIndex = this.indexOfDate(fromDate),
        toIndex = this.indexOfDate(toDate);
    if (fromIndex < 0 || toIndex < 0) {
        return;
    }
    var index = 0;
    for (index = fromIndex; index <= toIndex; index += 1) {
        action(this.dates()[index], index);
    }
};
