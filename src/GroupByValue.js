class GroupByValue {
	constructor(groupBy) {
		this.groupBy = groupBy
		this.dataByValue = {}
	}
	add(data) {
		let value = this.groupBy(data),
			groupOfValue = this.dataByValue[value]
		if (!groupOfValue) {
			groupOfValue = []
			this.dataByValue[value] = groupOfValue
		}
		groupOfValue.push(data)
	}
	addAll(dataArray) {
		dataArray.forEach(data => this.add(data))
		return this
	}
	values() {
		return Object.keys(this.dataByValue)
	}
	groups() {
		return Object.values(this.dataByValue)
	}
	forEach(action) {
		this.values().forEach((value) => {
			action(value, this.dataByValue[value])
		})
	}
	sort(sorter) {
		this.forEach((value, dataArray) => {
			dataArray.sort(sorter)
		})
	}
}
