function PointList(a) {
  var _this = this;
  var app = a;
  var deleteBtnActive = false;
  var pointToUpdate;
  var fieldToUpdate;
  var xy;
  var editPointNum;
  var editCoord;
  var pointRows = [];
  var newPointRow;
	var activePoint = {};
	var previousPoint = {};
	var pointsTotal = 0;
	var deleteCount = 0;
  var bgColor = 'gray';
  var count = 1;
  var creatingPoint = false;
  
  this.init = function(){
    this.setupListeners();
  }
  
  this.setupListeners = function(){
    this.addEventListener('INIT_POINT_ROW', this.handleInitPointRow);
		this.addEventListener('BEGIN_EDITING', this.handleEditing);
		this.addEventListener('RESET', this.handleReset);
		this.addEventListener('CHANGE_POINT', this.handleChange);
		this.addEventListener('DELETE_POINT', this.handleDelete);
    this.addEventListener('INIT_POINT', this.handleInitPoint);
    this.addEventListener('ADD_POINT', this.handleAddPoint);
  }
	
	this.handleChange = function(){
		activePoint = {};
		previousPoint = {};
    _this.btnsToEnable();
    
	}
	
	this.handleDelete = function(e){    
		var index = pointRows.indexOf(pointRows[e.n]);
    pointRows.splice(index,1);
		var ch = $('#pointsHolder').children();
		for(var i = 0; i < pointRows.length; i++){
			ch[i].id = 'point'+i;
			ch[i].childNodes[0].id = 'deleteBtn'+i;
			$('#deleteBtn'+i).attr('data-id', i);
			ch[i].childNodes[2].childNodes[0].id = 'point'+i+'-x';
			$('#point'+i+'-x').attr('data-id', i);
			ch[i].childNodes[3].childNodes[0].id = 'point'+i+'-y';
			$('#point'+i+'-y').attr('data-id', i);
		}
		count = 1;
		if(bgColor == 'blue')bgColor = 'gray';
		else if(bgColor == 'gray')bgColor = 'blue';
		activePoint = {};
		previousPoint = {};
    
    _this.updateColors();
    
    if($('#newPointButton').hasClass('ui-disabled'))$('#newPointButton').toggleClass('ui-disabled');
    if(pointRows.length > 0 && $('#resetButton').hasClass('ui-disabled'))$('#resetButton').toggleClass('ui-disabled');
    if(pointRows.length == 0 && !$('#resetButton').hasClass('ui-disabled'))$('#resetButton').toggleClass('ui-disabled');
    if(pointRows.length == 0 && !$('#updateGraphButton').hasClass('ui-disabled'))$('#updateGraphButton').toggleClass('ui-disabled');
		if(pointRows.length > 1 && $('#updateGraphButton').hasClass('ui-disabled'))$('#updateGraphButton').toggleClass('ui-disabled');
	}
  
  this.updateColors = function(){
    for (var i = 0; i < pointRows.length; i++) {
      if (i%2 != 0) {
        if ($('#point'+i).hasClass('gray')) {
          $('#point'+i).removeClass('gray');
          $('#point'+i).addClass('blue');
        }
      }
      else if (i%2 == 0) {
        if ($('#point'+i).hasClass('blue')) {
          $('#point'+i).removeClass('blue');
          $('#point'+i).addClass('gray');
        }        
      }
    }
  }
	
	// handle BEGIN_EDITING event
	this.handleEditing = function(e){
    _this.btnsToDisable();
    app.toggleKeys();
		if(!activePoint.el){
			activePoint = {el:'#point'+e.epn+'-'+e.xy, num:e.epn};
			$(activePoint.el).toggleClass("highlight");
			$("#deleteBtn"+activePoint.num).toggleClass("deleteHide");
			//_this.toggleDelete(editPointNum);
		}
		else{
			previousPoint = activePoint;
			activePoint = {el:'#point'+e.epn+'-'+e.xy, num:e.epn};
			
			if(activePoint.el == previousPoint.el){
				$(activePoint.el).toggleClass("highlight");
				$("#deleteBtn"+activePoint.num).toggleClass("deleteHide");
				activePoint = {};
				previousPoint = {};
        _this.btnsToEnable();
			}
			else{
				$(activePoint.el).toggleClass("highlight");
				$(previousPoint.el).toggleClass("highlight");
				$("#deleteBtn"+activePoint.num).toggleClass("deleteHide");
				$("#deleteBtn"+previousPoint.num).toggleClass("deleteHide");
			}
		}
		//$("#deleteBtn"+ec.epn).toggleClass("deleteHide");
	}
  
	// handles INIT_POINT_ROW event
  this.handleInitPointRow = function(e){
    creatingPoint = true;
    
    //$('#newPointButton').toggleClass('ui-disabled');
		//pointsTotal = e.pt;
		pointsTotal = pointRows.length;
    newPointRow = _this.create('<div class="point-item '+bgColor+' clearfix" id="point'+pointsTotal+'"><div id="deleteBtn'+pointsTotal+'" class="deleteBtn ui-shadow ui-btn ui-btn-inline ui-btn-up-c" data-id="'+pointsTotal+'">Delete</div><div class="vert"></div><div class="coord"><span id="point'+pointsTotal+'-x" class="coord-num" data-id="'+pointsTotal+'"></span></div><div class="coord"><span id="point'+pointsTotal+'-y" class="coord-num" data-id="'+pointsTotal+'"></span></div></div>');
    $("#pointsHolder").append(newPointRow);
    newPointRow = '';
		
    if(bgColor == 'gray')bgColor = 'blue';
    else bgColor = 'gray';
		
		$("#deleteBtn"+pointsTotal).click($.proxy(function(event){
			var num = {n:Number($('#'+event.currentTarget.id).attr('data-id'))};
      $('#point'+num.n).remove();
      _this.dispatchEvent('DELETE_POINT', num);
			_this.dispatchEvent('STOP_EDITING');
    },this));	
  	
    $("#point"+pointsTotal+"-x").click($.proxy(function(event){
			if(!creatingPoint) {
				var target = event.currentTarget;
				editPointNum = $(target).attr('data-id');
				editCoord = '#point'+editPointNum+'-x';
				xy = 'x';
				var data = {ec:editCoord, epn:editPointNum, xy:xy};
				_this.dispatchEvent('BEGIN_EDITING', data);
			}
    },this));
    
    $("#point"+pointsTotal+"-y").click($.proxy(function(event){
			if (!creatingPoint) {
				var target = event.currentTarget;
				editPointNum = $(target).attr('data-id');
				editCoord = '#point'+editPointNum+'-y';
				xy = 'y';
				var data = {ec:editCoord, epn:editPointNum, xy:xy};
				_this.dispatchEvent('BEGIN_EDITING', data);
			}
    },this));
    _this.dispatchEvent('INIT_POINT');
    pointRows.push({x:"#point"+pointsTotal+"-x", y:"#point"+pointsTotal+"-y"});
  }
  
  this.handleInitPoint = function(){
    if (creatingPoint) {
      if (count == 1) {
        $('#point'+pointsTotal+'-x').toggleClass('highlight');
        count++;
      }
      else if (count == 2) {
        $('#point'+pointsTotal+'-x').toggleClass('highlight');
        $('#point'+pointsTotal+'-y').toggleClass('highlight');
        count = 1
      } 
    }
  }
  
  this.handleAddPoint = function(){
    $('#point'+pointsTotal+'-y').toggleClass('highlight');
    creatingPoint = false;
  }
  
  // Create DocumentFragment
  this.create = function(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
        
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
    }
    return frag;
  }
  
  this.toggleDelete = function(n){
    var num = {n:Number(n)};
    this.deleteBtnActive = true;
    $("#deleteBtn"+n).on( "tap", $.proxy(function(event){
			console.log(event.currentTarget);
      //$('#point'+n).remove();
      //_this.dispatchEvent('DELETE_POINT', num);
			//_this.dispatchEvent('STOP_EDITING');
      //$("#deleteBtn"+n).toggleClass("deleteHide");
    },this));	
  }
  
  this.btnsToEnable = function(){
    if($('#newPointButton').hasClass('ui-disabled'))$('#newPointButton').toggleClass('ui-disabled');
    if(pointRows.length > 1)if($('#updateGraphButton').hasClass('ui-disabled'))$('#updateGraphButton').toggleClass('ui-disabled');
    if($('#resetButton').hasClass('ui-disabled'))$('#resetButton').toggleClass('ui-disabled');
  }
  
  this.btnsToDisable = function(){
    if(!$('#newPointButton').hasClass('ui-disabled'))$('#newPointButton').toggleClass('ui-disabled');
    if(pointRows.length > 1)if(!$('#updateGraphButton').hasClass('ui-disabled'))$('#updateGraphButton').toggleClass('ui-disabled');
    if(!$('#resetButton').hasClass('ui-disabled'))$('#resetButton').toggleClass('ui-disabled');
  }
  
  this.toggleBtns = function(id, onOff){
    if (onOff == 'on')if($('#'+id).hasClass('ui-disabled'))$('#'+id).toggleClass('ui-disabled');
    else if(!$('#'+id).hasClass('ui-disabled'))$('#'+id).toggleClass('ui-disabled');
  }
	
	this.handleReset = function(){
		deleteBtnActive = false;
		pointToUpdate = '';
		fieldToUpdate = '';
		xy = '';
		editPointNum = '';
		editCoord = '';
		pointRows.length = 0;
		newPointRow = '';
		activePoint = {};
		previousPoint = {};
    bgColor = 'gray';
    pointsTotal = 0;
    deleteCount = 0;
		count = 1;
	}
}

PointList.prototype = new EventDispatcher();