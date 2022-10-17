function generateTime() {	
	var today = new Date();
	var date = today.getDate() + '/'+(today.getMonth()+1) + '-' + today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes();
	var dateTime = date+' | '+time;
	return dateTime
}

const dateTime = document.getElementById('dateTime')

dateTime.innerHTML = generateTime()

const btn_print = document.getElementById('btn-print')

function parseFloatHTML(element) {
	return parseFloat(element.innerHTML.replace(/[^\d\.\-]+/g, '')) || 0;
}


const idStruk = document.querySelector('.idStruk')
const zeroPad = (num, places) => String(num).padStart(places, '0')


if(localStorage.getItem('id') == null) {
	idStruk.innerHTML = zeroPad(1, 10)
} else {
	idStruk.innerHTML = zeroPad(localStorage.getItem('id'), 10)
}


btn_print.addEventListener('click', () => {
	localStorage.setItem('id', parseFloatHTML(idStruk) + 1)
})



