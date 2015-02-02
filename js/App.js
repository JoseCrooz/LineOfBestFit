function App() {
  _this = this;
  var xArray = [];
  var yArray = [];
  var pointCount = [];
  var pointsTotal = 0;
  var graph = new Graph(this);
  var pointList = new PointList(this);
  var keypad = new Keypad(this);
  var buildingPoint = false;
  var updateActive;
  var firstTime = true;
  
  this.init = function(){
    graph.init();
    keypad.init();
    pointList.init();
    this.initListeners();
    this.deactivateBtns();
    
    $('#message').draggable({containment: "parent"});
  }
  
  this.initListeners = function(){
    this.addEventListener('ADD_POINT', this.handlePointAdded);
    this.addEventListener('DELETE_POINT', this.handleDeletePoint);
    this.addEventListener('CHANGE_POINT', this.handleChangePoint);
    
    $('#nextButton').click(function(){
      $('#lab').toggle();
      $('#objectives-container').toggle();
    });
    
    //help button
    $('#helpButton').click( function() {
      toggleHelp();
      /*if($(this).prop('checked')) {
        $(this).prop('checked', true);
        message.style.visibility = "visible";
      } else {
        $(this).prop('checked', false);
        message.style.visibility = "hidden";
      }*/
    })
    
    function toggleHelp(){
      if($('#helpButton').prop('checked')) {
        $(this).prop('checked', true);
        message.style.visibility = "visible";
      } else {
        $('#helpButton').prop('checked', false);
        message.style.visibility = "hidden";
      }
    }
    
    // BEGIN NEW POINT
    $('#newPointButton').click(function(event){
      if(!buildingPoint){
        buildingPoint = true;
        var total = {pt:pointsTotal};
        _this.dispatchEvent('INIT_POINT_ROW', total);
        _this.toggleKeys();
        $('#newPointButton').toggleClass('ui-disabled');
        if(!$('#updateGraphButton').hasClass('ui-disabled'))$('#updateGraphButton').toggleClass('ui-disabled');
      }
    });
    
    // RESET EVERYTHING
    $('#resetButton').click(function(){
      $('#reset-message').toggle();
      $('#resetButton').toggleClass('ui-disabled');
    });
    
    $('#yes').click(function(){
      _this.dispatchEvent('RESET');
      $("#pointsHolder").empty();
      $("#answerHolder").empty();
      xArray.length = 0;
      yArray.length = 0;
      pointCount.length = 0;
      pointsTotal = 0;
      buildingPoint = false;
      if(!$('#updateGraphButton').hasClass('ui-disabled'))$('#updateGraphButton').toggleClass('ui-disabled');
      if($('#newPointButton').hasClass('ui-disabled'))$('#newPointButton').toggleClass('ui-disabled');
      $('#reset-message').toggle();
    });
    
    $('#no').click(function(){
      $('#reset-message').toggle();
      $('#resetButton').toggleClass('ui-disabled');
    });
    
    $('#updateGraphButton').click(function(){
      $("#answerHolder").empty();
      if(firstTime) {
        $('#message').removeClass('messagePos1');
        $('#message').addClass('messagePos2');
        toggleHelp();
        message.style.visibility = "hidden";
        $("input[type='checkbox']").attr("checked",false).checkboxradio("refresh");
        firstTime = false;
      }
      _this.dispatchEvent('UPDATE');
    });
  }
  
  this.deactivateBtns = function(){
    $('#updateGraphButton').toggleClass('ui-disabled');
    $('#resetButton').toggleClass('ui-disabled');
  }
  
  this.toggleKeys = function(){
    //$('.keypadBtn').toggleClass('keys-disable');
    $('#disabler').toggle();
  }
  
  // Event handlers
  this.handlePointAdded = function(e){
    xArray.push(Number(e.pt[0]));
    yArray.push(Number(e.pt[1]));
    pointsTotal++;
    buildingPoint = false;
    _this.toggleKeys();
    if (pointsTotal == 1)$('#resetButton').toggleClass('ui-disabled');
    if (pointsTotal > 1 && $('#updateGraphButton').hasClass('ui-disabled'))$('#updateGraphButton').toggleClass('ui-disabled');
    $('#updateGraphButton').buttonMarkup('enable');
    if ($('#newPointButton').hasClass('ui-disabled'))$('#newPointButton').toggleClass('ui-disabled');
    if($('#newPointButton').hasClass('ui-btn-hover-c'))$('#newPointButton').toggleClass('ui-btn-hover-c');
    if($('#newPointButton').hasClass('ui-btn-down-c'))$('#newPointButton').toggleClass('ui-btn-down-c');
    if($('#newPointButton').hasClass('ui-focus'))$('#newPointButton').toggleClass('ui-focus');
    if (xArray.length == 20 && !$('#newPointButton').hasClass('ui-disabled'))$('#newPointButton').toggleClass('ui-disabled');
  }
  
  this.handleDeletePoint = function(e){
    if(!buildingPoint){
      var index = xArray.indexOf(xArray[e.n]);
      xArray.splice(index,1);
      yArray.splice(index,1);
      pointsTotal = xArray.length;
    }
    _this.toggleKeys();
    buildingPoint = false;
    //if(pointsTotal == 0)$('#resetButton').toggleClass('ui-disabled');
    if(xArray.length < 20 && $('#newPointButton').hasClass('ui-disabled'))$('#newPointButton').toggleClass('ui-disabled');
    if($('#newPointButton').hasClass('ui-btn-hover-c'))$('#newPointButton').toggleClass('ui-btn-hover-c');
    if($('#newPointButton').hasClass('ui-focus'))$('#newPointButton').toggleClass('ui-focus');
    //if (pointsTotal < 2 && !$('#updateGraphButton').hasClass('ui-disabled'))$('#updateGraphButton').toggleClass('ui-disabled');
  }
  
  this.handleChangePoint = function(e){
    if(e.xy == 'x')xArray[e.epn] = e.n;
    else yArray[e.epn] = e.n;
    
    if (pointsTotal > 1 && $('#updateGraphButton').hasClass('ui-disabled'))$('#updateGraphButton').toggleClass('ui-disabled');
    _this.dispatchEvent('POINT_UPDATED');
  }
  
  // getters
  this.getBuildingPoint = function(){
    return buildingPoint;
  }
  
  this.getPointsTotal = function(){
    return pointsTotal;
  }
  
  // setters
  this.setBuildingPoint = function(arg){
    buildingPoint = arg;
  }
}

App.prototype = new EventDispatcher();
