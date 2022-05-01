'use strict'
const list = document.getElementById('list')
const groceries = []
const submitBtn = document.getElementById('submit')
const input = document.getElementById('input')
const generateID = () => {
	const CHARS = '0123456789abcde'
	let str = ''
	const ID_LENGTH = 12
	for (let i=0; i < ID_LENGTH;i++){
		str += CHARS[Math.floor(Math.random() * CHARS.length)]
	}
	return str
}
let count = 1
submitBtn.addEventListener('click', event => {
	event.preventDefault();
	if (checkVaildInput(input)) {
		groceries.push({
			"id": generateID(),
			"value": input.value,
			"isChecked": false,
			"addedAt": addedTimes()
		})
		list.innerHTML += generateGroceries(input.value, count, addedTimes())
		input.value = ''
		const jsonObj = JSON.stringify(groceries);
		localStorage.setItem('list', jsonObj)
	}
	count ++
	disableGrocery(list.children)
	// console.log(groceries)
})

const generateGroceries = (input, count, added) => {
	return `
		<li>
			<div>
	         <p class="dishs">${count}. ${input}</p>
          	<span class="added-times">added at ${added}</span>
			</div>
          <button class="transparent_btn delete full_center">
            <i class="gg-check"></i>
          </button>
        </li>
	`
}
const checkVaildInput = (input) => {
	if (input.value == '') {
		return false
	}
	return true
}
window.addEventListener('load', () => {
	if (localStorage.getItem("list") === null) {
		list.innerHTML = ''
	} else {
		const listGrocery = getData()
		for (let i=0;i<listGrocery.length;i++){
			list.innerHTML += generateGroceries(listGrocery[i].value, i+1, listGrocery[i].addedAt)
		}
		count = JSON.parse(localStorage.list).length + 1
	}
	// console.dir(list.children)
	// console.log(groceries)
	disableGrocery(list.children)

})
const clearStorage = () => {
	localStorage.clear()
	list.innerHTML = ''
	count = 1
	groceries.length = 0
}
const getData = () => {
	const arr = JSON.parse(localStorage.list)
	for (let i=0;i<arr.length;i++){
		groceries.push(arr[i])
	}
	return groceries
}
const disableGrocery = lists => {
	for (let i=0;i<lists.length;i++){
		const btnChild = lists[i].children[1]
		btnChild.addEventListener('click', () => {
			btnChild.firstElementChild.classList.add('has-bought')
			btnChild.parentElement.classList.add('disabledElement')
			btnChild.setAttribute('disabled', true)
			const state = JSON.parse(localStorage.list)[i]
			state['isChecked'] = true
			localStorage.list = localStorage.list.replace(`${JSON.stringify(JSON.parse(localStorage.list)[i])}`,
				`${JSON.stringify(state)}`)
		})
		if (JSON.parse(localStorage.list)[i].isChecked) {
			lists[i].classList.add('disabledElement')
			lists[i].children[1].children[0].classList.add('disabledAnimate')
		}
	}
}

const addedTimes = () => {
	const today = new Date();
	const formatDays = today.getDate() + "/" + today.getMonth()
	const suffix = today.getHours() >= 12 ? "PM":"AM";
	const formatHours = ((today.getHours() + 11) % 12 + 1)
	+ ":" + today.getMinutes()
	+ " " + suffix
	return formatDays + " " + formatHours
}