var element = document.getElementById('imageZoom');
var parent = document.getElementById('container');

var mouseDown = false, scaling = false;
var startX = 0, startY = 0;

var adjustScale = 1, adjustDeltaX = 0, adjustDeltaY = 0;
var currentScale = 1, currentDeltaX = 0, currentDeltaY = 0;
var tapTimestamp = 0;


function addListenerMulti(elem, eventNames, listener) {
    var events = eventNames.split(' ');
    for (var i=0, iLen=events.length; i<iLen; i++) {
        elem.addEventListener(events[i], listener, false);
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
    console.log(e.type, e.touches.length);
    mouseDown = (e.type === 'mousedown');

    startX = e.clientX || e.touches[0].clientX;
    startY = e.clientY || e.touches[0].clientY;

    if (e.touches && e.touches.length === 2) {
        scaling = true;
    }
});

addListenerMulti(element, 'touchmove mousemove', function(e) {
    e.preventDefault();
    if(e.type === 'mousemove' && !mouseDown) { return false; }

    var deltaX, deltaY, scale = 1;

    deltaX = (e.clientX || e.changedTouches[0].clientX) - startX;
    deltaY = (e.clientY || e.changedTouches[0].clientY) - startY;


    if(scaling) {
        var scale = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY);
    }

    currentScale = adjustScale * scale;
    currentDeltaX = adjustDeltaX + (deltaX / currentScale);
    currentDeltaY = adjustDeltaY + (deltaY / currentScale);
    if (currentScale < 1) {
        currentScale = 1;
        currentDeltaX = 0;
        currentDeltaY = 0;
    }

    setTransform();
});

addListenerMulti(element, 'touchend mouseup mouseout', function(e) {
    e.preventDefault();
    mouseDown = !(e.type === 'mouseup' || e.type === 'mouseout');
    console.log(e.type, e);

    let diff = (e.timeStamp - tapTimestamp);
    
    if(diff < 500) {
        currentScale += 0.5;
        if(currentScale > 3) {
            currentScale = 1;
        }

        setTransform();
    }

    if (scaling) {
        scaling = false;
    }

    adjustScale = currentScale;
    adjustDeltaX = currentDeltaX;
    adjustDeltaY = currentDeltaY;
    tapTimestamp = e.timeStamp;
});

addListenerMulti(element, 'touchcancel', function(e) {
    e.preventDefault();
    console.log(e.type, e);

    adjustScale = currentScale;
    adjustDeltaX = currentDeltaX;
    adjustDeltaY = currentDeltaY;
});

