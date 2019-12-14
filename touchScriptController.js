function touchScriptController(element, parentElement, options) {
    var mouseDown = false, scaling = false;
    var startX = 0, startY = 0;
    
    var adjustScale = 1, adjustDeltaX = 0, adjustDeltaY = 0;
    var currentScale = 1, currentDeltaX = 0, currentDeltaY = 0;

    var hypo = undefined;

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

    function bindEvents() {
        addListenerMulti(element, 'touchstart mousedown', handleTouchStart);
        
        addListenerMulti(element, 'touchmove mousemove', handleTouchMove);
        
        addListenerMulti(element, 'touchend mouseup', handleTouchEnd);
        
        addListenerMulti(element, 'touchcancel mouseout', handleTouchCancel);
        
        addListenerMulti(element, 'wheel', handleWheel);
    }
    
    function handleTouchStart(e) {
        e.preventDefault();
        
        mouseDown = (e.type === 'mousedown');
    
        startX = e.clientX || e.touches[0].clientX;
        startY = e.clientY || e.touches[0].clientY;   
        
        scaling = (e.touches && e.touches.length === 2);
    }

    function handleTouchMove(e) {
        e.preventDefault();
        if(e.type === 'mousemove' && !mouseDown) { return false; }
    
        var deltaX, deltaY, scale = 1;
    
        deltaX = (e.clientX || e.changedTouches[0].clientX) - startX;
        deltaY = (e.clientY || e.changedTouches[0].clientY) - startY;
    
    
        if(scaling) {
            scale = currentScale;
            deltaX = 0, deltaY = 0, wasScaling = true;
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
        if (currentScale < 1) {
            currentScale = 1;
            currentDeltaX = 0;
            currentDeltaY = 0;
        }
    
        setConstraints();
        setTransform();
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        mouseDown = !(e.type === 'mouseup');
        
        adjustScale = currentScale;
        adjustDeltaX = currentDeltaX;
        adjustDeltaY = currentDeltaY;
        hypo = undefined;
        scaling = false;
    }

    function handleTouchCancel(e) {
        e.preventDefault();
        
        adjustScale = currentScale;
        adjustDeltaX = currentDeltaX;
        adjustDeltaY = currentDeltaY;
        hypo = undefined;
        scaling = false;
        mouseDown = false;
    }

    function handleWheel(e) {
        currentScale += event.deltaY * -0.01;
        adjustScale = currentScale;
        setConstraints();
        setTransform();
    }
    
    function init() {

        if(options) {
            currentScale = adjustScale = options.scale || 1;
            currentDeltaX = adjustDeltaX = options.translateX || 0; 
            currentDeltaY = adjustDeltaY = options.translateY || 0;

            setTransform();
        }
    
        bindEvents();
    }

    init();
}