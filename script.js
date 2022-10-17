/* Shivving (IE8 is not supported, but at least it won't look as awful)
/* ========================================================================== */

(function (document) {
	var
	head = document.head = document.getElementsByTagName('head')[0] || document.documentElement,
	elements = 'article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output picture progress section summary time video x'.split(' '),
	elementsLength = elements.length,
	elementsIndex = 0,
	element;

	while (elementsIndex < elementsLength) {
		element = document.createElement(elements[++elementsIndex]);
	}

	element.innerHTML = 'x<style>' +
		'article,aside,details,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +
		'audio[controls],canvas,video{display:inline-block}' +
		'[hidden],audio{display:none}' +
		'mark{background:#FF0;color:#000}' +
	'</style>';

	return head.insertBefore(element.lastChild, head.firstChild);
})(document);

/* Prototyping
/* ========================================================================== */

(function (window, ElementPrototype, ArrayPrototype, polyfill) {
	function NodeList() { [polyfill] }
	NodeList.prototype.length = ArrayPrototype.length;

	ElementPrototype.matchesSelector = ElementPrototype.matchesSelector ||
	ElementPrototype.mozMatchesSelector ||
	ElementPrototype.msMatchesSelector ||
	ElementPrototype.oMatchesSelector ||
	ElementPrototype.webkitMatchesSelector ||
	function matchesSelector(selector) {
		return ArrayPrototype.indexOf.call(this.parentNode.querySelectorAll(selector), this) > -1;
	};

	ElementPrototype.ancestorQuerySelectorAll = ElementPrototype.ancestorQuerySelectorAll ||
	ElementPrototype.mozAncestorQuerySelectorAll ||
	ElementPrototype.msAncestorQuerySelectorAll ||
	ElementPrototype.oAncestorQuerySelectorAll ||
	ElementPrototype.webkitAncestorQuerySelectorAll ||
	function ancestorQuerySelectorAll(selector) {
		for (var cite = this, newNodeList = new NodeList; cite = cite.parentElement;) {
			if (cite.matchesSelector(selector)) ArrayPrototype.push.call(newNodeList, cite);
		}

		return newNodeList;
	};

	ElementPrototype.ancestorQuerySelector = ElementPrototype.ancestorQuerySelector ||
	ElementPrototype.mozAncestorQuerySelector ||
	ElementPrototype.msAncestorQuerySelector ||
	ElementPrototype.oAncestorQuerySelector ||
	ElementPrototype.webkitAncestorQuerySelector ||
	function ancestorQuerySelector(selector) {
		return this.ancestorQuerySelectorAll(selector)[0] || null;
	};
})(this, Element.prototype, Array.prototype);

/* Helper Functions
/* ========================================================================== */



function generateTableRow() {
	var emptyColumn = document.createElement('tr');
	
	emptyColumn.innerHTML = `
						<td><a class="cut fs-6">-</a>
								<select class="pilihBarang text-start fw-bold" onclick="updateInvoice()">
									<option value="11" selected>--Pilih Barang--</option>
									<option value="1">Plat TOKO (254 x 394)</option>
									<option value="2">Plat GTO (400 x 510)</option>
									<option value="3">Plat SM 52 (459 x 574)</option>
									<option value="4">Plat Oliver 58 (508 x 570)</option>
									<option value="5">Plat MO (550 x 650)</option>
									<option value="6">Plat Komori (560 x 670)</option>
									<option value="7">Plat Oliver 72 (605 x 724)</option>
									<option value="8">Plat SM 72 (615 x 724)</option>
									<option value="9">Film pos-neg (A4)</option>
									<option value="10">Film pos-net (/cm)</option>
								</select>
							
							<span contenteditable spellcheck="false" style="display: none;">Front End Consultation</span></td>
						<td style="display: none;"><span contenteditable spellcheck="false">Experience Review</span></td>
						<td><span  class="fw-bold"> </span><span class="harga fw-bold" contenteditable="" spellcheck="false"  >0</span></td>
						<td><span class="fw-bold qtt" contenteditable spellcheck="false">1</span></td>
						<td class="text-end fw-bold"><span ></span><span>600.00</span></td>
					`
	
	return emptyColumn;
}

function parseFloatHTML(element) {
	return parseFloat(element.innerHTML.replace(/[^\d\.\-]+/g, '')) || 0;
}

function parsePrice(number) {
	return number.toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,');
}

/* Update Number
/* ========================================================================== */

function updateNumber(e) {
	var
	activeElement = document.activeElement,
	value = parseFloat(activeElement.innerHTML),
	wasPrice = activeElement.innerHTML == parsePrice(parseFloatHTML(activeElement));

	if (!isNaN(value) && (e.keyCode == 38 || e.keyCode == 40 || e.wheelDeltaY)) {
		e.preventDefault();

		value += e.keyCode == 38 ? 1 : e.keyCode == 40 ? -1 : Math.round(e.wheelDelta * 0.025);
		value = Math.max(value, 0);

		activeElement.innerHTML = wasPrice ? parsePrice(value) : value;
	}

	updateInvoice();
}

let inputManual = false

function modeInputManual() {
	inputManual = !inputManual
	for (a = document.querySelectorAll('.harga'), i = 0; i < a.length; ++i) if (document.activeElement != a[i]) a[i].innerHTML = '';
	updateInvoice()
}

/* Update Invoice
/* ========================================================================== */

function updateInvoice() {
	const btnModeInput = document.getElementById('btn-mode-input')
	if (inputManual) {
		btnModeInput.innerHTML = 'Mode Input : Manual'
	} else {
		btnModeInput.innerHTML = 'Mode Input : Auto'
	}

	const listHarga = [12000, 22000, 24000, 35000, 42000, 45000, 55000, 56000,32000, 50, "xx"]

	var total = 0;
	var cells, price, total, a, i;
	
	// update inventory cells
	// ======================
	
	for (var a = document.querySelectorAll('table.inventory tbody tr'), i = 0; a[i]; ++i) {
		// get inventory row cells
		cells = a[i].querySelectorAll('span:last-child');
		
		// set price as cell[2] * cell[3]
		price = parseFloatHTML(cells[2]) * parseFloatHTML(cells[3]);
		
		// add price to total
		total += price;
		
		// set row total
		cells[4].innerHTML = price;
	}
	
	// update balance cells
	// ====================
	
	// get balance cells
	cells = document.querySelectorAll('table.balance td:last-child span:last-child');
	
	// set total
	cells[0].innerHTML = total;
	
	// update prefix formatting
	// ========================
	
	var prefix = document.querySelector('#prefix').innerHTML;
	for (a = document.querySelectorAll('[data-prefix]'), i = 0; a[i]; ++i) a[i].innerHTML = prefix;
	

	const pilihBarang = document.querySelectorAll('.pilihBarang')
	
	if (inputManual == false) {
		for (a = document.querySelectorAll('.harga'), i = 0; i < a.length; ++i) if (document.activeElement != a[i]) a[i].innerHTML = listHarga[pilihBarang[i].value - 1];
	} 
			
}


/* On Content Load
/* ========================================================================== */

function onContentLoad() {
	updateInvoice();
	
	var
	input = document.querySelector('input'),
	image = document.querySelector('img');
	
	function onClick(e) {
		var element = e.target.querySelector('[contenteditable]'), row;
		
		element && e.target != document.documentElement && e.target != document.body && element.focus();
		
		if (e.target.matchesSelector('.add')) {
			document.querySelector('table.inventory tbody').appendChild(generateTableRow());
		}
		else if (e.target.className == 'cut') {
			row = e.target.ancestorQuerySelector('tr');

			row.parentNode.removeChild(row);
		}
		
		updateInvoice();
	}
	
	function onEnterCancel(e) {
		e.preventDefault();
		
		image.classList.add('hover');
	}
	
	function onLeaveCancel(e) {
		e.preventDefault();
		
		image.classList.remove('hover');
	}
	
	function onFileInput(e) {
		image.classList.remove('hover');

		var
		reader = new FileReader(),
		files = e.dataTransfer ? e.dataTransfer.files : e.target.files,
		i = 0;
		
		reader.onload = onFileLoad;

		while (files[i]) reader.readAsDataURL(files[i++]);
	}
	
	function onFileLoad(e) {
		var data = e.target.result;
		
		image.src = data;
	}
	if (window.addEventListener) {
		document.addEventListener('click', onClick);
		
		document.addEventListener('mousewheel', updateNumber);
		document.addEventListener('keydown', updateNumber);
		
		document.addEventListener('keydown', updateInvoice);
		document.addEventListener('keyup', updateInvoice);
		
		input.addEventListener('focus', onEnterCancel);
		input.addEventListener('mouseover', onEnterCancel);
		input.addEventListener('dragover', onEnterCancel);
		input.addEventListener('dragenter', onEnterCancel);
		
		input.addEventListener('blur', onLeaveCancel);
		input.addEventListener('dragleave', onLeaveCancel);
		input.addEventListener('mouseout', onLeaveCancel);
		
		input.addEventListener('drop', onFileInput);
		input.addEventListener('change', onFileInput);
	}
}

window.addEventListener && document.addEventListener('DOMContentLoaded', onContentLoad);