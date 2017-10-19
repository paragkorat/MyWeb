
if(!window.JSFX) JSFX=new Object();

if(!JSFX.createLayer)
{/*** Include Library Code ***/

var ns4 = document.layers;
var ie4 = document.all;
JSFX.objNo=0;

JSFX.getObjId = function(){return "JSFX_obj" + JSFX.objNo++;};

JSFX.createLayer = function(theHtml)
{
  var layerId = JSFX.getObjId();

  document.write(ns4 ? "<LAYER  NAME='"+layerId+"'>"+theHtml+"</LAYER>" : 
           "<DIV id='"+layerId+"' style='position:absolute'>"+theHtml+"</DIV>" );

  var el =  document.getElementById ? document.getElementById(layerId) :
      document.all    ? document.all[layerId] :
                document.layers[layerId];

  if(ns4)
    el.style=el;

  return el;
}
JSFX.fxLayer = function(theHtml)
{
  if(theHtml == null) return;
  this.el = JSFX.createLayer(theHtml);
}
var proto = JSFX.fxLayer.prototype

proto.moveTo     = function(x,y){this.el.style.left = x;this.el.style.top=y;}
proto.setBgColor = function(color) { this.el.style.backgroundColor = color; } 
proto.clip       = function(x1,y1, x2,y2){ this.el.style.clip="rect("+y1+" "+x2+" "+y2+" "+x1+")"; }
if(ns4){
  proto.clip = function(x1,y1, x2,y2){
    this.el.style.clip.top   =y1;this.el.style.clip.left  =x1;
    this.el.style.clip.bottom=y2;this.el.style.clip.right =x2;
  }
  proto.setBgColor=function(color) { this.el.bgColor = color; }
}
if(window.opera)
  proto.setBgColor = function(color) { this.el.style.color = color==null?'transparent':color; }

if(window.innerWidth)
{
  gX=function(){return innerWidth;};
  gY=function(){return innerHeight;};
}
else
{
  gX=function(){return document.body.clientWidth;};
  gY=function(){return document.body.clientHeight;};
}

/*** Example extend class ***/
JSFX.fxLayer2 = function(theHtml)
{
  this.superC = JSFX.fxLayer;
  this.superC(theHtml + "C");
}
JSFX.fxLayer2.prototype = new JSFX.fxLayer;
}/*** End Library Code ***/

/*************************************************/

/*** Class Firework extends FxLayer ***/
JSFX.Firework = function(fwImages)
{
  window[ this.id = JSFX.getObjId() ] = this;
  this.imgId = "i" + this.id;
  this.fwImages  = fwImages;
  this.numImages = fwImages.length;
  this.superC = JSFX.fxLayer;
  this.superC("<img src='"+fwImages[0].src+"' name='"+this.imgId+"'>");

  this.img = document.layers ? this.el.document.images[0] : document.images[this.imgId];
  this.step = 0;
  this.timerId = -1;
  this.x = 0;
  this.y = 0;
  this.dx = 0;
  this.dy = 0;
  this.ay = 0.2;
  this.state = "OFF";
}
JSFX.Firework.prototype = new JSFX.fxLayer;

JSFX.Firework.prototype.getMaxDy = function()
{
  var ydiff = gY() - 130;
  var dy    = 1;
  var dist  = 0;
  var ay    = this.ay;
  while(dist<ydiff)
  {
    dist += dy;
    dy+=ay;
  }
  return -dy;
}
JSFX.Firework.prototype.setFrame = function()
{
//  this.img.src=this.fwName+"/"+this.step+".gif";
  this.img.src=this.fwImages[ this.step ].src;
}
JSFX.Firework.prototype.animate = function()
{

  if(this.state=="OFF")
  {
    
    this.step = 0;
    this.x = gX()/2-20;
    this.y = gY()-100;
    this.moveTo(this.x, this.y);
    this.setFrame();
    if(Math.random() > .95)
    {
      this.dy = this.getMaxDy();
      this.dx = Math.random()*-8 + 4;
      this.dy += Math.random()*3;
      this.state = "TRAVEL";
    }
  }
  else if(this.state=="TRAVEL")
  {
    this.x += this.dx;
    this.y += this.dy;
    this.dy += this.ay;
    this.moveTo(this.x,this.y);
    if(this.dy > 1)
      this.state="EXPLODE"
  }
  else if(this.state == "EXPLODE")
  {
    this.step++;
    if(this.step < this.numImages)
      this.setFrame();
    else
      this.state="OFF";
  }
}
/*** END Class Firework***/

/*** Class FireworkDisplay extends Object ***/
JSFX.FireworkDisplay = function(n, fwImages, numImages)
{
  window[ this.id = JSFX.getObjId() ] = this;
  this.timerId = -1;
  this.fireworks = new Array();
  this.imgArray = new Array();
  this.loadCount=0;
  this.loadImages(fwImages, numImages);

  for(var i=0 ; i<n ; i++)
    this.fireworks[this.fireworks.length] = new JSFX.Firework(this.imgArray);
}
JSFX.FireworkDisplay.prototype.loadImages = function(fwName, numImages)
{
  for(var i=0 ; i<numImages ; i++)
  {
    this.imgArray[i] = new Image();
    this.imgArray[i].obj = this;
    this.imgArray[i].onload = window[this.id].imageLoaded;
    this.imgArray[i].src = fwName+"/"+i+".gif";
  }
}
JSFX.FireworkDisplay.prototype.imageLoaded = function()
{
  this.obj.loadCount++;
}

JSFX.FireworkDisplay.prototype.animate = function()
{
status = this.loadCount;
  if(this.loadCount < this.imgArray.length)
    return;

  for(var i=0 ; i<this.fireworks.length ; i++)
    this.fireworks[i].animate();
}
JSFX.FireworkDisplay.prototype.start = function()
{
  if(this.timerId == -1)
  {
    this.state = "OFF";
    this.timerId = setInterval("window."+this.id+".animate()", 40);
  }

}
JSFX.FireworkDisplay.prototype.stop = function()
{
  if(this.timerId != -1)
  {
    clearInterval(this.timerId);
    this.timerId = -1;
    for(var i=0 ; i<this.fireworks.length ; i++)
    {
      this.fireworks[i].moveTo(-100, -100);
      this.fireworks[i].step = 0;;
      this.fireworks[i].state = "OFF";
    } 
  }
}
/*** END Class FireworkDisplay***/

JSFX.FWStart = function()
{
  if(JSFX.FWLoad)JSFX.FWLoad();
  myFW.start();
}
myFW = new JSFX.FireworkDisplay(20, "fw08", 27);
JSFX.FWLoad=window.onload;
window.onload=JSFX.FWStart;

var canvas;
var gctx;   // Graphic context
var fireworks = [];   // Each firework will be an element of this array

window.addEventListener("load", function() {
  canvas = document.querySelector("canvas");
  
  // If canvas is supported
  if(canvas.getContext) {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
    
    gctx = canvas.getContext("2d");
    
    window.addEventListener("resize", handlePageResize);
    document.body.addEventListener("click", handleCanvasClick);
    window.requestAnimationFrame(animationLoop);
  }
});

function animationLoop() {
  gctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Randomly generate a firework
  if(Math.random() < 0.03)
    fireworks.push(new Firework(Math.floor(Math.random()*canvas.width), Math.floor(Math.random()*canvas.height)));
  
  // Draw each firework in the array (so you can have multiple fireworks at the same time)
  fireworks.forEach(function(f) {
    // Draw a firework only if it still has visible particles
    if(!f.isFinished())
      f.draw(gctx);
  });
  
  window.requestAnimationFrame(animationLoop);
}

/** Resizes the canvas to make it look responsive. */
function handlePageResize() {
  canvas.width = document.querySelector("body").clientWidth;
  
  canvas.height = document.querySelector("body").clientHeight;
}

function handleCanvasClick(e) {
  //gctx.fillStyle = "#a55";
  //gctx.fillRect(e.clientX, e.clientY, 2, 2);
  fireworks.push(new Firework(e.clientX, e.clientY));
}

var Firework = function(_x, _y) {
  var targetX = _x;
  var targetY = _y;
  var power = 2;  // Affects the movement speed of the particles
  var particles = [];
  var hue = Math.floor(Math.random()*360);
  
  var deadCount = 0;
  var numParticles = 100;
  
  var gravity = 0.1;
  var airResistence = 1.02;  // It must be greater than 1 to avoid weird results.
  
  this.draw = function(context) {
    // TODO - Animation should stop when all particles are invisible
    particles.forEach(function(p) {
      p.update(gravity, airResistence);
      p.draw(context);
    });
  };
  
  this.particleDead = function() {
    deadCount++;
  };
  
  this.isFinished = function() {
    return deadCount == numParticles;
  };
  
  for(var i=0; i<numParticles; i++) {
    var randomAngle = Math.random()*Math.PI*2;
    var dx = Math.cos(randomAngle)*(power*Math.random());
    var dy = Math.sin(randomAngle)*(power*Math.random());
    particles.push(new Particle(targetX, targetY, 2, dx, dy, hue, this.particleDead));
  }
};

var Particle = function(_x, _y, _radius, _dx, _dy, _hue, onDeath) {
  var x = _x;
  var y = _y;
  var radius = _radius;
  var dx = _dx;
  var dy = _dy;
  var hue = _hue;
  var timeOfLife = 0;
  var opacity = 1;
  var dead = false;
  
  // Gravity and air resistance affect how X and Y change
  this.update = function(gravity, airResistance) {
    timeOfLife++;
    
    if(timeOfLife > 35 && !dead) {
      // Opacity decreases only after a certain time (35 frames)
      opacity -= 0.03;
      if(opacity < 0) {
        opacity = 0;
        dead = true;
        onDeath();  // Tells the firework object this particle should not be drawn again (increase a counter, if the counter = numParticles stop drawing the firework)
      }
    }
    
    //dy += gravity;
    //dx /= airResistance;
    x += dx;
    y += dy;
  };
  
  this.draw = function(context) {
    // NOTE: lightness 100% will make every color white.
    context.fillStyle = "hsla(" + hue + ", 100%, 70%, " + opacity + ")";
    context.fillRect(x, y, radius, radius);
  };
};