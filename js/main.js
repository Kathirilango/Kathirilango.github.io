//Typing Text Animation
var text = "I'm Kathir.";
var textArr = text.split("");
var loopTimer;
var span = 	document.getElementById("type_text").innerHTML;
var message = "<span class='cursor-done'>|</span>";
function frameLooper(){
	if (textArr.length> 0){
		var nextChar = textArr.shift();
		document.getElementById("type_text").innerHTML = message + nextChar + span;
		message += nextChar;
	} else {
		setTimeout(() => {document.getElementById('type_text').innerHTML = message+"<span class='cursor-done'>|</span>"}, 10000);
		clearTimeout(loopTimer);
		return false;
	}
	loopTimer = setTimeout('frameLooper()', 100);
}
setTimeout('frameLooper()', 2000);

//Dimming Card When Hovering
const workItems = document.querySelectorAll('.card');
workItems.forEach(workItem => {
	workItem.addEventListener('mouseover', () => {
		workItem.childNodes[1].classList.add('img-darken');
	});
	workItem.addEventListener('mouseout', () => {
		workItem.childNodes[1].classList.remove('img-darken');
	});
})

//Email Popover
$(document).ready(function(){
	$('[data-toggle="popover"]').popover();
});