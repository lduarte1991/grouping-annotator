var _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Annotator.Plugin.Grouping = (function(_super) {
	__extends(Grouping, _super);
	
	//If you do not have options, delete next line and the parameters in the declaration function
    Grouping.prototype.options = null;
	
    //declaration function, remember to set up submit and/or update as necessary, if you don't have
    //options, delete the options line below.
	function Grouping(element,options) {
        this.pluginInit = __bind(this.pluginInit, this);
		this.reloadAnnotations = __bind(this.reloadAnnotations, this);
        this.groupAndColor = __bind(this.groupAndColor, this);
        this.clearGrouping = __bind(this.clearGrouping, this);
		this.getPos = __bind(this.getPos,this);
        this.groupingButtonPressed = __bind(this.groupingButtonPressed, this);
        this.options = options;
		_ref = Grouping.__super__.constructor.apply(this, arguments);
		return _ref;
	}
	
    //example variables to be used to receive input in the annotator view
	Grouping.prototype.unfilteredAnnotations = null;
    Grouping.prototype.groupedAnnotations = null;
    Grouping.prototype.groupthreshold = 2;
    Grouping.prototype.useGrouping = 1;

    Grouping.prototype.getPos = function(el) {
        var off = $(el).offset();
        return {x: off.left,y: off.top-$($('.annotator-wrapper')[0]).offset().top};
    }
    
    //this function will initialize the plug in. Create your fields here in the editor and viewer.
    Grouping.prototype.pluginInit = function() {
		console.log("Grouping-pluginInit");
		//Check that annotator is working
		if (!Annotator.supported()) {
            console.log("Annotator is not supported");
			return;
		}
        this.annotator.subscribe('annotationsLoaded', this.reloadAnnotations);
        this.annotator.subscribe('annotationUploaded', this.reloadAnnotations);
		this.annotator.subscribe('annotationDeleted', this.reloadAnnotations);
        this.annotator.subscribe('annotationCreated', this.reloadAnnotations);
        var newdiv = document.createElement('div');
        var className = 'onOffGroupButton';
        newdiv.setAttribute('class',className);
        newdiv.innerHTML = "Turn Grouping: OFF";
        $('.annotator-wrapper')[0].appendChild(newdiv);
        var self = this;
        $(newdiv).click(function(evt){self.groupingButtonPressed();});
	};
    
    Grouping.prototype.clearGrouping = function(){
        console.log("Clearing Groups");
        $('.groupButton').remove();
        $.each(this.unfilteredAnnotations,function(val){
            if (val.highlights != undefined){
                $.each(val.highlights, function(high){
                    $(high).css("background-color","inherit");
                });
            }
        });
    }
    
    Grouping.prototype.groupAndColor = function(){
        console.log("Grouping Annotations");
        annotations = this.unfilteredAnnotations;
        lineAnnDict = {};
        var self = this;
        annotations.forEach(function(annot){
            if(annot.highlights != undefined){
                    var loc = Math.round(self.getPos(annot.highlights[0]).y);
                    if (lineAnnDict[loc] == undefined){
                        lineAnnDict[loc] = [annot];
                        return;
                    } else{
                        lineAnnDict[loc].push(annot);
                        return;
                    }
            }
        });
        this.groupedAnnotations = null;
        this.groupedAnnotations = lineAnnDict;
        var self = this;
        $.each(lineAnnDict, function(key, val) {
            if (val.length > self.groupthreshold)  {
                val.forEach(function(anno){
                    $.each(anno.highlights,function(key,anno){
                       $(anno).css("background-color","inherit");   
                    });
                });
            } else{
				val.forEach(function(anno){
                    $.each(anno.highlights,function(key,anno){
                       $(anno).css("background-color","rgba(255,255,10,.3");   
                    });
                });
			}
        });
    }
        
    Grouping.prototype.reloadAnnotations = function(){
        console.log("Reloading Annotations");
        var annotations = this.annotator.plugins['Store'].annotations;
        //clear the sidebuttons
        this.unfilteredAnnotations = annotations;
        this.clearGrouping();   
        this.groupAndColor();
        console.log("Continue Reloading");
		var self = this;
        $.each(this.groupedAnnotations, function(key, val) {
            if (val.length > self.groupthreshold)  {
                var newdiv = document.createElement('div');
                var className = 'groupButton';
                newdiv.setAttribute('class',className);
                $(newdiv).css('top',""+key+"px");
                newdiv.innerHTML = val.length;
                $(newdiv).attr('data-selected','0');
                $('.annotator-wrapper')[0].appendChild(newdiv);
                $(newdiv).click(function(evt){
                if($(evt.srcElement).attr("data-selected") == '0'){
                    annotations.forEach(function(annot){
						$.each(annot.highlights,function(key,ann){
							$(ann).css("background-color","inherit");
						});
                    });
					console.log($(evt.srcElement).css("top").replace("px",""));
                    self.groupedAnnotations[$(evt.srcElement).css("top").replace("px","")].forEach(function(item){
                        $.each(item.highlights,function(key,ann){
                            $(ann).css("background-color","rgba(255,255,10,0.3");
                        });
                    });
                        $(evt.srcElement).attr("data-selected",'1');
                    } else{
                       annotations.forEach(function(item){
                        $(item).css("background-color","inherit");
                    });
                        self.groupAndColor();
                        $(evt.srcElement).attr("data-selected",'0');
                    }
                });
            }
        });
		var self = this;
		var old = self.unfilteredAnnotations.length;
		setTimeout(function(){
			if (old != self.unfilteredAnnotations.length) {
				self.reloadAnnotations();
		}},500);
        return;
    };
    
    Grouping.prototype.groupingButtonPressed = function(){
        if(this.useGrouping == 1){
            this.clearGrouping();
            this.annotator.unsubscribe('annotationsLoaded', this.reloadAnnotations);
            this.annotator.unsubscribe('annotationUploaded', this.reloadAnnotations);
            this.annotator.unsubscribe('annotationDeleted', this.reloadAnnotations);
            this.annotator.unsubscribe('annotationCreated', this.reloadAnnotations);
            this.useGrouping = 0;
            $(".onOffGroupButton").html("Turn Grouping: ON");
            this.annotator.plugins.Store.annotations.forEach(function(annot){
				$.each(annot.highlights,function(key,ann){
				$(ann).css("background-color","");
				});
            });
        } else {
            this.reloadAnnotations();
            this.annotator.subscribe('annotationsLoaded', this.reloadAnnotations);
            this.annotator.subscribe('annotationUploaded', this.reloadAnnotations);
            this.annotator.subscribe('annotationDeleted', this.reloadAnnotations);
            this.annotator.subscribe('annotationCreated', this.reloadAnnotations);
            this.useGrouping = 1;
            $(".onOffGroupButton").html("Turn Grouping: OFF");
        }
    }
    
    return Grouping;

})(Annotator.Plugin);