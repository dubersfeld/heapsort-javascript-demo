"use strict";

var Debugger = function() { };// create  object
  Debugger.log = function(message) {
  try {
    console.log(message);
  } catch(exception) {
    return;
  }
}

function Node(xPos, yPos, value) {// box is a ref to a box
  this.radius = 20; 
  this.xPos = xPos;
  this.yPos = yPos;
  this.value = value;
  this.yConnU = yPos - this.radius;
  this.yConnD = yPos + this.radius;
  this.color = "black";// display color     
}// Node


function canvasSupport() {
  return !!document.createElement('canvas').getContext;
} 


function canvasApp() { 
  var N = 8;// number of nodes
  var randomized = false;// flag
  var heap = null;

  var results = [];// array of arrays
  var swaps = [];// array of arrays
  var outnodes = [];// array of arrays 
 
  var delay = 500;

  function Heap(values) {
    this.level = 0;
    this.values = values;// reference to array
    // arrays for animation
    this.aux = [];
    this.auxSwap = [];
    this.auxOut = [];  
    this.mLength = values.length;
    this.mHeapSize = values.length;// initial heap size

    // methods
    this.left = function(i) {
      return 2 * i + 1;
    };

    this.right = function(i) {
      return 2 * i + 2;
    };

    this.swap = function(i, j) {// swap aux[i] and aux[j], not i an j
      var temp = this.aux[i];
      this.aux[i] = this.aux[j];
      this.aux[j] = temp;

      for (var k = 0; k < this.mLength; k++ ) {
        this.auxSwap[k] = (k == i || k == j) ? 1 : 0;
      }
    };

    this.maxHeapify = function(i) {// non recursive
      var j = i;
      var largest = i;

      while (true) {
        var l = this.left(j);
        var r = this.right(j);

        if ( (l < this.mHeapSize) && (this.values[ this.aux[l] ] > this.values[ this.aux[j] ]) ) {
          largest = l;
        } else {
          largest = j;
        }
        if ( (r < this.mHeapSize) && ( this.values[ this.aux[r] ] > this.values[ this.aux[largest] ]) ) {
          largest = r;
        }

        if (largest == j) {
          break; 
        } else {// one more iteration
          this.swap(j, largest);
          j = largest;
        }

        results.push(this.aux.slice(0));
        swaps.push(this.auxSwap.slice(0));
        outnodes.push(this.auxOut.slice(0));
      }// while
    };// maxHeapify

    this.build = function() {   
      for (var i = Math.floor(this.mLength / 2) - 1; i >= 0; i--) {
        this.maxHeapify(i);
      }
    };// build

    this.heapSort = function() {
      for (var i = this.mLength - 1; i >= 0; i--) {
        this.swap(0, i);

        // main function
        this.mHeapSize--;
        this.maxHeapify(0);

        for (var j = 0; j < this.mLength; j++) {
          this.auxOut[j] = (j >= this.mHeapSize) ? 1 : 0;// mark nodes already outside of the actual heap
        }  

   	// used for animation only
        results.push(this.aux.slice(0));
        swaps.push(this.auxSwap.slice(0));
        outnodes.push(this.auxOut.slice(0));    
      }// for
    };// heapSort
 
    // initialize
    for (var i = 0; i < this.mLength; i++) {
      this.aux.push(i);
      this.auxSwap.push(0);
      this.auxOut.push(0);      
    }// for 

  }// Heap

  var values = [];

  if (!canvasSupport()) {
    alert("canvas not supported");
    return;
  } else {
    var theCanvas = $('#canvas')[0];
    var context = theCanvas.getContext("2d");
  }// if

  var xMin = 0;
  var yMin = 0;
  var xMax = theCanvas.width;
  var yMax = theCanvas.height;

  var radius = 20; 

  var nodes = [];

  var xPos = [];
  var yPos = [];

  function initGeometry() {
    var xPos3 = [30, 107, 184, 261, 338, 415, 492, 569]; 
    var xPos2 = [];
    var xPos1 = [];
    var xPos0 = 300;

    var yPos0 = 200;
    var yPos1 = 300;
    var yPos2 = 400;
    var yPos3 = 500;

    for (var i = 0; i < 4; i++) {
      xPos2.push(Math.floor( (xPos3[2*i] + xPos3[2*i+1])/2 ) );
    }

    for (var i = 0; i < 2; i++) {
      xPos1.push(Math.floor( (xPos2[2*i] + xPos2[2*i+1])/2 ) );
    }

    xPos = xPos.concat(xPos0);
    xPos = xPos.concat(xPos1);
    xPos = xPos.concat(xPos2);
    xPos = xPos.concat(xPos3);
    yPos = yPos.concat(yPos0);

    for (var i = 0; i < 2; i++) {
      yPos = yPos.concat(yPos1);
    }

    for (var i = 0; i < 4; i++) {
      yPos = yPos.concat(yPos2);
    }

    for (var i = 0; i < 8; i++) {
      yPos = yPos.concat(yPos3);
    }
  }// initGeometry


  function fillBackground() {
    // draw background
    context.fillStyle = '#ffffff';
    context.fillRect(xMin, yMin, xMax, yMax);    
  }// fillBackground

  function initValues() {

    var init = [2, 10, 11, 5, 3, 8, 7, 4, 12, 33, 55, 15, 22, 77, 42];

    values.length = 0;// clear values 

    for (var i = 0; i < N; i++) {
      values.push(init[i]);
    }

  }// initValues


  function initNodes() {

    nodes.length = 0;// clear nodes

    for (var i = 0; i < N; i++) {
      nodes.push(new Node(xPos[i], yPos[i], values[i]));
    }
  }// initNodes


  function drawNode(node) {
    context.beginPath();
    context.strokeStyle = node.color;
    context.lineWidth = 5;
    context.arc(node.xPos, node.yPos, node.radius, (Math.PI/180)*0, (Math.PI/180)*360, true); // draw full circle
    context.stroke();
    context.closePath();
    // draw text inside the circle
    context.fillText(node.value, node.xPos, node.yPos);
  }// drawNode


  function drawConnect(node1, node2) {
    context.strokeStyle = "black";
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(node1.xPos, node1.yConnD);
    context.lineTo(node2.xPos, node2.yConnU); // draw line
    context.stroke();
    context.closePath();
  }// drawConnect


  function renderArrayAnim(aux) {

    var spaceX = 40;
    var spaceY = 40;
    var width = N * spaceX;
    var height = spaceY;
    var xa = 10;
    var ya = 50;
    var yb = ya + spaceY;
    var xb = xa + N * spaceX;
    context.strokeStyle = "black";
    context.lineWidth = 5;
 
    context.strokeRect(xa, ya, width, height);

    context.beginPath();
    for (var i = 1; i < N; i++) {
      context.moveTo(xa + i * spaceX, ya);
      context.lineTo(xa + i * spaceX, ya + spaceY); // draw line
    }
    context.stroke();    
    context.closePath();

    var xText = [];
    var yText = ya + height/2;

    for (var i = 0; i < N; i++) {
      xText.push(xa + (i + 0.5) * spaceX);
    }
    
    setTextStyle();

    context.textBaseline = "middle";
    context.textAlign = "center";

    for (var i = 0; i < N; i++) {
      context.fillText(values[ aux[i] ], xText[i], yText);
    }
 
  }// renderArrayAnim
 
  function renderArrayInit() {
    var spaceX = 40;
    var spaceY = 40;
    var width = N * spaceX;
    var height = spaceY;
    var xa = 10;
    var ya = 50;
    var yb = ya + spaceY;
    var xb = xa + N * spaceX;
    context.strokeStyle = "black";
    context.lineWidth = 5;
 
    context.strokeRect(xa, ya, width, height);

    context.beginPath();
    for (var i = 1; i < N; i++) {
      context.moveTo(xa + i * spaceX, ya);
      context.lineTo(xa + i * spaceX, ya + spaceY); // draw line
    }
    context.stroke();    
    context.closePath();

    var xText = [];
    var yText = ya + height/2;

    for (var i = 0; i < N; i++) {
      xText.push(xa + (i + 0.5) * spaceX);
    }
    
    setTextStyle();

    context.textBaseline = "middle";
    context.textAlign = "center";

    for (var i = 0; i < N; i++) {
      context.fillText(values[i], xText[i], yText);
    }
 
  }// renderArray
 
 
  function renderNodes() {
    setTextStyle();

    context.textBaseline = "middle";
    context.textAlign = "center";
    for (var i = 0; i < N; i++) {
      drawNode(nodes[i]);// nodes is array of Node
    }

    for (var i = 0; 2 * i < N - 1; i++) {
      if (2 * i + 1 < N) {
        drawConnect(nodes[i], nodes[2*i+1]);
      }
      if (2 * i + 2 < N) {
        drawConnect(nodes[i], nodes[2*i+2]);
      }
    }
  }// renderNodes

  function renderNodesInit() {
   
    setTextStyle();

    context.textBaseline = "middle";
    context.textAlign = "center";
    for (var i = 0; i < N; i++) {
      drawNode(nodes[i]);
    }

    for (var i = 0; 2 * i < N - 1; i++) {
      if (2 * i + 1 < N) {
        drawConnect(nodes[i], nodes[2*i+1]);
      }
      if (2 * i + 2 < N) {
        drawConnect(nodes[i], nodes[2*i+2]);
      }
    }
  }// renderNodesInit

  function updateNodesAnim(aux, swap, auxOut) {    
    // set node values
    for (var i = 0; i < N; i++) {
      nodes[i].value = values[ aux[i] ];
    }

    // mark swapped nodes
    for (var i = 0; i < N; i++) {
      nodes[i].color = swap[i] ? "blue" : "black" ;
    }

    // mark nodes outside the actual heap
    for (var i = 0; i < N; i++) {
      if (auxOut[i]) {
        nodes[i].color = "darkGray";
      }
    }

  }// updateNodesAnim


  function renderAnim(aux) {
     
    fillBackground();
  
    renderNodes();
    renderArrayAnim(aux);

  }// renderAnim


  function changeNumber(e) {  
    var numbers = e.target.elements["number"]; 
    var k;
    for (k = 0; k < numbers.length; k++) {
      if (numbers[k].checked) break;
    }// for

    N = numbers[k].value;

    // new initialization
    randomized = false;
    init();
    
  }// changeNumber

  
  function init() {
    // reset animation arrays
    results.length = 0; 
    swaps.length = 0;
    outnodes.length = 0;

    if (!randomized) {
      initValues();
    }

    initNodes();
    fillBackground();
    renderNodesInit();
    renderArrayInit();

    heap = null;// reset
    heap = new Heap(values);
    heap.build();
    heap.heapSort();

    $('#stanim').find(':submit')[0].disabled = false;
    $('#initelem').find(':submit')[0].disabled = false;
    $('#numel').find(':submit')[0].disabled = false;
  
  }// init


  function randomize() {
  
    values.length = 0;// clear values 
    var val;
    var more;

    for (var i = 0; i < N; i++) {
      more = true;// flag
      while(more) {
        more = false;
        val = Math.floor(Math.random() * 98 + 2);
        for (var j = 0; j < values.length; j++) {
          if (val == values[j]) {
            more = true;// break for
            break;
          } 
        }           
      }
      values.push(val);    
    }

    randomized = true;
    init();
  }// randomize


  function animSpeedChanged(e) {

    console.log(e.target.value);
    delay = 1e4 / e.target.value;

  }// animSpeedChanged


  // add all event listeners

  $('#numel').submit(function(event) { changeNumber(event); return false } );

  $('#stanim').submit(function(event) { 
			startAnim(); 
			$('#stanim').find(':submit')[0].disabled = true; 
			$('#initelem').find(':submit')[0].disabled = true; 
			$('#numel').find(':submit')[0].disabled = true; 
			return false; });

  $('#initelem').submit(function(event) { randomize(); return false; });

  $('#animSpeed').change(function(event) { animSpeedChanged(event); return false; });

  initGeometry();

  init();


  function setTextStyle() {
    context.fillStyle    = '#000000';
    context.font         = '15px _sans';
  }

 
  function startAnim() {
  
    // initialize
    var iAnim = 0;
    var tempAux = [];

    for (var i = 0; i < values.length; i++) {
      tempAux.push(i);
    } 

    function act() {
      // immediately set values and colors
      updateNodesAnim(tempAux, swaps[iAnim], outnodes[iAnim]);
      renderAnim(tempAux);

     
				        
      // delayed
      tempAux = results[iAnim];
      setTimeout(function() {  
        updateNodesAnim(tempAux, swaps[iAnim], outnodes[iAnim]); 
        renderAnim(tempAux); 
      }, delay);

      // schedule next step
      if (iAnim < results.length-1) {
        iAnim++;
        setTimeout(act, 2 * delay);
      } else {// animation completed
        $('#stanim').find(':submit')[0].disabled = false;
        $('#initelem').find(':submit')[0].disabled = false;
        $('#numel').find(':submit')[0].disabled = false;
      }
    }// act

    window.location.hash = "#animanc";

    act();

  }// startAnim

}// canvasApp


function eventWindowLoaded() {
  canvasApp();
}// canvasApp

$(document).ready(eventWindowLoaded);
