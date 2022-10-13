function generateTime() {	
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
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

idStruk.innerHTML = zeroPad(localStorage.getItem('id'), 10)



btn_print.addEventListener('click', () => {
	localStorage.setItem('id', parseFloatHTML(idStruk) + 1)
	window.print()
})



