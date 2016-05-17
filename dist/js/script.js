'use strict';

document.addEventListener('DOMContentLoaded', start);

//____________________________________________ View cart ____________________________________________

function start() {
	reduceItemsNames();
	assignAdditionalAttrs();
	document.querySelectorAll('.content_status_circle')[0].classList.add('marked');
	document.querySelector('.user-data').children[1].style.display = 'none';
	document.querySelector('.user-data').children[2].style.display = 'none';
	document.querySelector('.promo-code').addEventListener('mousedown', promoCode);
	document.querySelector('.button-box').children[0].addEventListener('click', guaranteeShow);
	document.querySelector('.button-box').children[1].addEventListener('click', startPayment);
}

function reduceItemsNames() {
	var names = document.querySelectorAll('.items-table_item_cell-1_description');

	Array.prototype.forEach.call(names, (elem) => {
		if(elem.textContent.length > 25) {
			elem.textContent = `${elem.textContent.match(/[\s\S]{0,24}/gi)[0]}...`;
		}
	});
}

function assignAdditionalAttrs() {
	var items = document.querySelectorAll('.items-table_item');

	Array.prototype.forEach.call(items, (elem, i) => {
		elem.parentNode.id = `item-${i}`;
		elem.querySelector('.items-table_item_cell-2_quantity').id = `item-${i}-quantity`;
		elem.querySelector('.items-table_item_cell-3_price').id = `item-${i}-price`;
		elem.querySelector('.items-table_item_cell-4_remove').onclick = removeItem.bind(null, `item-${i}`);
		elem.querySelector('.button-plus').onclick = increaseQuantity.bind(null, `item-${i}`);
		elem.querySelector('.button-minus').onclick = reduceQuantity.bind(null, `item-${i}`);
	});

	changeTotalAmount();
}

function changeTotalAmount() {
	var subtotal = 0;
	var tax = strToNum(getById(`tax`).textContent.match(/[\d\.]/g).join(''));
	var shipping = strToNum(getById(`shipping`).textContent.match(/[\d\.]/g).join(''));
	var total = 0;
	var items = document.querySelectorAll('.items-table_item');

	Array.prototype.forEach.call(items, (elem, i) => {
		subtotal += strToNum(getPrice(`item-${i}`)) * +getQuantity(`item-${i}`);
	});
	
	getById('subtotal').textContent = `$${subtotal}`;
	total = subtotal + tax + shipping;
	getById('total').textContent = `$${total}`;
}

function increaseQuantity(id) {
	var quantity = getById(id).querySelector('.items-table_item_cell-2_quantity');
	quantity.textContent = parseInt(quantity.textContent) + 1;
	changeTotalAmount();
}

function reduceQuantity(id) {
	var quantity = getById(id).querySelector('.items-table_item_cell-2_quantity');

	if(quantity.textContent == '1') {
		removeItem(id);
	} else {
		quantity.textContent = parseInt(quantity.textContent) - 1;
		changeTotalAmount();
	}
}

function removeItem(id) {
	var elem = getById(id);
	elem.parentNode.removeChild(elem);
	assignAdditionalAttrs();
}

function promoCode() {
	var container = document.querySelector('.promo-code');
	container.textContent = '';

	var inputText = document.createElement('input');
	inputText.setAttribute('type', 'text'); 
	inputText.className = 'promo-code-text';

	var applyButton = document.createElement('input');
	applyButton.setAttribute('type', 'button'); 
	applyButton.setAttribute('value', 'APPLY');
	applyButton.className = 'promo-code-apply';
	applyButton.onclick = promoCodeApply;

	container.appendChild(inputText);
	container.appendChild(applyButton); 
	container.removeEventListener('mousedown', promoCode);
}

function promoCodeApply() {
	var container = document.querySelector('.promo-code');
	var inputText = document.querySelector('.promo-code-text');
	var button = document.querySelector('.promo-code-apply');
	var text = inputText.value;

	inputText.value = `APPLIED: ${text}`;
	inputText.disabled = true;
	button.parentNode.removeChild(button);

	var remove = document.createElement('div');
	remove.className = '.items-table_item_cell-4_remove';
	remove.style.display = 'inline-block';
	remove.style.marginLeft = '20px';
	remove.onclick = promoCodeRemove;

	var img = document.createElement('img');
	img.src = 'images/button-remove.png';

	var span = document.createElement('span');
	span.textContent = 'REMOVE';
	span.style.marginLeft = '6px';

	remove.appendChild(img);
	remove.appendChild(span);
	container.appendChild(remove);
}

function promoCodeRemove() {
	var container = document.querySelector('.promo-code');
	container.innetHTML = '';
	container.textContent = 'ADD PROMO CODE';
	container.addEventListener('mousedown', promoCode);
}

function guaranteeShow() {
	var firstNode = document.querySelector('.header');

	var whiteBackground = document.createElement('div');
	whiteBackground.className = 'white-background';
	document.documentElement.style.overflow = 'hidden';
	whiteBackground.onclick = guaranteeClose;

	var popup = document.createElement('div');
	popup.className = 'popup';
	popup.innerHTML = `
		<h1>HAPPINESS GUARANTEE</h1>
		<div class='data-separator'></div>
		<h4>Our Promise to You</h4><br>
		<p>Decorist is all about you. When you order a design service one of our experienced designers will review your profile, questionare, photos and anything else you have provided. They will develop a recommendation thet is personal - one thet reflects your lifestyle, style and budget.</p><br>
		<p>We really want you to love your recommendations and use them to transform your space. If you are not delighted with your recommendations please email us and we will make it right. We will work to make sure you get recommendations that make you, and your room, happy so you can fall in love with your home all over again.</p><br>
		<h4>About Decorist Designers</h4><br>
		<p>Decorist designers are carefully selected for their ability to deliver great recommendations that reflect your style and budget. Our designers know which products work, how to pull a look together quickly and easily with a focus on key elements that will give you the most bang for your buck. Their products recommendations are made without consideration of any products commissions. All recommendations are based on what the designer thinks will look great and work for your space based on experience period.</p>
	`;

	var popupCLose = document.createElement('div');
	popupCLose.className = 'popup_close';

	popup.appendChild(popupCLose);
	whiteBackground.appendChild(popup);
	firstNode.parentNode.insertBefore(whiteBackground, firstNode);
}

function guaranteeClose(e) {
	var whiteBackground = document.querySelector('.white-background');
	var popupClose = document.querySelector('.popup_close');

	if((e.target != whiteBackground) && (e.target != popupClose)) {
		return;
	}

	whiteBackground.parentNode.removeChild(whiteBackground);
	document.documentElement.style.overflow = '';
}

function getQuantity(id) {
	return getById(id).querySelector('.items-table_item_cell-2_quantity').textContent;
}

function getPrice(id) {
	var price = getById(id).querySelector('.items-table_item_cell-3_price').textContent.match(/[\d\.]/g).join('');
	return price;
}

function strToNum(str) {
	var a = str.split('.');
	var b = parseInt(a[0]) + +`0.${parseInt(a[1])}`;
	return b;
}

//____________________________________________ Payment ____________________________________________

function startPayment() {
	document.querySelectorAll('.content_status_circle')[0].classList.remove('marked');
	document.querySelectorAll('.content_status_circle')[1].classList.add('marked');
	document.querySelector('.user-data').children[0].innerHTML = '';
	document.querySelector('.user-data').children[1].style.display = '';
	document.querySelector('.button-box').children[0].addEventListener('click', guaranteeShow);
	document.querySelector('.button-box').children[1].addEventListener('click', placeOrder);
}

function checkPaymentDataFilling() {
	var inputs = document.querySelector('.user-data').children[1].querySelectorAll('input');
	var done = true;

	Array.prototype.forEach.call(inputs, (elem) => {
		if(elem.value == '') {
			done = false;
			elem.classList.add('wrong-data');
		}
	});

	return done;
}

function placeOrder() {
	var goNext = checkPaymentDataFilling();

	if(goNext) {
		document.querySelectorAll('.content_status_circle')[1].classList.remove('marked');
		document.querySelectorAll('.content_status_circle')[2].classList.add('marked');
		document.querySelector('.user-data').children[1].innerHTML = '';
		document.querySelector('.user-data').children[2].style.display = '';
		document.querySelector('.button-box').children[1].addEventListener('click', finalMessage);
	}
}

//____________________________________________ Additional info ____________________________________________

function checkAdditionalDataFilling() {
	var inputs = document.querySelector('.user-data').children[2].querySelectorAll('input');
	var textarea = document.querySelector('.user-data').children[2].querySelector('textarea');
	var done = true;

	Array.prototype.forEach.call(inputs, (elem) => {
		if(elem.value == '') {
			done = false;
			elem.classList.add('wrong-data');
		}
	});

	if(textarea.value == '') {
		done = false;
		textarea.classList.add('wrong-data');
	}

	return done;
}

function finalMessage() {
	var done = checkAdditionalDataFilling();
	var content = document.querySelector('.content-box');
	var userData = document.querySelector('.user-data');

	if(done) {
		alert('Done');
	} else {
		alert('Complete all fields');
	}
}

function getById(id) {
	return typeof id === 'string' ? document.getElementById(id) : id;
}