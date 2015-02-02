function Keypad(a) {
  var _this = this;
  var app = a;
  var num = '';
  var val = '';
  var currentPoint = [];
  var editingPoint = false;
  var editCoord;
  var editPointNum;
  var xy;
  var deciCount = 0;
  var hasDecimal = false;
  var limitReached = false;
  var bp = false;
  var pt;
  var isDown = false;
  var activeKey;
  
  this.init = function(){
    this.setupListeners();
    
    $(document).mouseup(function(e){
      if (activeKey) {
        $(activeKey).toggleClass('keyHighlight');
        activeKey = '';
      }
    });
    
    $(".keypadBtn").mousedown(function( event ) {
      activeKey = this;
      //if(app.getBuildingPoint() )$(this).toggleClass('keyHighlight');
      $(this).toggleClass('keyHighlight');
    });
    
    /*$(".keypadBtn").mouseup(function( event ) {
      if(app.getBuildingPoint())$(this).toggleClass('keyHighlight');
    });*/
    
    $(".keypadBtn").click(function(event){
      bp = app.getBuildingPoint();
      pt = app.getPointsTotal();
      
      if(bp){
        // BUILDING NEW POINT
        
        // handle numbers, decimal, minus
        if($(this ).attr('data-value') != 'del' && $(this).attr('data-value') != 'enter'){
          val = $(this).attr('data-value');
          
          if (!limitReached) {
            if(val != '-' && val != '.')num += val;
            else{
              if(val == '-' && num == '')num += val;
              if(val == '.' && !hasDecimal){
                hasDecimal = true;
                num += val;
              }
            }
            
            if(_this.decimalPlaces(num) == 3)limitReached = true;
            
            if (num.length > 1) {
              if(num.charAt(0) == '0' && num.charAt(1) != '.') {
                var newNum = num.substr(1);
                num = newNum;
              }
            }
            
            if (Number(num) >= 1000) {
              hasDecimal = true;
              limitReached = true;
            }
            else if (Number(num) <= -1000) {
              hasDecimal = true;
              limitReached = true;
            }
            if(currentPoint.length == 0)$("#point"+pt+"-x").html(num);
            if(currentPoint.length == 1)$("#point"+pt+"-y").html(num);  
          }
        }
        
        // handle 'delete'
        if($(this).attr('data-value') == 'del'){
          //if(num.substr(num.length-1) == '.')deciCount = 0;
          if (num % 1 == 0)hasDecimal = false;
          num = num.substr(0, num.length-1);
          if(_this.decimalPlaces(num) < 3)limitReached = false;
          if(currentPoint.length == 0)$("#point"+pt+"-x").html(num);
          if(currentPoint.length == 1)$("#point"+pt+"-y").html(num);
        }
        
        // handle 'enter'
        if($(this).attr('data-value') == 'enter'){
          if (num != '' && num != '.' && num != '-') {
            if (Number(num) >= 1000){
              num = '999.999';
              if(currentPoint.length == 0)$("#point"+pt+"-x").html(num);
              if(currentPoint.length == 1)$("#point"+pt+"-y").html(num);
            }
            if (Number(num) <= -1000){
              num = '-999.999';
              if(currentPoint.length == 0)$("#point"+pt+"-x").html(num);
              if(currentPoint.length == 1)$("#point"+pt+"-y").html(num); 
            }
            
            currentPoint.push(num);
            num = '';
            deciCount = 0;
            hasDecimal = false;
            limitReached = false;
            if(currentPoint.length < 2) _this.dispatchEvent('INIT_POINT');
            
            if(currentPoint.length == 2){
              var pointToAdd = {pt:currentPoint};
              _this.dispatchEvent('ADD_POINT', pointToAdd);
              
              $("#deleteBtn"+pt).toggleClass("deleteHide");
              currentPoint.length = 0;
            } 
          }
          
        }
      }
      else{
        if(editingPoint){
          // EDITING EXISTING POINT
          
          // handle numbers
          if($(this).attr('data-value') != 'del' && $(this).attr('data-value') != 'enter'){
            num += $(this).attr('data-value');
            $(editCoord).html(num);
          }
          
          // handle enter
          if($(this).attr('data-value') == 'enter'){
            var data = {epn:editPointNum, n:Number(num), xy:xy};
            _this.dispatchEvent('CHANGE_POINT', data);
            
            num = '';
            $(editCoord).toggleClass("highlight");
            $("#deleteBtn"+editPointNum).toggleClass("deleteHide");
            
            editingPoint = false;
            app.toggleKeys();
          }
          
          // handle delete
          if($(this).attr('data-value') == 'del'){
            //
          }
        }
      }      
    });
  }
  
  this.decimalPlaces = function(num) {
  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
    return Math.max(
      0,
      // Number of digits right of decimal point.
      (match[1] ? match[1].length : 0)
      // Adjust for scientific notation.
      - (match[2] ? +match[2] : 0));
  }
  
  this.handleBeginEditing = function(e){
    editingPoint = true;
    editCoord = e.ec;
    editPointNum = e.epn;
    xy = e.xy;
  }
  
  this.handleStopEditing = function(){
    editingPoint = false;
  }
  
  this.handleReset = function(){
    num = '';
    currentPoint.length = 0;
    editingPoint = false;
    editCoord = null;
    editPointNum = null;
    xy = '';
    deciCount = 0;
    
    if(app.getBuildingPoint()){
      app.toggleKeys();
    }
  }
  
  this.handleDelete = function(){
    if(app.getBuildingPoint())currentPoint.length = 0;
  }
  
  this.setupListeners = function(){
    this.addEventListener('BEGIN_EDITING', this.handleBeginEditing);
    this.addEventListener('STOP_EDITING', this.handleStopEditing);
    this.addEventListener('RESET', this.handleReset);
    this.addEventListener('DELETE_POINT', this.handleDelete);
  }
}

Keypad.prototype = new EventDispatcher();
