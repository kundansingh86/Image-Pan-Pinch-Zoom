var element = document.getElementById('imageZoom');
var parentElement = document.getElementById('container');
var label = document.getElementById('lblConsole');

var mouseDown = false, scaling = false;
var startX = 0, startY = 0;

var adjustScale = 1, adjustDeltaX = 0, adjustDeltaY = 0;
var currentScale = 1, currentDeltaX = 0, currentDeltaY = 0;
var tapTimestamp = 0;

var hypo = undefined;


function addListenerMulti(elem, eventNames, listener) {
    var events = eventNames.split(' ');
    for (var i=0, iLen=events.length; i<iLen; i++) {
        elem.addEventListener(events[i], listener, false);
    }
}

function setConstraints() {
    
    let minDeltaX = ((element.width * currentScale - parentElement.clientWidth) / (currentScale * 2));
    let minDeltaY = ((element.height * currentScale - parentElement.clientHeight) / (currentScale * 2));
    
    if (currentScale < 1) {
        currentScale = 1;
        currentDeltaX = 0;
        currentDeltaY = 0;
    } 
    
    if(Math.abs(currentDeltaX) > minDeltaX) {
        currentDeltaX = minDeltaX * Math.sign(currentDeltaX);
    }

    if(Math.abs(currentDeltaY) > minDeltaY) {
        currentDeltaY = minDeltaY * Math.sign(currentDeltaY);
    }
}

function setTransform() {
    let transforms = [];

    transforms.push(`scale(${currentScale})`);
    transforms.push(`translate(${currentDeltaX}px, ${currentDeltaY}px)`);

    element.style.transform = transforms.join(' ');

    console.log(transforms.join(' '));
}
  
addListenerMulti(element, 'touchstart mousedown', function(e) {
    e.preventDefault();
    console.log(e.type, e);

    label.innerText += `${e.type} \n`;

    mouseDown = (e.type === 'mousedown');

    startX = e.clientX || e.touches[0].clientX;
    startY = e.clientY || e.touches[0].clientY;   
    
    scaling = (e.touches && e.touches.length === 2);
});

addListenerMulti(element, 'touchmove mousemove', function(e) {
    e.preventDefault();
    if(e.type === 'mousemove' && !mouseDown) { return false; }

    var deltaX, deltaY, scale = 1;

    deltaX = (e.clientX || e.changedTouches[0].clientX) - startX;
    deltaY = (e.clientY || e.changedTouches[0].clientY) - startY;


    if(scaling) {
        scale = currentScale;
        deltaX = 0, deltaY = 0, lastDeltaX = 0;
        let hypoTouchMove = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY);

        if(hypo === undefined) {
            hypo = hypoTouchMove;
        }

        scale = hypoTouchMove / hypo;
    }

    currentScale = adjustScale * scale;
    currentDeltaX = adjustDeltaX + (deltaX / currentScale);
    currentDeltaY = adjustDeltaY + (deltaY / currentScale);

    label.innerText += `${currentScale}\n`;

    setConstraints();
    setTransform();
});

addListenerMulti(element, 'touchend mouseup', function(e) {
    e.preventDefault();
    mouseDown = !(e.type === 'mouseup');
    console.log(e.type, e);
    
    adjustScale = currentScale;
    adjustDeltaX = currentDeltaX;
    adjustDeltaY = currentDeltaY;
    tapTimestamp = e.timeStamp;
    hypo = undefined;
    scaling = false;
});

addListenerMulti(element, 'wheel', function(e) {
    e.preventDefault();
    currentScale += event.deltaY * -0.01;
    adjustScale = currentScale;
    setConstraints();
    setTransform();
});

addListenerMulti(element, 'touchcancel mouseout', function(e) {
    e.preventDefault();
    console.log(e.type, e);
    label.innerText += `${e.type} \n`;

    adjustScale = currentScale;
    adjustDeltaX = currentDeltaX;
    adjustDeltaY = currentDeltaY;
    hypo = undefined;
    scaling = false;
    mouseDown = false;
});

