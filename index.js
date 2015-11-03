function processImage (img) {
  // img.height, .width, .data [r,g,b,a,r,g,b,a...]
  flipHorizontal(img);
}

function copy (img) {
  return img;
}

function transparent (img) {
  for (var i=3; i<img.data.length; i+=4) {
    img.data[i] = 50;
  }
}

function tintRed (img) {
  for (var i=0; i<img.data.length; i+=4) {
    img.data[i] = Math.min(255, img.data[i]+80);
  }
}

//using a shitty for-loop b/c I don't know how to cross-product in JS
function greyscale (img) {
  for (var i=0; i<img.data.length; i+=4) {
    var avg = (img.data[i] + img.data[i+1] + img.data[i+2])/3;
    img.data[i] = img.data[i+1] = img.data[i+2] = avg; 
  }
}

function invertColors (img) {
 for (var i=0; i<img.data.length; i+=4) {
  img.data[i] = 255-img.data[i];
  img.data[i+1] = 255-img.data[i+1];
  img.data[i+2] = 255-img.data[i+2];
 } 
}

function flipVertical (img) {
  var newData = [];
  for (var i=0; i<img.height; i++) {
    var swapArr = [];
    var loc = img.width*i*4;
    for (var j=loc; j<img.width*4+loc; j++) {
      swapArr.push(img.data[j]);
    }
    newData = swapArr.concat(newData);
  }
  img.data = newData;
}

function flipHorizontal (img) {
  for (var i=0; i<img.height; i++) {
    var loc = img.width*i*4;
    var midRow = (img.width*2+loc);
    for (var j=loc; j<midRow; j+=4) {
      var opposite = midRow*2-j-1;
      var tmp = [img.data[j], img.data[j+1], img.data[j+2], img.data[j+3]];
      img.data[j] = img.data[opposite-3];
      img.data[j+1] = img.data[opposite-2];
      img.data[j+2] = img.data[opposite-1];
      img.data[j+3] = img.data[opposite];
      img.data[opposite-3] = tmp[0];
      img.data[opposite-2] = tmp[1];
      img.data[opposite-1] = tmp[2];
      img.data[opposite] = tmp[3];
    }
  }
}

function rotate90 (img) {}

function blur (img, blurFactor) {}




// DON'T MESS WITH WHAT'S BELOW

var fs = require('fs');
var path = require('path');
Png = require('node-png').PNG;
var date = Date.now();
var inputFilePath = './images/rainbowsheep.png';
var outputFilePath = './images/out/'+String(date)+'.png';

fs.createReadStream(inputFilePath)
.pipe(new Png({
  filterType: 4
}))
.on('parsed', function() {
  processImage(this);
  this.pack().pipe(fs.createWriteStream(outputFilePath));
});
