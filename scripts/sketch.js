var canvas, isDrawing, intervalID, iterations;
var fakeID = 1;
var colors = ['#fa4359', '#4b35ef', '#37c3be']
var colorIndex = {
  val: -1,
  next: function() {
    this.val++;
    if (this.val >= colors.length) {
      this.val = 0;
    }
    return this.val;
  }
}
var container = document.querySelector('div#sketchpad');
var artboard = document.querySelector('div#artboard');
var fakeConsole = document.querySelector('div#fake-console');

function preload() {
}

function setup() {
  canvas = createCanvas(50, 50);
  canvas.parent('sketchpad');
  canvas.resize(container.clientWidth, container.clientHeight);

  strokeWeight(2);
  stroke(colors[colorIndex.next()]);
}

function draw() {
  cursor(CROSS);

  if (mouseIsPressed && pointIsInCanvas(mouseX, mouseY, width, height)) {
    isDrawing = true;
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function mouseReleased() {
  if (isDrawing === true) {
    isDrawing = false;
      // Add canvas images and fake console text
      const count = 8;
      const ratio = canvas.width/canvas.height;
      iterations = 0;
      if (intervalID) {
        clearInterval(intervalID);
      }
      stroke(colors[colorIndex.next()]);
      intervalID = setInterval(function() {
        fakeConsole.innerHTML += `$ Drawing image: ${++fakeID}...<br>`;
        fakeConsole.scrollTop = fakeConsole.offsetHeight;
        appendCanvasImg(artboard, canvas.elt, 1, ratio);
        iterations++;
        console.log(`iterations: ${iterations}`);
        if (iterations >= count) {
          clearInterval(intervalID);
        }
      }, 200);
    }

}

// Uses Array.prototype.forEach() instead of imgs.forEach()
// for IE-compatibility
function keyPressed() {
  if (key === 'r') {
    const imgs = document.querySelectorAll('img');
    if (imgs[0].classList.contains('special')) {
      Array.prototype.forEach.call(imgs, (elem) => {
        elem.setAttribute('class', '');
      });
    } else {
      Array.prototype.forEach.call(imgs, (elem) => {
        elem.setAttribute('class', 'special');
      });
    }
  }
}

/*************************
Event listeners
*************************/
window.onload = () => {
  document.querySelector('button#reset-button').addEventListener(
    'click',
    function (event) {
      artboard.innerHTML = '';
      canvas.clear();
      clearInterval(intervalID);
      fakeConsole.innerHTML += '$ Resetting board...<br>';
      fakeConsole.scrollTop = fakeConsole.offsetHeight;
    }
  );

  document.querySelector('canvas').addEventListener(
    'mouseover',
    function (event) {
      document.querySelector('#help-container').setAttribute('style', 'opacity:0')
    }
  );
}


/*************************
Helper functions
***************************/

/*
* Returns true if the point at x,y is within an imaginary canvas of
* width w and height
* Returns false otherwise.
*/
function pointIsInCanvas(x, y, w, h) {
  return x >= 0 && x <= w && y >= 0 && y <= h;
}

/*
Converts 'canvasElement' to an image, then appends that image
to 'container'.
@param {Element} container The HTML Element to which the image will be appended
@param {Element} canvasElement An HTML <canvas> element containing the image to be copied
@param {Number} count The number of copies of the image to be appended
@param {Number} proportion The image's width/height ratio
*/
function appendCanvasImg(container, canvasElement, count, proportion) {
  // Set width explicitly, then find height based on desired proportion
  const newWidth = 200;
  const newHeight = newWidth * 1/proportion;
  // Append imgs to a document fragment, then append that to container. For efficiency.
  const fragment = document.createDocumentFragment();
  const imageData = canvasElement.toDataURL()
  const availableHeight = container.parentElement.offsetHeight - newHeight;
  const availableWidth = container.parentElement.offsetWidth - newWidth;

  for (let i=0; i<count; i++) {
    const newImage = document.createElement('img');
    newImage.setAttribute('src', imageData);
    newImage.style.width = newWidth + 'px';
    newImage.style.height = newHeight + 'px';
    const randomX = Math.floor(Math.random() * availableWidth);
    const randomY = Math.floor(Math.random() * availableHeight);
    newImage.style.left = randomX + 'px';
    newImage.style.top = randomY + 'px';
    fragment.append(newImage);
  }
  container.append(fragment);
}
