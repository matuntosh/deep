class DatePlayer extends UIComponent {
	constructor(selectDateAction, selectorChangeAtion, showButtons) {
		super()
		this.shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		this.shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

		this._dates = []

		this._showButtons = showButtons != undefined ? showButtons : true

		this._loadingIndex = 0
		this._playing = false
		this._playingBack = false
		this._playTimer = null
		this._playBackTimer = null

		this._previousDateButton = null
		this._dateSelector = null
		this._nextDateButton = null
		this._pauseBackSwitch = null
		this._pauseResumeSwitch = null

		this.selectDateAction = selectDateAction
		this.selectorChangeAction = selectorChangeAtion

		this._dateCollection = null
		this._monthCollection = null
		this._yearCollection = null

		this._nextDateInterval = null
	}
	showButtons(aBoolean) {
		if (aBoolean !== undefined) {
			this._showButtons = aBoolean
		}
		return this._showButtons
	}

	createComponent() {
		var c = super.createComponent()
		c.appendChild(this.previousDateButton().component())
		c.appendChild(this.dateSelector())
		c.appendChild(this.nextDateButton().component())
		c.appendChild(this.pauseBackSwitch().component())
		c.appendChild(this.pauseResumeSwitch().component())
		return c
	}
	previousDateButtonSvgString() {
		return '<svg viewBox="0 0 6.3499999 12.7" height="48" width="24"><path d="M 4.2333255,2.1166666 2.1166588,6.3499999 4.2333255,10.583333" style="fill:none;stroke:#000000;stroke-width:1.32292;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" /></svg>'
	}
	previousDateButton() {
		if (!this._previousDateButton) {
			var b = new ButtonComponent(this.previousDateButtonSvgString(), () => {
				if (b.component().disabled) {
					return
				}
				b.component().disabled = true
				this.previousDate()
			})
			b.component().classList.add('previousDateButton')
			b.visible(this.showButtons())
			this._previousDateButton = b
		}
		return this._previousDateButton
	}
	nextDateButtonSvgString() {
		return '<svg version="1.1" viewBox="0 0 6.3499999 12.7" height="48" width="24"><path d="M 2.1166666,2.1166666 4.2333333,6.3499999 2.1166666,10.583333" style="fill:none;stroke:#000000;stroke-width:1.32291666;stroke-linecap:round;stroke-linejoin:round;stroke-opacity:1;stroke-miterlimit:4;stroke-dasharray:none" /></svg>'
	}
	nextDateButton() {
		if (!this._nextDateButton) {
			var b = new ButtonComponent(this.nextDateButtonSvgString(), () => {
					if (b.component().disabled) {
						return
					}
					b.component().disabled = true
					this.nextDate()
				})
			b.component().classList.add('nextDateButton')
			b.visible(this.showButtons())
			this._nextDateButton = b
		}
		return this._nextDateButton
	}
	dateSelector() {
		if (!this._dateSelector) {
			this._dateSelector = document.createElement('div')
			this._dateSelector.className = 'dateSelector'
			this._dateSelector.appendChild(this.dateCollection())
			this._dateSelector.appendChild(this.monthCollection())
			this._dateSelector.appendChild(this.yearCollection())
		}
		return this._dateSelector
	}
	dateCollectionVisible(aBoolean) {
		this.dateCollection().style.display = aBoolean ? 'inline-block' : 'none'
	}
	dateCollection() {
		if (!this._dateCollection) {
			this._dateCollection = document.createElement('select')
			this._dateCollection.className = 'date'
			this._dateCollection.addEventListener('change', (evt) => {
				if (this.selectedIndex < 0) {
					return
				}
				this.changedSelection()
			})
		}
		return this._dateCollection
	}
	monthCollection() {
		if (!this._monthCollection) {
			this._monthCollection = document.createElement('select')
			this._monthCollection.className = 'month'
			this._monthCollection.addEventListener('change', (evt) => {
				if (this.selectedIndex < 0) {
					return
				}
				this.changedSelection()
			})
		}
		return this._monthCollection
	}
	yearCollection() {
		if (!this._yearCollection) {
			this._yearCollection = document.createElement('select')
			this._yearCollection.className = 'year'
			this._yearCollection.addEventListener('change', (evt) => {
				if (this.selectedIndex < 0) {
					return
				}
				this.changedSelection()
			})
		}
		return this._yearCollection
	}
	toDateString(aDate) {
		var year = aDate.getFullYear(),
			month = aDate.getMonth(),
			date = aDate.getDate() < 10 ? '0' + aDate.getDate() : aDate.getDate(),
			day = aDate.getDay(),
			shortMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			shortDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			str = [shortDay[day], date, shortMonth[month], year].join(' ')
		return str
	}
	updateDateSelector() {
		this.clearComponent(this.dateCollection())
		this.clearComponent(this.monthCollection())
		this.clearComponent(this.yearCollection())
		if (!this.dates()) {
			return
		}
		var yearCollection = this.yearCollection(),
			year = null
		this.dates().forEach((aDate, index) => {
			let y = aDate.getFullYear()
			if (year === null || year != y) {
				year = y
				var option = document.createElement('option')
				option.className = 'date'
				option.value = year
				option.innerHTML = year
				yearCollection.appendChild(option)
			}
		})
	}
	updateSelection(selectedDate) {
		if (!this.dates() || !this.date()) {
			return
		}
		if (this.loadingIndex() < 0 && selectedDate == undefined) {
			return
		}
		this.clearComponent(this.monthCollection())
		this.clearComponent(this.dateCollection())
		var dateCollection = this.dateCollection(),
			monthCollection = this.monthCollection(),
			yearCollection = this.yearCollection(),
			aDate = selectedDate ? selectedDate : this.dates()[this.loadingIndex()],
			year = aDate.getFullYear(),
			month = aDate.getMonth(),
			date = aDate.getDate(),
			pm = null
		this.dates().forEach((aDate, index) => {
			let y = aDate.getFullYear(),
				m = aDate.getMonth(),
				d = aDate.getDate(),
				w = aDate.getDay();
			if (y != year) {
				return
			}
			if (pm != m) {
				pm = m;
				var option = document.createElement('option')
				option.className = 'date'
				option.value = m
				option.innerHTML = this.shortMonths[m]
				monthCollection.appendChild(option)
			}
			if (m != month) {
				return
			}
			var option = document.createElement('option')
			option.className = 'date'
			option.value = d
			option.innerHTML = this.shortDays[w] + ' ' + (d < 10 ? '0' + d : d)
			dateCollection.appendChild(option)
		})

		for (var i = 0; i < yearCollection.childNodes.length; i += 1) {
			let yearOption = yearCollection.childNodes.item(i)
			if (yearOption.value == year) {
				yearCollection.selectedIndex = i
				break
			}
		}
		for (var i = 0; i < monthCollection.childNodes.length; i += 1) {
			let monthOption = monthCollection.childNodes.item(i)
			if (monthOption.value == month) {
				monthCollection.selectedIndex = i
				break
			}
		}
		for (var i = 0; i < dateCollection.childNodes.length; i += 1) {
			let dateOption = dateCollection.childNodes.item(i);
			if (dateOption.value == date) {
				dateCollection.selectedIndex = i
				break
			}
		}
	}
	pauseResumeSwitchImageSvgString(className) {
		if (className) {
			return '<svg width="24" height="48" viewBox="0 0 6.3499999 12.7"><path class="' + className + '" d="M 1.5875,2.1166667 5.8208333,6.35 1.5875,10.583333 Z" /></svg>'
		}
		return '<svg width="24" height="48" viewBox="0 0 6.3499999 12.7"><path d="M 1.5875,2.1166667 5.8208333,6.35 1.5875,10.583333 Z" /></svg>'
	}
	pauseResumeSwitch() {
		if (!this._pauseResumeSwitch) {
			var s = new SwitchComponent('', this.playing(), (s) => {
				this.pauseResume(s.on())
			}, {
				on: this.pauseResumeSwitchImageSvgString("on"),
				off: this.pauseResumeSwitchImageSvgString()
			})
			s.component().classList.add('go')
			this._pauseResumeSwitch = s
			s.visible(this.showButtons())
		}
		return this._pauseResumeSwitch
	}
	pauseBackSwitchImageSvgString(className) {
		if (className) {
			return '<svg width="24" height="48" viewBox="0 0 6.3499999 12.7"><path class="' + className + '" d="M 5.2916666,2.1166667 1.0583333,6.35 5.2916666,10.583333 Z" /></svg>'
		}
		return '<svg width="24" height="48" viewBox="0 0 6.3499999 12.7"><path d="M 5.2916666,2.1166667 1.0583333,6.35 5.2916666,10.583333 Z" /></svg>'
	}
	pauseBackSwitch() {
		if (!this._pauseBackSwitch) {
			this._pauseBackSwitch = new SwitchComponent('', this.playingBack(), (s) => {
				this.pauseResumeBack(s.on())
			}, {
				on: this.pauseBackSwitchImageSvgString("on"),
				off: this.pauseBackSwitchImageSvgString()
			})
			this._pauseBackSwitch.component().classList.add('back')
			this._pauseBackSwitch.visible(this.showButtons())
		}
		return this._pauseBackSwitch
	}

	dates(dates) {
		if (dates != undefined) {
			this._dates = dates.sort((d1, d2) => {
				return d1.getTime() - d2.getTime()
			})
			this.updateDateSelector()
			this.selectDate(0)
		}
		return this._dates
	}
	loadingIndex(index) {
		if (index != undefined) {
			this._loadingIndex = index
		}
		return this._loadingIndex
	}
	date() {
		return this.dates()[this.loadingIndex()]
	}
	stringOfDate() {
		let date = this.date(),
			year = date.getFullYear(),
			month = date.getMonth() + 1,
			aDate = date.getDate()
		return [year, month < 10 ? '0' + month : month, aDate < 10 ? '0' + aDate : aDate].join('-')
	}
	didLoad() {
		if (this.playing()) {
			this.doNext()
		} else if (this.playingBack()) {
			this.doPrevious()
		}
		this.updateComponent()
	}
	playing(val) {
		if (val != undefined) {
			this._playing = val
		}
		return this._playing
	}
	playingBack(val) {
		if (val !== undefined) {
			this._playingBack = val
		}
		return this._playingBack
	}
	doNext() {
		if (this.playing()) {
			if (this._playTimer) {
				clearTimeout(this._playTimer)
				this._playTimer = null
			}
			if (this.nextDateInterval() == 0) {
				this.nextDate()
			} else {
				this._playTimer = setTimeout(() => {
					this.nextDate()
				}, this.nextDateInterval())
			}
		}
	}
	nextDateInterval(ms) {
		if (ms !== undefined) {
			this._nextDateInterval = ms
		}
		if (this._nextDateInterval == undefined) {
			this._nextDateInterval = 0
		}
		return this._nextDateInterval
	}
	doPrevious() {
		if (this.playingBack()) {
			if (this._playBackTimer) {
				clearTimeout(this._playBackTimer)
				this._playBackTimer = null
			}
			if (this.nextDateInterval() == 0) {
				this.previousDate()
			} else {
				this._playBackTimer = setTimeout(() => {
					this.previousDate()
				}, this.nextDateInterval())
			}
		}
	}
	nextDate() {
		var newIndex = this.loadingIndex() + 1
		if (newIndex >= this.dates().length) {
			this.pause()
			return
		}
		if (this.loadingIndex() == newIndex) {
			return
		}
		this.selectDate(newIndex)
	}
	previousDate() {
		var newIndex = this.loadingIndex() - 1
		if (newIndex < 0) {
			this.pauseBack()
			return
		}
		if (this.loadingIndex() == newIndex) {
			return
		}
		this.selectDate(newIndex)
	}
	selectDate(indexOrDate, sender) {
		var index = indexOrDate
		if (indexOrDate instanceof Date) {
			var i = 0,
				date = null
			for (i = 0; i < this.dates().length; i += 1) {
				date = this.dates()[i]
				if (indexOrDate.getTime() == date.getTime()) {
					index = i
					break
				}
			}
		}
		if (index < 0) {
			return null
		}
		return this.selectDateAtIndex(index, sender)
	}
	selectDateAtIndex(index, sender) {
		this.loadingIndex(index)
		this.updateSelection()
		var date = this.dates()[index]
		if (this.selectDateAction && sender === undefined) {
			this.selectDateAction(date, index)
		} else {
			this.didLoad()
		}
		return date
	}
	changedSelection() {
		if (this.selectorChangeAction) {
			this.selectorChangeAction(this)
		}
		let year = parseInt(this.yearCollection().childNodes.item(this.yearCollection().selectedIndex).value),
			month = parseInt(this.monthCollection().childNodes.item(this.monthCollection().selectedIndex).value),
			date = parseInt(this.dateCollection().childNodes.item(this.dateCollection().selectedIndex).value),
			selectedTime = Date.UTC(year, month, date, 0, 0, 0, 0),
			selectedDate = new Date(selectedTime)
		var i = 0,
			selectionIndex = -1,
			aDate = null,
			time = null
		for (i = 0; i < this.dates().length; i += 1) {
			aDate = this.dates()[i]
			time = aDate.getTime()
			if (selectedTime >= time) {
				selectionIndex = i
				if (selectedTime === time) {
					break
				}
			} else {
				if (selectedDate.getFullYear() == aDate.getFullYear() && selectedDate.getMonth() == aDate.getMonth()) {
					selectionIndex = i
				}
				break
			}
		}
		if (selectionIndex >= 0) {
			this.selectDateAtIndex(selectionIndex)
		} else {
			this.updateSelection(selectedDate)
		}
	}

	pauseResume(resume) {
		if (resume) {
			this.resume()
		} else {
			this.pause()
		}
		this.pauseBack()
	}
	resume() {
		this.playing(true)
		this.nextDateButton().component().disabled = true
		this.previousDateButton().component().disabled = true
		this.dateSelector().disabled = true
		this.doNext()
	}
	pause() {
		this.playing(false)
		this.updateComponent()
	}
	pauseResumeBack(resume) {
		if (resume) {
			this.resumeBack()
		} else {
			this.pauseBack()
		}
		this.pause()
	}
	resumeBack() {
		this.playingBack(true)
		this.nextDateButton().component().disabled = true
		this.previousDateButton().component().disabled = true
		this.dateSelector().disabled = true
		this.doPrevious()
	}
	pauseBack() {
		this.playingBack(false)
		this.updateComponent()
	}
	updateComponent() {
		if (!this.dates() || this.loadingIndex() < this.dates().length - 1) {
			this.nextDateButton().component().disabled = false
		}
		if (this.loadingIndex() > 0) {
			this.previousDateButton().component().disabled = false
		}
		this.dateSelector().disabled = false
		this.pauseResumeSwitch().on(this.playing(), this)
		this.pauseResumeSwitch().switch().disabled = !this.dates() || this.loadingIndex() == this.dates().length - 1
		this.pauseBackSwitch().on(this.playingBack(), this)
		this.pauseBackSwitch().switch().disabled = !this.dates() || this.loadingIndex() == 0
	}

	indexOfDate(date) {
		var index = -1,
			i = null,
			d = null,
			time = date.getTime()
		for (i = 0; i < this.dates().length; i += 1) {
			d = this.dates()[i]
			if (d.getTime() == time) {
				index = i
				break
			}
		}
		return index
	}
	daysFromTo(fromDate, toDate, action) {
		var fromIndex = this.indexOfDate(fromDate),
			toIndex = this.indexOfDate(toDate)
		if (fromIndex < 0 || toIndex < 0) {
			return
		}
		var index = 0
		for (index = fromIndex; index <= toIndex; index += 1) {
			action(this.dates()[index], index)
		}
	}
}
