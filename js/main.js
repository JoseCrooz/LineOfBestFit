$(document).ready(function() {
  var known_y = [];
  var known_x = [];
  var pointItems = [];
  var pointCount = 0;
  var num = "";
  var point = [];
  var canvas = document.getElementsByTagName('canvas')[0];
  var context = canvas.getContext("2d");
	var gridSize = 100;
	var w = 480;
  var h = 480;
	var graphIsActive = false;
	var buildingPoint = false;
	var editingPoint = false;
	var deleteBtnActive = false;
	var editPointNum;
	var editCoord;
	var xy;
  
  function init(){
    initGrid();
    setupListeners();
		K.eypad.init();
  }
  
  /*
	 * INITIALIZE GRID
	 */
  function initGrid(){
		var spacing = 20;
		var startX;
		var startY;
		var xtickNum;
		var ytickNum;
		var count = (w/spacing)/2;
    
    context.strokeStyle = "#999";
    context.beginPath();            
    context.lineWidth = 1;
    
    for (var x = 0; x <= w+1; x +=spacing) {
      context.moveTo(0.5 + x, 0);
      context.lineTo(0.5 + x, w);
    }
    
    for (var x = 0; x <= w+1; x +=spacing) {
      context.moveTo(0, 0.5 + x);
      context.lineTo(w, 0.5 + x);
    }
			
    context.stroke();
		
		context.beginPath();
		context.strokeStyle = "#000";
		context.fillStyle = "#000";
		for (var x = 0; x <= w+1; x +=spacing) {
			xtickNum = (w/2) - x;
			count--;
			startX = (w/2)-(spacing/2);
      context.moveTo(startX, 0.5+x);
      context.lineTo(startX+spacing, 0.5+x);
			if(xtickNum != 0){
				context.font = 'bold 7pt Arial';
				context.fillText(xtickNum, startX+spacing+3, 3+x);
			}
    }
		context.stroke();
		
		context.beginPath();
		context.strokeStyle = "#000";
		context.fillStyle = "#000";
		for (var x = 0; x <= w+1; x +=spacing) {
			ytickNum = ((w/2) - x)*-1;
			startY = (w/2)-(spacing/2);
      context.moveTo(0.5+x, startY);
      context.lineTo(0.5+x, startY+spacing);
			if(ytickNum != 0){
				context.font = 'bold 7pt Arial';
				context.fillText(ytickNum, x-5, startY+spacing+4);
			}
    }
		context.stroke();
			
    context.beginPath();
    context.moveTo(0.5 + (w/2), 0);
    context.lineTo(0.5 + (w/2), w);
    context.lineWidth = 3;
    context.strokeStyle = "black";
    context.stroke();
    
    context.beginPath();
    context.moveTo(0, 0.5 + (w/2));
    context.lineTo(w, 0.5 + (w/2));
    context.lineWidth = 3;
    context.strokeStyle = "black";
    context.stroke();    
  }
	
	/*
	 * REDRAW CANVAS
	 */
	function redrawCanvas() {
		//
	}
  
  /*
	 * LISTENERS SETUP
	 */
  function setupListeners(){
		$(".keypadBtn").on( "tap", function(event){
    //$('.keypadBtn').click(function(e){
			if(buildingPoint){
				if($(this).attr('data-value') != 'del' && $(this).attr('data-value') != 'enter'){
					num += $(this).attr('data-value');
					if(point.length == 0)$("#point"+pointCount+"-x").html(num);
					if(point.length == 1)$("#point"+pointCount+"-y").html(num);
				}
				
				if($(this).attr('data-value') == 'del'){
					num = '';
				}
				
				if($(this).attr('data-value') == 'enter'){
					point.push(num);
					num = '';
					
					if(point.length == 2){
						$("#deleteBtn"+pointCount).toggleClass("deleteHide");
						known_x.push(Number(point[0]));
						known_y.push(Number(point[1]));
						plotPoint(point);
						pointCount++;	
						point.length = 0;
						buildingPoint = false;
						if(!graphIsActive)graphIsActive = true;
					}
				}
			}
			if(editingPoint){
				if($(this).attr('data-value') != 'del' && $(this).attr('data-value') != 'enter'){
					num += $(this).attr('data-value');
					$(editCoord).html(num);
				}
				
				if($(this).attr('data-value') == 'enter'){
					if (xy === 'x')known_x[editPointNum] = Number(num);
					else if (xy === 'y')known_y[editPointNum] = Number(num);
					
					num = '';
					$(editCoord).toggleClass("highlight");
					$("#deleteBtn"+editPointNum).toggleClass("deleteHide");
					
					editingPoint = false;
				}
			}
    });
		
		// BEGIN NEW POINT
		$('#newPointButton').click(function(){
			if(!buildingPoint){
				buildingPoint = true;
				
				var newPointRow = create('<div class="point-item clearfix" id="point'+pointCount+'"><div id="deleteBtn'+pointCount+'" class="deleteBtn">x</div><div class="vert"></div><div class="coord"><span id="point'+pointCount+'-x" class="coord-num" data-id="'+pointCount+'"></span></div><div class="coord"><span id="point'+pointCount+'-y" class="coord-num" data-id="'+pointCount+'"></span></div></div>');
				$("#pointsHolder").append(newPointRow);
				
				initNewPointRow(pointCount);
			}
		});
    
		// UPDATE GRAPH
    $('#updateGraphButton').click(function(){
			if(pointCount > 1){
				var lrLength = findLine(known_x, known_y)[0].length;
				var intercept = roundTo(linearRegression(known_y, known_x).intercept,3);
				var slope = roundTo(linearRegression(known_y, known_x).slope,2);
				var r = roundTo(linearRegression(known_y, known_x).r2,3);
				var fl = findLine(known_x, known_y);
				
				console.log(linearRegression(known_y, known_x));
				console.log(findLine(known_x, known_y));
				
				var yAnswer = create('<div class="answer">y = '+slope+'x + '+intercept+'</div>');
				$("#answerHolder").append(yAnswer);
				
				var rAnswer = create('<div class="answer">r = '+r+'</div>');
				$("#answerHolder").append(rAnswer);
				
				for(var i = 0; i < lrLength-1; i++){
					var xPlot1 = fl[0][i];
					var yPlot1 = fl[1][i];
					var xPlot2 = fl[0][i+1];
					var yPlot2 = fl[1][i+1];
					
					if(Number(yPlot1) >= 0)yPlot1 = eval((w/2) - yPlot1);
					else if(Number(yPlot1) < 0)yPlot1 = eval((w/2) - yPlot1);
					
					if (Number(xPlot1) >= 0)xPlot1 = eval((w/2) + xPlot1);
					else if(Number(xPlot1) < 0)xPlot1 = eval((w/2) + xPlot1);
					
					if(Number(yPlot2) >= 0)yPlot2 = eval((w/2) - yPlot2);
					else if(Number(yPlot2) < 0)yPlot2 = eval((w/2) - yPlot2);
					
					if (Number(xPlot2) >= 0)xPlot2 = eval((w/2) + xPlot2);
					else if(Number(xPlot2) < 0)xPlot2 = eval((w/2) + xPlot2);
					
					context.beginPath();
					context.moveTo(xPlot1, yPlot1);
					context.lineTo(xPlot2, yPlot2);
					context.lineWidth = 3;
					context.strokeStyle = "#309943";
					context.stroke();	
				}
			}
    });
    
		// RESET EVERYTHING
    $('#resetButton').click(function(){
			if(graphIsActive){
				$("#pointsHolder").empty();
				$("#answerHolder").empty();
				known_y.length = 0;
				known_x.length = 0;
				pointItems.length = 0;
				pointCount = 0;
				num = "";
				point.length = 0;
				context.clearRect(0, 0, canvas.width, canvas.height);
				initGrid();
			}
    });
  }
	
	/*
	 * INITIALIZE NEW POINT
	 */
	function initNewPointRow(n) {
		toggleDelete(n);
		
		$("#point"+n+"-x").click(function(e){
			if (!editingPoint){
				editCoord = '#point'+n+'-x';
				xy = 'x';
				editingPoint = true;
				editPointNum = $(this).attr('data-id');
				$("#deleteBtn"+n).toggleClass("deleteHide");
				$(this).toggleClass("highlight");
				toggleDelete(editPointNum);
			}
		});
		
		$("#point"+n+"-y").click(function(e){
			if (!editingPoint){
				editCoord = '#point'+n+'-y';
				xy = 'y';
				editingPoint = true;
				editPointNum = $(this).attr('data-id');
				$("#deleteBtn"+n).toggleClass("deleteHide");
				$(this).toggleClass("highlight");
				toggleDelete(editPointNum);
			}
		});
	}
	
	function toggleDelete(n) {
		deleteBtnActive = true;
		
		$("#deleteBtn"+n).on( "tap", function(event){
			$('#point'+n).remove();
			if (buildingPoint) {
				buildingPoint = false;
			}
			if(editingPoint){
				var index = known_y.indexOf(known_y[n]);
				known_y.splice(index,1);
				known_x.splice(index,1);	
				editingPoint = false;
			}
			$("#deleteBtn"+n).toggleClass("deleteHide");
		});	
	}
  
  /*
	 * CREATE HTML ELEMENT
	 */
  function create(htmlStr) {
    var frag = document.createDocumentFragment(),
	temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
	frag.appendChild(temp.firstChild);
    }
    return frag;
  }
  
  /*
	 * PLOT POINT
	 */ 
  function plotPoint(p){
    var canvas = document.getElementsByTagName('canvas')[0];
    var context = canvas.getContext("2d");
    var w = 480;
    var h = 480;
    var numX = eval(Number(p[0]));
    var numY = eval(Number(p[1]));
    var xPlot = eval(Number(numX));
    var yPlot = eval(Number(numY));
    
    if(Number(numY) >= 0){
      yPlot = eval((w/2) - numY);
    } 
    else if(Number(numY) < 0){
      yPlot = eval((w/2) - numY);
    }
    
    if (Number(numX) >= 0){
      xPlot = eval((w/2) + numX);
    } 
    else if(Number(numX) < 0){
      xPlot = eval((w/2) + numX);
    }
    
    context.fillStyle = "#ff0000";
    context.beginPath();
    context.arc(xPlot, yPlot, 4, 0, Math.PI * 2, true);
    context.fill();
  }
  
  /*
	 * LINEAR REGRESSION METHODS
	 */
	
	// gets answers
  function linearRegression(y,x){
    var lr = {};
    var n = y.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;
    
    for (var i = 0; i < y.length; i++) {
      sum_x += x[i];
      sum_y += y[i];
      sum_xy += (x[i]*y[i]);
      sum_xx += (x[i]*x[i]);
      sum_yy += (y[i]*y[i]);
    } 
    
    lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
    lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);
    
    return lr;
  }
  
	// gets line
  function findLine(values_x, values_y) {
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var count = 0;
    
    /*
     * We'll use those variables for faster read/write access.
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;
    if (values_length != values_y.length) {
      throw new Error('The parameters values_x and values_y need to have same size!');
    }
    
    /*
     * Nothing to do.
     */
    if (values_length === 0) {
      return [ [], [] ];
    }
    
    /*
     * Calculate the sum for each of the parts necessary.
     */
    for (var v = 0; v < values_length; v++) {
			x = values_x[v];
			y = values_y[v];
			sum_x += x;
			sum_y += y;
			sum_xx += x*x;
			sum_xy += x*y;
			count++;
		}
    
    /*
     * Calculate m and b for the formular:
     * y = x * m + b
     */
    var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
    var b = (sum_y/count) - (m*sum_x)/count;
    
    /*
     * We will make the x and y result line now
     */
    var result_values_x = [];
    var result_values_y = [];
    
    for (var v = 0; v < values_length; v++) {
			x = values_x[v];
			y = x * m + b;
			result_values_x.push(x);
			result_values_y.push(y);
    }
    
    return [result_values_x, result_values_y];
  }
  
  /*
	 * UTILS
	 */
  function roundTo(number, length) {
		return Math.round(number*Math.pow(10,length))/Math.pow(10,length);
    //return Math.round(number/to)*to;
	}
	
  function isTouchDevice(){
		return (window.ontouchstart !== undefined);
	}
	
  init();
});