'use strict';

var body = document.querySelector('body');
var contacts = Array.from(document.querySelectorAll('.contact'));
contacts.forEach(function (x) {
	return x.addEventListener('click', sharedImageTransition);
});
var pic = document.querySelector('.details');
pic.addEventListener('click', sharedImageTransition);

function sharedImageTransition() {
	var states = Array.from(document.querySelectorAll('.state'));
	var source = this.querySelector('.shared');
	var sourceCoords = source.getBoundingClientRect();
	var sourceRadius = getComputedStyle(source).borderRadius;

	var dummy = source.cloneNode();
	dummy.className = 'dummy';

	for (var attrb in sourceCoords) {
		dummy.style.setProperty('' + attrb, sourceCoords[attrb] + 'px');
	}


	dummy.style.position = 'absolute';
	dummy.style.borderRadius = sourceRadius;
	dummy.style.transition = 'all 0.5s ease-out';
	body.appendChild(dummy);

	var dest = undefined;
	if (source.dataset.dest) {
		dest = document.querySelector('.next.state [data-source=\'' + source.dataset.dest + '\']');
	} else {
		dest = document.querySelector('.next.state .shared');
		dest.dataset.dest = source.dataset.source;
		var name = this.querySelector('.name').textContent;
		document.querySelector('.next.state .name').textContent = name;
	}
	var destCoords = dest.getBoundingClientRect();
	var destRadius = getComputedStyle(dest).borderRadius;

	states.forEach(function (x) {
		x.classList.toggle('next');
		x.classList.toggle('present');
	});

	dummy.addEventListener('transitionend', function (e) {
		dest.src = this.src;
	   body.removeChild(this);
	});

	for (var attrb in destCoords) {
		dummy.style.setProperty('' + attrb, destCoords[attrb] + 'px');
	}

	dummy.style.borderRadius = destRadius;
}