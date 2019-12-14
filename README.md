# Image Pan-Pinch-Zoom and Crop 
A javascript library to apply pan, pinch and zoom on an image bound a container box. 

## Getting Started

Html, CSS and JS

```html
<div class="container" id="container">
    <img src="Koala.jpg" id="imageZoom" />
</div>

```

```css
.container {
    width: 500px;
    height: 400px;
    overflow: hidden;
    border: solid 1px black;
}

.container img {
    width: 100%;
    height: 100%;
}
```

Include Javascript in HTML Page

```html
<script type="text/javascript" src="touchScriptController.js"></script>
```

Apply touchScriptController to the image and container element

```js
let touchControl = new touchScriptController(
        document.getElementById('imageZoom'),   // Image Element
        document.getElementById('container'),   // Parent Container Element
        {                                       // Options to preset the scale and translate
            scale: 1,
            translateX: 0,
            translateY: 0
        });
```

For an example, please refer the ``index.html`` file. For cropping the image from CSS transform values refer the ```crop.php``` file and pass the required parameter into it.


