function Graph(a) {
  var _this = this;
  var app = a;
  var graphIsActive = false;
  var canvas;
  var context;
  var w = 400;
  var h = 400;
  var spacing = 40;
  var padding = 40;
  var shim = 0;
  var maxNum = {};
  var ratio;
  var squareWidth;
  var pointContainer = [];
  var pointsTotal;
  var pointHasChanged = false;
  var problemSolved = false;
  var imagesLoaded = 0;
  var onlyPositive = true;
  
  this.init = function() {
    canvas = document.getElementById('graph');
    context = canvas.getContext("2d");
    context.translate(0.5,0.5);
    
    this.initListeners();
    this.drawGraph();
  }
  
  /* 
   * Draws the graph
   */
  this.drawGraph = function(){
    if(!graphIsActive){
      maxNum.original = 10;
      maxNum.update = 10;
      graphIsActive = true;
    }
    
    ratio = (w/2)/maxNum.update;
    
    // draw lines
    context.strokeStyle = "#ccc";
    context.beginPath();            
    context.lineWidth = 1;
    
    // draw vertical lines
    for (var x = 0; x <= w+1; x +=spacing) {
      context.moveTo(padding + x, 0+padding);
      context.lineTo(padding + x, w+padding);
    }
    
    // draw horizontal lines
    for (var x = 0; x <= w+1; x +=spacing) {
      context.moveTo(0+padding, x +padding);
      context.lineTo(w+padding, x +padding);
    }
    context.stroke();
    
    this.drawAxis();
    
    // plot points if there are points
    if(pointContainer.length >= 1){
      pointsTotal = pointContainer.length;
      for(var i = 0; i < pointsTotal; i++){
        this.plotPoint([pointContainer[i].x, pointContainer[i].y]);
      }
    }
  }
  
  this.drawAxis = function(){
    // draw labels and tick marks
    var xLabelNum = 0;
    var yLabelNum = 0;
    var yLabelMargin = 30;
    
    if (onlyPositive) {
      var x0 = spacing;	//origin x
      var y0 = h + spacing;	//origin y
      var y1 = 0 + 10;	//y axis end
      var x1 = w + spacing*2 - 10;	//x axis end
      var axisArrowSize = 18;
      var axisExtension = 24;
      var axisColor = "#000";
      var axisStroke = 3;
      this.lineWithArrowhead(context, x0, y0, x1, y0, Math.PI/10, axisArrowSize, axisColor, axisStroke);
      this.lineWithArrowhead(context, x0, y0, x0, y1, Math.PI/10, axisArrowSize, axisColor, axisStroke);
      
      context.beginPath();
      context.strokeStyle = "#000";
      context.fillStyle = "#000";
      context.font = '12pt Times New Roman';
      context.fillText('y', spacing + 10, 20);
      context.fillText('x', w + spacing + 20, w + 55);
      context.stroke();
      
      // x and y axis ticks and labels
      context.strokeStyle = "#000";
      context.fillStyle = "#000";
      context.lineWidth = 1;
      context.font = '10pt Times New Roman';
      context.textAlign = "right";
      
      // y
      for (var x = spacing; x <= w; x += spacing) {
        context.moveTo(spacing - 9, x);
        context.lineTo(spacing + 10, x);
        yLabelNum += Math.round(maxNum.update/10);
        context.fillText(yLabelNum, spacing - 15, w - x + spacing + 5);
        
      }
      
      // x
      context.textAlign = "center";
      for (var x = spacing*2; x <= w + spacing; x += spacing) {
        context.moveTo(x, w+spacing-10);
        context.lineTo(x, w+spacing+10);
        xLabelNum += Math.round(maxNum.update/10);
        context.fillText(xLabelNum, x, w + spacing + 25);
      }
      
      context.stroke();  
    }
    else{
      var x0 = w/2 +spacing;	//origin x
      var y0 = w/2 + spacing;	//origin y
      var y1 = 0 + 10;	//y axis end
      var x1 = w + spacing*2 - 10;	//x axis end
      var axisArrowSize = 18;
      var axisExtension = 24;
      var axisColor = "#000";
      var axisStroke = 3;
      this.lineWithArrowhead(context, x0, y0, x1, y0, Math.PI/10, axisArrowSize, axisColor, axisStroke);
      this.lineWithArrowhead(context, x0, y0, x0, y1, Math.PI/10, axisArrowSize, axisColor, axisStroke);
      
      xLabelNum = maxNum.update;
      yLabelNum = maxNum.update;
      
      // vertical line
      context.beginPath();
      context.moveTo(w/2 + spacing + 0.5, spacing);
      context.lineTo(w/2 + spacing + 0.5, w + spacing + 0.5);
      context.lineWidth = 3;
      context.strokeStyle = "black";
      context.stroke();
      
      // horizontal line
      context.beginPath();
      context.moveTo(spacing, w/2 + spacing + 0.5);
      context.lineTo(w + spacing, w/2 + spacing + 0.5);
      context.lineWidth = 3;
      context.strokeStyle = "black";
      context.stroke();
      
      context.beginPath();
      context.strokeStyle = "#000";
      context.fillStyle = "#000";
      context.font = '10pt Times New Roman';
      context.fillText('y', w/2 + spacing + 10, 20);
      context.fillText('x', w + spacing + 20, w/2 + 55);
      context.stroke();
      
      // x and y axis ticks and labels
      context.beginPath();
      context.strokeStyle = "#000";
      context.fillStyle = "#000";
      context.lineWidth = 1;
      context.font = '10pt Times New Roman';
      context.textAlign = "left";
      
      // y
      for (var x = spacing; x <= w + spacing; x += spacing) {
        context.moveTo(w/2 + spacing - 10, x);
        context.lineTo(w/2 + spacing + 10, x);
        if(yLabelNum != 0)context.fillText(yLabelNum, w/2 + spacing + 20, x + 3);
        yLabelNum -= maxNum.update/5;
      }
      
      // x
      context.textAlign = "center";
      for (var x = spacing; x <= w + spacing; x += spacing) {
        context.moveTo(x, w/2 +spacing-10);
        context.lineTo(x, w/2 +spacing+10);
        if(xLabelNum != 0)context.fillText(xLabelNum*-1, 0 + x, w/2 + spacing + 25);
        xLabelNum -= maxNum.update/5;
      }
      context.stroke();
    }
  }

  this.lineWithArrowhead = function(ctx, x0, y0, x1, y1, angle, d, style, stroke) {
    //find angle of line
    var lineangle = Math.atan2(y1-y0, x1-x0);
    //find length of sides of arrowhead
    var h = Math.abs(d/Math.cos(angle));
  
    var angle1 = lineangle+Math.PI+angle;
    var topx = x1 + Math.cos(angle1)*h;
    var topy = y1 + Math.sin(angle1)*h;
    var angle2 = lineangle + Math.PI - angle;
    var botx = x1 + Math.cos(angle2)*h;
    var boty = y1 + Math.sin(angle2)*h;
    var midx = (topx + botx) / 2;
    var midy = (topy + boty) / 2;
    var centerx = (midx + x1) / 2;
    var centery = (midy + y1) / 2;
    var notchx = (midx + centerx) / 2;
    var notchy = (midy + centery) / 2;
  
    //draw line
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(centerx, centery);
  
    context.strokeStyle = style;
    context.lineWidth = stroke;
    context.stroke();
    
    //draw arrowhead
    context.moveTo(topx, topy);
    context.quadraticCurveTo(centerx, centery, x1, y1);
    context.quadraticCurveTo(centerx, centery, botx, boty);
    context.quadraticCurveTo(notchx, notchy, topx, topy);
  
    context.lineCap = "round";
    //ctx.lineJoin = "miter";
    context.lineWidth = 1;
    context.stroke();
    
    context.fillStyle = style;
    context.fill();
  }
  
  /*
   * Solves for line of best fit
   */
  this.solve = function(){
    problemSolved = true;
    
    // answer vars
    var answers = _this.getAnswer();
    var intercept = _this.roundTo(answers.intercept,2);
    var slope = _this.roundTo(answers.slope,2);
    var cc = _this.roundTo(answers.r2,3);
    var x1, x2, y1, y2;
    var decimal = slope.toString();
    var decimalArray = decimal.split(".");
    var ratio = 1/(maxNum.update/w);
    // line vars
    var lrLength = _this.getLine()[0].length;
    var fl = _this.getLine();
    
    if (onlyPositive) _this.drawOneLine(answers);
    else _this.drawTwoLines(answers);
  }
  
  this.drawOneLine = function(a){
    var answers = a,
        data,
        rise,
        run,
        riseRatio,
        runRatio,
        slope = this.roundTo(answers.slope,2),
        yIntercept = this.roundTo(answers.intercept,2),
        _yIntercept = 0,
        xIntercept = 0,
        edgeLimit = maxNum.update,
        decimal = slope.toString(),
        decimalArray = decimal.split("."),
        leftDecimalPart = 0,
        rightDecimalPart = 0,
        numerator = 0,
        denominator = 0,
        factor = 0,
        ratio = 1/(maxNum.update/w),
        yDiff,
        xDiff,
        isRising = true,
        x1,y1,x2,y2,
        fe;
        
    if(decimalArray.length > 1){
      leftDecimalPart = decimalArray[0];
      rightDecimalPart = decimalArray[1];
      numerator = leftDecimalPart + rightDecimalPart
      denominator = Math.pow(10,rightDecimalPart.length);
      factor = highestCommonFactor(numerator, denominator);
      denominator /= factor;
      numerator /= factor;
      
      if (denominator < 0) denominator = denominator * -1;
      if (numerator < 0) numerator = numerator * -1;
    }
    
    if (decimalArray.length <= 1) {
      if (slope < 0) numerator = -(slope);
      else numerator = slope;
      denominator = 1;
    }
    
    if (slope < 0) isRising = false;
    else isRising = true;
    
    if (yIntercept < 0 || yIntercept > edgeLimit) {
      var intObj = {rise: 0,
                    run: 0,
                    yIntercept: yIntercept,
                    numerator: numerator,
                    denominator: denominator,
                    find: 'intercept'};
      fe = this.findEdge(intObj);
      
      yIntercept = fe.yInt;
      _yIntercept = yIntercept;
      xIntercept = fe.xInt;
      yDiff = 10;
    }
    else {
      if (isRising) yDiff = edgeLimit - yIntercept;
      else if (!isRising) yDiff = yIntercept;
    }
    
    if (yDiff > numerator) riseRatio = 1/(numerator / yDiff);
    else if (yDiff < numerator) riseRatio = 1/(yDiff / numerator);
    else if (yDiff == numerator) riseRatio = 1;
    
    if (isRising) rise = yIntercept + (numerator * riseRatio);
    else rise = -(yIntercept) + (numerator * riseRatio);
    run = xIntercept + (denominator * riseRatio);
    
    if (rise > edgeLimit || run > edgeLimit) {
      data = {rise: rise,
              run: run,
              yIntercept: yIntercept,
              numerator: numerator,
              denominator: denominator,
              isRising: isRising,
              find: 'rr'};
      fe = this.findEdge(data);
      rise = fe.rise;
      run = fe.run;
    }
    
    if (slope == 0 && yIntercept == 0) {
      console.log(pointContainer);
      xIntercept = pointContainer[0].x;
      yIntercept = 0;
      rise = edgeLimit;
      run = xIntercept;
    }
    else if (slope == 0 && yIntercept != 0) {
      xIntercept = 0;
      yIntercept = pointContainer[0].y;
      rise = yIntercept;
      run = edgeLimit;
    }
    
    console.log('|-------------------');
    console.log('RISE: '+rise);
    console.log('RUN: '+run);
    console.log('RISE RATIO: '+riseRatio);
    console.log('yIntercept: '+yIntercept);
    console.log('yDiff: '+yDiff);
    console.log('NUMERATOR: '+numerator);
    console.log('DENOMINATOR: '+denominator);
    console.log('-------------------|');
    
    x1 = (0 + spacing) + xIntercept*ratio;
    y1 = (h + spacing) - yIntercept*ratio;
    x2 = (0 + spacing) + run*ratio;
    if (isRising) y2 = (h + spacing) - (rise*ratio);
    else if (!isRising) y2 = (h + spacing) - (rise*ratio); 
    
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineWidth = 3;
    context.strokeStyle = "#4c4c4c";
    context.stroke(); 
  }
  
  this.findEdge = function(d){
    var data = d,
        obj = {},
        rise = data.rise,
        run = data.run,
        yIntercept = data.yIntercept,
        numerator = data.numerator,
        denominator = data.denominator,
        isRising = data.isRising,
        edgeLimit = maxNum.update,
        diff,
        ratio,
        findRR = false,
        findIntercept = false;
        
    if (data.find == 'rr') findRR = true;
    else if (data.find == 'intercept') findIntercept = true;
    
    if (findRR) {
      if (!isRising) {
        diff = rise;
        
        if (diff > numerator) ratio = 1/(numerator / diff);
        else if (diff < numerator) ratio = diff / numerator;
        
        //rise -= numerator * ratio;
        rise = 0;
        run -= denominator * ratio;
      }
      else {
        if (rise > run) {
          diff = rise - edgeLimit;
          
          if (diff > numerator) ratio = 1/(numerator / diff);
          else if (diff < numerator) ratio = diff / numerator;
          
          rise -= numerator * ratio;
          run -= denominator * ratio;
        }
        else if (rise < run) {
          diff = run - edgeLimit;
          
          if (diff > denominator) ratio = 1/(denominator / diff);
          else if (diff < denominator) ratio = diff / denominator;
          
          if (!isRising) rise += numerator * ratio;
          else rise -= numerator * ratio;
          //rise -= numerator * ratio;
          run -= denominator * ratio;
        } 
      }
      
      obj['rise'] = rise;
      obj['run'] = run;  
    }
    
    if (findIntercept) {
      var yInt, xInt;
      
      diff = yIntercept;
      if (yIntercept < 0) diff = -(diff);
      else if (yIntercept > edgeLimit) diff = diff - edgeLimit;
      
      if (diff > numerator) ratio = 1/(numerator / diff);
      else if (diff < numerator) ratio = diff / numerator;
      else if (diff == numerator) ratio = 1;
      
      xInt = denominator * ratio;
      
      if (yIntercept < 0) yInt = 0;
      else if (yIntercept > edgeLimit) yInt = edgeLimit;
      console.log(xInt);
      obj['yInt'] = yInt;
      obj['xInt'] = xInt;
    }
    
    return obj;
  }
  
  // need to refactor
  this.drawTwoLines = function(a){
    var data = {};
    var answers = a;
    var intercept = this.roundTo(answers.intercept,2);
    var slope = this.roundTo(answers.slope,2);
    var x1, x2, y1, y2;
    var a1, a2, b2, b2;
    var decimal = slope.toString();
    var decimalArray = decimal.split(".");
    var leftDecimalPart = 0;
    var rightDecimalPart = 0;
    var numerator = 0;
    var denominator = 0;
    var factor = 0;
    var rise;
    var riseHeight;
    var run;
    var runWidth;
    var riseAmount;
    var runAmount;
    var xintercept = 0;
    var riseRatio;
    var runRatio;
    var ratio = 1/(maxNum.update/w);
    var diff;
    var _intercept;
    var leftRise, rightRise;
    var slopeIsNegative = false;
    var line1Active = true;
    var line2Active = true;
    var vertical = false;
    var horizontal = false;
    
    if(decimalArray.length > 1){
      leftDecimalPart = decimalArray[0];
      rightDecimalPart = decimalArray[1];
      numerator = leftDecimalPart + rightDecimalPart
      denominator = Math.pow(10,rightDecimalPart.length);
      factor = highestCommonFactor(numerator, denominator);
      denominator /= factor;
      numerator /= factor;
      
      if (denominator < 0) denominator = denominator * -1;
      if (numerator < 0) numerator = numerator * -1;
    }
    
    if (decimalArray.length <= 1) {
      if (slope < 0) numerator = -(slope);
      else numerator = slope;
      denominator = 1;
    }
    
    riseAmount = maxNum.update;
    
    _intercept = intercept;
    
    if (slope < 0) slopeIsNegative = true;
    else slopeIsNegative = false;
    
    
    if (intercept < 0 && intercept > -(maxNum.update)) {
      var startNum;
      if (slopeIsNegative) {
        console.log('SLOPE IS NEGATIVE');
        startNum = intercept + 10;
        
        if (startNum < numerator) riseAmount = startNum / numerator;
        else if (startNum > numerator) riseAmount = 1/(numerator / startNum);
        
        riseA = -(intercept) + (riseAmount * numerator);
        runA = denominator * riseAmount;
        
        if(runA > maxNum.update){
          diff = runA - maxNum.update;
          
          if (diff > denominator) runAmount = 1/(denominator / diff);
          else runAmount = diff / denominator;
          
          riseA -= numerator * runAmount;
          runA -= denominator * runAmount;
        }
        
        runAmount = maxNum.update / denominator
        
        riseB = intercept + (runAmount * numerator);
        runB = denominator * runAmount;
        
        if(riseB > maxNum.update){
          diff = riseB - maxNum.update;
          
          if (diff > numerator) riseAmount = 1/(numerator / diff);
          else riseAmount = diff / numerator;
          
          riseB -= numerator * riseAmount;
          runB -= denominator * riseAmount;
        }
      }
      else {
        console.log('SLOPE IS POSITIVE');
        startNum = intercept + 10;
        
        runAmount = maxNum.update / denominator
        
        riseA = (runAmount * numerator) + intercept;
        runA = denominator * runAmount;
        
        if(riseA > maxNum.update){
          diff = riseA - maxNum.update;
          
          if (diff > numerator) riseAmount = 1/(numerator / diff);
          else riseAmount = diff / numerator;
          
          riseA -= numerator * riseAmount;
          runA -= denominator * riseAmount;
        }
        
        if (startNum < numerator) riseAmount = startNum / numerator;
        else if (startNum > numerator) riseAmount = 1/(numerator / startNum);
        
        riseB = -(intercept) + (riseAmount * numerator);
        runB = denominator * riseAmount;
        
        if(runB > maxNum.update){
          diff = runB - maxNum.update;
          
          if (diff > denominator) runAmount = 1/(denominator / diff);
          else runAmount = diff / denominator;
          
          riseB -= numerator * runAmount;
          runB -= denominator * runAmount;
        }
      }
      
      line1Active = true;
      line2Active = true;
    }
    else if (intercept > 0 && intercept < maxNum.update) {
      var startNum;
      if (slopeIsNegative) {
        console.log('SLOPE IS NEGATIVE');
        startNum = intercept + 10;
        
        if (startNum < numerator) riseAmount = startNum / numerator;
        else if (startNum > numerator) riseAmount = 1/(numerator / startNum);
        
        riseA = -(intercept) + (riseAmount * numerator);
        runA = denominator * riseAmount;
        
        if(runA > maxNum.update){
          diff = runA - maxNum.update;
          
          if (diff > denominator) runAmount = 1/(denominator / diff);
          else runAmount = diff / denominator;
          
          riseA -= numerator * runAmount;
          runA -= denominator * runAmount;
        }
        
        runAmount = maxNum.update / denominator
        
        riseB = intercept + (runAmount * numerator);
        runB = denominator * runAmount;
        
        if(riseB > maxNum.update){
          diff = riseB - maxNum.update;
          
          if (diff > numerator) riseAmount = 1/(numerator / diff);
          else riseAmount = diff / numerator;
          
          riseB -= numerator * riseAmount;
          runB -= denominator * riseAmount;
        }
      }
      else {
        console.log('SLOPE IS POSITIVE');
        if(slope == 0) {
          riseA = intercept;
          runA = maxNum.update;
          riseB = -(intercept);
          runB = maxNum.update;
        }
        else {
          startNum = intercept + 10;
         
          runAmount = maxNum.update / denominator
          
          riseA = (runAmount * numerator) + intercept;
          runA = denominator * runAmount;
          
          if(riseA > maxNum.update){
            diff = riseA - maxNum.update;
            
            if (diff > numerator) riseAmount = 1/(numerator / diff);
            else riseAmount = diff / numerator;
            
            riseA -= numerator * riseAmount;
            runA -= denominator * riseAmount;
          }
          
          if (startNum < numerator) riseAmount = startNum / numerator;
          else if (startNum > numerator) riseAmount = 1/(numerator / startNum);
          
          riseB = -(intercept) + (riseAmount * numerator);
          runB = denominator * riseAmount;
          
          if(runB > maxNum.update){
            diff = runB - maxNum.update;
            
            if (diff > denominator) runAmount = 1/(denominator / diff);
            else runAmount = diff / denominator;
            
            riseB -= numerator * runAmount;
            runB -= denominator * runAmount;
          }
        }
      }
      line1Active = true;
      line2Active = true;
    }
    else if (intercept < -(maxNum.update)) {
      if (slope < 0) {
        var startNum = maxNum.update;
        diff = -(intercept) - startNum;
        
        if(diff > numerator) riseAmount = 1/(numerator / diff);
        else if(diff < numerator) riseAmount = diff / numerator;
        
        xintercept = -(denominator * riseAmount);
        
        startNum = xintercept + maxNum.update;
        
        if(startNum > denominator) runAmount = 1/(denominator / startNum);
        else if(startNum < denominator) runAmount = startNum / denominator;
        
        riseA = maxNum.update - (numerator * runAmount);
        runA = -(denominator * runAmount) + xintercept;
        riseB = maxNum.update - (numerator * runAmount);
        runB = -(denominator * runAmount) + xintercept;
        
        intercept = -(maxNum.update); 
      }
      else {
        line1Active = false;
        line2Active = false;
      }
    }
    else if (intercept > maxNum.update) {
      if (!slopeIsNegative) {
        line1Active = false;
        
        var startNum = maxNum.update;
        diff = intercept - startNum;
        
        if(diff > numerator) riseAmount = 1/(numerator / diff);
        else if(diff < numerator) riseAmount = diff / numerator;
        
        xintercept = (denominator * riseAmount);
        
        startNum = maxNum.update - xintercept;
        
        if(startNum > denominator) runAmount = 1/(denominator / startNum);
        else if(startNum < denominator) runAmount = startNum / denominator;
        
        riseB = -(maxNum.update - (numerator * runAmount));
        runB = (denominator * runAmount) + xintercept;
        
        intercept = maxNum.update; 
      }
      else {
        line2Active = false;
      }
    }
    else if (intercept == -(maxNum.update)) {
      if (!slopeIsNegative) {
        line1Active = false;
      }
      else if (slopeIsNegative) {
        line2Active = false;
      }
    }
    else if (intercept == 0) {
      if(maxNum.update > numerator) riseAmount = 1/(numerator / maxNum.update);
      else if(maxNum.update < numerator) riseAmount = maxNum.update / numerator;
      
      riseA = numerator * riseAmount;
      runA = numerator * riseAmount;      
      riseB = numerator * riseAmount;
      runB = numerator * riseAmount;
    }
    
    if (slope == 0 && intercept == 0) {
      xintercept = pointContainer[0].x;
      intercept = -(maxNum.update);
      riseA = maxNum.update;
      runA = xintercept;
      vertical = true;
      console.log(slopeIsNegative);
    }
    
    if (line1Active) {
      x1 = (w/2 + spacing) + (xintercept*ratio)/2;
      y1 = (w/2 + spacing) - (intercept*ratio)/2;
      x2 = (w/2 + spacing) + (runA*ratio)/2;
      if(slopeIsNegative) y2 = (w/2 + spacing) + (riseA*ratio)/2;
      else y2 = (w/2 + spacing) - (riseA*ratio)/2;
      
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineWidth = 3;
      context.strokeStyle = "#6666ff";
      context.stroke();
      
      console.log('SLOPE: '+slope+', INTERCEPT: '+intercept+', NUMERATOR: '+numerator+', DENOMINATOR: '+denominator+', RISE: '+rise+', RISE AMOUNT: '+riseAmount+', RUN: '+run);
    }
    
    if (vertical) line2Active = false;
    
    if (line2Active) {
      a1 = (w/2 + spacing) - (xintercept*ratio)/2;
      b1 = (w/2 + spacing) - (intercept*ratio)/2;
      a2 = (w/2 + spacing) - (runB*ratio)/2;
      if(slopeIsNegative) b2 = (w/2 + spacing) - (riseB*ratio)/2;
      else b2 = (w/2 + spacing) + (riseB*ratio)/2;
      
      context.beginPath();
      context.moveTo(a1, b1);
      context.lineTo(a2, b2);
      context.lineWidth = 3;
      context.strokeStyle = "#6666ff";
      context.stroke(); 
  
      console.log('X1: '+x1+', Y1: '+y1+', X2: '+x2+', Y2: '+y2);
      console.log('SLOPE: '+slope+', INTERCEPT: '+intercept+', NUMERATOR: '+numerator+', DENOMINATOR: '+denominator+', RISE: '+rise+', RISE AMOUNT: '+riseAmount+', RUN: '+run);
    }
    
    /*
    if (intercept < 0 && intercept > -(maxNum.update)) {
      var startNum;
      if (slopeIsNegative) {
        console.log('SLOPE IS NEGATIVE');
        startNum = intercept + 10;
        
        runAmount = maxNum.update / denominator
        
        riseB = intercept + (runAmount * numerator);
        runB = denominator * runAmount;
        
        if(riseB > maxNum.update){
          diff = riseB - maxNum.update;
          
          if (diff > numerator) riseAmount = 1/(numerator / diff);
          else riseAmount = diff / numerator;
          
          riseB -= numerator * riseAmount;
          runB -= denominator * riseAmount;
        }
      }
      else {
        console.log('SLOPE IS POSITIVE');
        startNum = intercept + 10;
        
        if (startNum < numerator) riseAmount = startNum / numerator;
        else if (startNum > numerator) riseAmount = 1/(numerator / startNum);
        
        riseB = -(intercept) + (riseAmount * numerator);
        runB = denominator * riseAmount;
        
        if(runB > maxNum.update){
          diff = runB - maxNum.update;
          
          if (diff > denominator) runAmount = 1/(denominator / diff);
          else runAmount = diff / denominator;
          
          riseB -= numerator * runAmount;
          runB -= denominator * runAmount;
        }
      }
      line2Active = true;
    }
    else if (intercept > 0 && intercept < maxNum.update) {
      var startNum;
      if (slopeIsNegative) {
        console.log('SLOPE IS NEGATIVE');
        startNum = intercept + 10;
        
        runAmount = maxNum.update / denominator
        
        riseB = intercept + (runAmount * numerator);
        runB = denominator * runAmount;
        
        if(riseB > maxNum.update){
          diff = riseB - maxNum.update;
          
          if (diff > numerator) riseAmount = 1/(numerator / diff);
          else riseAmount = diff / numerator;
          
          riseB -= numerator * riseAmount;
          runB -= denominator * riseAmount;
        }
      }
      else {
        console.log('SLOPE IS POSITIVE');
        if(slope == 0) {
          riseB = -(intercept);
          runB = maxNum.update;
        }
        else {
          startNum = intercept + 10;
        
          if (startNum < numerator) riseAmount = startNum / numerator;
          else if (startNum > numerator) riseAmount = 1/(numerator / startNum);
          
          riseB = -(intercept) + (riseAmount * numerator);
          runB = denominator * riseAmount;
          
          if(runB > maxNum.update){
            diff = runB - maxNum.update;
            
            if (diff > denominator) runAmount = 1/(denominator / diff);
            else runAmount = diff / denominator;
            
            riseB -= numerator * runAmount;
            runB -= denominator * runAmount;
          }
        }
      }
      line2Active = true;
    }
    else if (intercept < -(maxNum.update)) {
      if (slope > 0) {
        var startNum = maxNum.update;
        diff = -(intercept) - startNum;
        
        if(diff > numerator) riseAmount = 1/(numerator / diff);
        else if(diff < numerator) riseAmount = diff / numerator;
        
        xintercept = -(denominator * riseAmount);
        
        startNum = xintercept + maxNum.update;
        
        if(startNum > denominator) runAmount = 1/(denominator / startNum);
        else if(startNum < denominator) runAmount = startNum / denominator;
        
        riseB = maxNum.update - (numerator * runAmount);
        runB = -(denominator * runAmount) + xintercept;
        
        intercept = -(maxNum.update); 
      }
      else line2Active = false;
    }
    else if (intercept > maxNum.update) {
      if (!slopeIsNegative) {
        
        var startNum = maxNum.update;
        diff = intercept - startNum;
        
        if(diff > numerator) riseAmount = 1/(numerator / diff);
        else if(diff < numerator) riseAmount = diff / numerator;
        
        xintercept = (denominator * riseAmount);
        
        startNum = maxNum.update - xintercept;
        
        if(startNum > denominator) runAmount = 1/(denominator / startNum);
        else if(startNum < denominator) runAmount = startNum / denominator;
        
        riseB = -(maxNum.update - (numerator * runAmount));
        runB = (denominator * runAmount) + xintercept;
        
        intercept = maxNum.update; 
      }
      else line2Active = false;
    }
    else if (intercept == -(maxNum.update)) {
      if (slopeIsNegative) {
        line2Active = false;
      }
    }
    else if (intercept == 0) {
      if(maxNum.update > numerator) riseAmount = 1/(numerator / maxNum.update);
      else if(maxNum.update < numerator) riseAmount = maxNum.update / numerator;
      
      riseB = numerator * riseAmount;
      runB = numerator * riseAmount;
    }
    
    console.log(line2Active, intercept, -(maxNum.update));
    
    if (vertical) line2Active = false;
    
    if (line2Active) {
      a1 = (w/2 + spacing) - (xintercept*ratio)/2;
      b1 = (w/2 + spacing) - (intercept*ratio)/2;
      a2 = (w/2 + spacing) - (runB*ratio)/2;
      if(slopeIsNegative) b2 = (w/2 + spacing) - (riseB*ratio)/2;
      else b2 = (w/2 + spacing) + (riseB*ratio)/2;
      
      context.beginPath();
      context.moveTo(a1, b1);
      context.lineTo(a2, b2);
      context.lineWidth = 3;
      context.strokeStyle = "#6666ff";
      context.stroke(); 
  
      console.log('X1: '+x1+', Y1: '+y1+', X2: '+x2+', Y2: '+y2);
      console.log('SLOPE: '+slope+', INTERCEPT: '+intercept+', NUMERATOR: '+numerator+', DENOMINATOR: '+denominator+', RISE: '+rise+', RISE AMOUNT: '+riseAmount+', RUN: '+run);
    }
    */
  }
  
  this.clear = function(){
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  /*
  * Draws a point on the canvas.
  * p = array of two coordinates, x and y
  *
  * var myPoint = [x, y];
  * plotPoint(myPoint);
  * 
  */
  this.plotPoint = function(pt){
    var numX = eval(Number(pt[0]));
    var numY = eval(Number(pt[1]));
    var xPlot = eval(Number(numX));
    var yPlot = eval(Number(numY));
    var r;
    
    if(onlyPositive){
      if (w > maxNum.update)r = 1/(maxNum.update/w);
      else r = 1/(maxNum.update/w);
      
      xPlot = (0 + spacing) + numX*r;
      yPlot = (h + spacing) - numY*r;
    }
    else{
      xPlot = (w/2) + (numX*ratio) + spacing;
      yPlot = (w/2) - (numY*ratio) + spacing;
    }
    
    context.fillStyle = "#ff0000";
    context.beginPath();
    context.arc(xPlot, yPlot, 6, 0, Math.PI * 2, true);
    context.fill();
  }
  
  // HANDLERS ///////////////
  /*
   * Handles update event
   */
  this.handleUpdate = function(){
    if(pointContainer.length >= 2){
      _this.clear();
      _this.drawGraph();
      _this.solve();
    }
    else if(pointContainer.length == 1){
      _this.clear();
      _this.drawGraph();
    }
    else if(pointContainer.length == 0){
      _this.clear();
      _this.drawGraph();
    }
    $('#updateGraphButton').toggleClass('ui-disabled');
  }
  
  /*
   * Handles adding points
   */
  this.handleAddPoint = function(e){
    var numX = eval(Number(e.pt[0]));
    var numY = eval(Number(e.pt[1]));
    var xPlot = eval(Number(numX));
    var yPlot = eval(Number(numY));
    var convertedX;
    var convertedY;
    
    if(numX < 0){
      numX *= -1;
      onlyPositive = false;
    }
    if(numY < 0){
      numY *= -1;
      onlyPositive = false;
    }
    pointContainer.push({x:xPlot, y:yPlot});
    
    if(numX > maxNum.original || numY > maxNum.original){
      if(numX > numY){
        maxNum.original = numX;
      }
      else{
        maxNum.original = numY;
      }
      
      if (!_this.checkMod(maxNum.original)) {
        _this.makeEven(maxNum.original);
      }
      else{
        maxNum.update = maxNum.original;
      }
    }
  }
  
  /*
   * Handles changing points
   */
  this.handleChangePoint = function(e){
    var pointToChange = e.epn;
    var xyCoord = e.xy;
    var val = e.n;
    var index = pointContainer.indexOf(pointContainer[pointToChange]);
    _this.checkForMaxNum();
    if(xyCoord == 'x')pointContainer[index].x = val;
    else if(xyCoord == 'y')pointContainer[index].y = val;
    pointHasChanged = true;
    
    onlyPositive = true;
    for (var i = 0; i < pointContainer.length; i++) {
      if (pointContainer[i].x < 0 || pointContainer[i].y < 0) {
        onlyPositive = false;
        break;
      }
    }
  }
  
  /*
   * Handles deleting points
   */
  this.handleDeletePoint = function(e){
    if(pointContainer[e.n]){
      var x = pointContainer[e.n].x;
      var y = pointContainer[e.n].y;
      if(x < 0)x *= -1;
      if(y < 0)y *= -1;
      if(x == maxNum.original || y == maxNum.original){
        maxNum.original = 10;
        maxNum.update = 10;
      }
      var index = pointContainer.indexOf(pointContainer[e.n]);
      pointContainer.splice(index,1);
      pointHasChanged = true;
      if(pointContainer.length >= 0 && $('#updateGraphButton').hasClass('ui-disabled'))$('#updateGraphButton').toggleClass('ui-disabled');
      onlyPositive = true;
      for (var i = 0; i < pointContainer.length; i++) {
        if (pointContainer[i].x < 0 || pointContainer[i].y < 0) {
          onlyPositive = false;
          break;
        }
      }
    }
  }
  
  /*
   * Handles reset
   */
  this.handleReset = function(){
    pointContainer.length = 0;
    pointsTotal = 0;
    pointHasChanged = false;
    graphIsActive = false;
    problemSolved = false;
    onlyPositive = true;
    _this.clear();
    _this.drawGraph();
  }
  
  this.roundTo = function(number, length) {
    return Math.round(number*Math.pow(10,length))/Math.pow(10,length);
  }
  
  this.checkMod = function(n){
    return n % 10 === 0;
  }
  
  this.makeEven = function(n){
    var updateNum;
    for (var i = 0; i < n; i++) {
      updateNum = (n) + i;
      if (this.checkMod(updateNum)) {
        maxNum.update = updateNum;
        break;
      }
    }
  }
  
  this.checkForMaxNum = function(){
    var found = false;
    for(var i = 0; i < pointContainer.length; i++){
      if(maxNum.original == pointContainer[i].x || maxNum.original == pointContainer[i].y){
        found = true;
      }
      else{
        
      }
    }
    
    if(!found){
      maxNum.original = 0;
      maxNum.update = 0;
      this.setMaxNum();
    }
  }
  
  this.setMaxNum = function(){
    for(var i = 0; i < pointContainer.length; i++){
      if(maxNum.original < pointContainer[i].x){
        maxNum.original = pointContainer[i].x;
      }
      else{
        if(maxNum.original < pointContainer[i].y)maxNum.original = pointContainer[i].y;
      }
    }
    if (!this.checkMod(maxNum.original)) {
      this.makeEven(maxNum.original);
    }
  }
  
  // Decimal to fraction
  function highestCommonFactor(a,b) {
    if (b==0) return a;
      return highestCommonFactor(b,a%b);
  }
  
  /*
   *Create DocumentFragment
   *
   */
  this.create = function(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
        
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
    }
    return frag;
  }
  
  this.initListeners = function(){
    this.addEventListener('ADD_POINT', this.handleAddPoint);
    this.addEventListener('CHANGE_POINT', this.handleChangePoint);
    this.addEventListener('DELETE_POINT', this.handleDeletePoint);
    this.addEventListener('RESET', this.handleReset);
    this.addEventListener('UPDATE', this.handleUpdate);
  }
  
  // GET ANSWER AND LINE TO DRAW /////////////////
  this.getAnswer = function(){
    var lr = {};
    var n = pointContainer.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;
    var numerator;
    var denominator;
    var yAnswer;
    var xAnswer;
    var rAnswer;
    
    for (var i = 0; i < n; i++) {
      sum_x += pointContainer[i].x;
      sum_y += pointContainer[i].y;
      sum_xy += (pointContainer[i].x*pointContainer[i].y);
      sum_xx += (pointContainer[i].x*pointContainer[i].x);
      sum_yy += (pointContainer[i].y*pointContainer[i].y);
    }
    
    numerator = n * sum_xy - sum_x * sum_y;
    denominator = n*sum_xx - sum_x * sum_x;
    
    if(numerator == 0 && denominator == 0) {
      lr['slope'] = 0;
      lr['intercept'] = 0;
      lr['r2'] = 0;
      
      xAnswer = _this.create('<div class="answer">x = '+pointContainer[0].x+'</div>');
      $("#answerHolder").append(xAnswer);
    }
    else {
      lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
      lr['intercept'] = (sum_y - lr.slope * sum_x)/n;      
      lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);
      
      yAnswer = _this.create('<div class="answer">y = '+this.roundTo(lr.slope,2)+'x + '+this.roundTo(lr.intercept,2)+'</div>');
      $("#answerHolder").append(yAnswer);
      if(lr.r2){
        rAnswer = _this.create('<div class="answer">r = '+this.roundTo(lr.r2,3)+'</div>');
        $("#answerHolder").append(rAnswer);
      }
    }
    
    if (!lr.slope) lr['slope'] = 0;
    if (!lr.intercept) lr['intercept'] = 0;
    if (!lr.r2) lr['r2'] = 0;
    
    return lr;
  }
  
  this.getLine = function(){
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
    var values_length = pointContainer.length;
    if (values_length != pointContainer.length) {
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
      x = pointContainer[v].x;
      y = pointContainer[v].y;
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
      x = pointContainer[v].x;
      y = x * m + b;
      result_values_x.push(x);
      result_values_y.push(y);
    }
    
    return [result_values_x, result_values_y];
  }
}

Graph.prototype = new EventDispatcher();
