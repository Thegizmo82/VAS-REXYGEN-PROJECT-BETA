/* GENERAL
* Version 2.50.7-9228
* Created 2018-03-28 17:56
*/
/**
 * SVG component represents BarGraph.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT}
 * @returns {REX.UI.SVG.BarGraph} New SVG BarGraph component
 */
REX.UI.SVG.BarGraph = function(svgElem,args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem,args);
    // Store options for simple usage
    var $o = that.options || {};
    
    // Load options or default values
    var r_min = parseFloat(that.check($o.rangeMin,0));   //minimum rozsahu
    var r_max = parseFloat(that.check($o.rangeMax,100));         //maximum rozsahu
    var tick_step = that.check($o.tickStep,5);          //krok maleho tiku
    var main_tick_step = that.check($o.mainTickStep,10);//krok hlavniho tiku s oznacenim
    var decimals = that.check($o.decimals || $o.digitalPrecision,2);       //pocet desetinnych mist pro zaokrouhleni digitalni hodnoty
    var o_units = $o.units || " ";                      //jednotky
    var colorZones = $o.colorZones || null;             //barevne zony
    var colorOffLimits = $o.colorOffLimits || "#ff7400";
    var levelColor1 = $o.levelColor1 || "#01d2ff";
    var levelColor2 = $o.levelColor2 || "#001070";
    var fSize = 28;
   
    // Get SVG elements for manipulation
    var bargraph_area = that.getChildByTag("bargraph_area"),             //cely objekt
        bargraph_level = that.getChildByTag("bargraph_level"),           //hladina bargrafu
        bargraph_capacity = that.getChildByTag("bargraph_capacity"),     //celkova velikost (kapacita) bargrafu
        border = that.getChildByTag("border"),                           //okraj (ramecek)
        digitalValue = that.getChildByTag("digitalval"),                   //digitalni hodnota
        textBox = that.getChildByTag("text_box") 
                || that.getChildByTag("display_box"),                  //ramecek digitalni hodnoty
        stopC1 = that.getChildByTag("stopC1"),
        stopC2 = that.getChildByTag("stopC2"),
        units = that.getChildByTag("units");                             //jednotky

    // Deprecated warning
    if(!textBox){that.log.warn(that.id +': Please upgrade this component');}

    //Global variables
    var center_x = bargraph_area.getBBox().width / 2;       //x-ova souradnice stredu 
    var center_y = bargraph_area.getBBox().height / 2;      //y-ova souradnice stredu
    var centerXDBox = textBox.getBBox().x + textBox.getBBox().width / 2;
    var centerYDBox = textBox.getBBox().y + textBox.getBBox().height / 2;
    var font_size_units = 24;
    var font_size_digitalval = 24;
    var tick_counter = 0;
    var tick_height;
    var tick_width;
    var labels = new Array();
    var colorRanges = new Array();
    var zoneCounter = 0;

    //Set level color
    stopC1.style.stopColor = levelColor1;
    stopC2.style.stopColor = levelColor2;

    //Set units
        units.textContent = o_units;
        units.setAttributeNS(null, "style", "font-size:" + font_size_units + "px; fill:#ffffff; font-family:Arial");
        units.parentNode.setAttributeNS(null, "transform", "translate(" + parseInt((centerXDBox - units.parentNode.getBBox().width / 2) - units.parentNode.getBBox().x) + "," + 0 +")");

    //Set digital value
        digitalValue.setAttributeNS(null, "style", "font-size:" + font_size_digitalval + "px; font-family:Arial");

    // Draw ticks
        //tick_counter = (Math.abs(1000000 * r_max - 1000000 * r_min) / 1000000 / tick_step);
        tick_counter = (Math.abs(r_max - r_min) / tick_step);
        tick_height = 1.2;
        tick_width = 20;
        var i = 0;
        while (i <= tick_counter + 0.1) {
            createTick(i, tick_height, tick_width);
            i = i + 1;
        }

    //Draw main ticks
        //var tick_counter = (Math.abs(1000000 * r_max - 1000000 * r_min) / 1000000 / main_tick_step);
        //alert(Math.abs(1000000 * r_max - 1000000 * r_min) / 1000000 / main_tick_step);
        tick_counter = (Math.abs(r_max - r_min) / main_tick_step);
        tick_height = 1.6;
        tick_width = 40;
        var i = 0;
        while (i <= tick_counter + 0.1) {
            createTick(i, tick_height, tick_width);
            createLabel(i);
            i = i + 1;
        }
    //Draw color range
    for (var n = 0; n < colorZones.length; n++) {
        drawColorRange(parseFloat(colorZones[n].startValue), parseFloat(colorZones[n].endValue), colorZones[n].color);
    }

    // Add anonymous function as event listener. There are two events
    // 'read' - it is called every time when item is read
    // 'change' - called for the first time and every time item value is changed    
        that.$c.value.on('change', function (itm) {
            var level = itm.getValue();
            if (level >= r_min && level <= r_max) {
                bargraph_level.setAttributeNS(null, "height", (bargraph_capacity.getBBox().height) * (level - r_min) / Math.abs(r_max - r_min));
                border.style.fill = "#000000";
                digitalValue.style.fill = "#00ffff";
            } else {
                if (level > r_max) {
                    bargraph_level.setAttributeNS(null, "height", bargraph_capacity.getBBox().height);
                    digitalValue.style.fill = colorOffLimits;
                    border.style.fill = colorOffLimits;
                    /*
                    while (r_max <= level) {
                        var tmp = r_min;
                        r_min = r_min + 0.5 * Math.abs(r_max - tmp);
                        r_max = r_max + 0.5 * Math.abs(r_max - tmp);
                    }
                    changeLabels();
                    changeColorRange();
                    bargraph_level.setAttributeNS(null, "height", (bargraph_capacity.getBBox().height) * (level - r_min) / Math.abs(r_max - r_min));
                    digitalval.style.fill = "#00ffff";
                    */
                } else {
                    bargraph_level.setAttributeNS(null, "height", 0.001);
                    digitalValue.style.fill = colorOffLimits;
                    border.style.fill = colorOffLimits;
                    /*
                    while (r_min >= level) {
                        var tmp = r_min;
                        r_min = r_min - Math.abs(r_max - tmp);
                        r_max = r_max - Math.abs(r_max - tmp);
                    }
                    changeLabels();
                    changeColorRange();
                    bargraph_level.setAttributeNS(null, "height", (bargraph_capacity.getBBox().height) * (level - r_min) / Math.abs(r_max - r_min));
                    digitalval.style.fill = "#00ffff";
                    */
                }   
            }
            digitalValue.textContent = level.toFixed(decimals);
            transformDisplay();
        });

    function createTick(i,tick_height,tick_width) {
        var x = bargraph_capacity.getBBox().x - tick_width;
        var y = (bargraph_capacity.getBBox().y + bargraph_capacity.getBBox().height) - i * bargraph_capacity.getBBox().height / tick_counter - tick_height/2;
        var elem = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        elem.setAttributeNS(null, "x", x);
        elem.setAttributeNS(null, "y", y);
        elem.setAttributeNS(null, "width", tick_width);
        elem.setAttributeNS(null, "height", tick_height);
        elem.setAttributeNS(null, "style", "fill:#ffffff");
        bargraph_area.appendChild(elem);
    }

    function createLabel(i) {
        var x = bargraph_capacity.getBBox().x - tick_width;
        var y = (bargraph_capacity.getBBox().y + bargraph_capacity.getBBox().height) - i * bargraph_capacity.getBBox().height / tick_counter - tick_height / 2;
        var font_size = 24;
        var translate_x;
        var translate_y;
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttributeNS(null, "x", x);
        text.setAttributeNS(null, "y", y);
        text.setAttributeNS(null, "fill", "#ffffff");
        text.setAttributeNS(null, "style", "font-size:" + font_size + "px; font-family:Arial");
        text.textContent = Math.round((parseFloat(r_min) + i * main_tick_step) * 10000) / 10000;
        bargraph_area.appendChild(text);
        translate_x = -text.getBBox().width - 3;
        translate_y = text.getBBox().height / 2 - 3;
        text.setAttributeNS(null, "transform", "translate(" + translate_x + "," + translate_y + ")")
        labels[i] = text;
    }

    function changeLabels() {
        var translate_x;
        var translate_y;
        for (var i = 0; i < labels.length; i++) {
            labels[i].textContent = Math.round((parseFloat(r_min) + i * parseFloat(main_tick_step)) * 100) / 100;
            translate_x = -labels[i].getBBox().width - 3;
            translate_y = labels[i].getBBox().height / 2 - 3;
            labels[i].setAttributeNS(null, "transform", "translate(" + translate_x + "," + translate_y + ")")
        }
    }

    function drawColorRange(startValue, endValue, color) {
        var start = startValue;
        var end = endValue;
        if (start < r_min) start = r_min;
        if (end > r_max) end = r_max;
        var startHeight = (bargraph_capacity.getBBox().height) * (start - r_min) / Math.abs(r_max - r_min);
        var endHeight = (bargraph_capacity.getBBox().height) * (end - r_min) / Math.abs(r_max - r_min);
        var x = bargraph_capacity.getBBox().x + bargraph_capacity.getBBox().width + 1;
        var y = bargraph_capacity.getBBox().y + bargraph_capacity.getBBox().height - endHeight;

        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttributeNS(null, "style", "fill:" + color + "; stroke:none");
            rect.setAttributeNS(null, "x", x);
            rect.setAttributeNS(null, "y", y);
            rect.setAttributeNS(null, "height", endHeight - startHeight);
            rect.setAttributeNS(null, "width", 8);
            bargraph_area.appendChild(rect);
            colorRanges[zoneCounter] = new colorRangeObject(rect, startValue, endValue, color);
            zoneCounter++;
    }

    function changeColorRange() {
        for (var j = 0; j < colorRanges.length; j++) {
            var start = colorRanges[j].start;
            var end = colorRanges[j].end;
            if (start < parseFloat(r_min)) start = parseFloat(r_min);
            if (end > r_max) end = r_max;
            var startHeight = (bargraph_capacity.getBBox().height) * (start - parseFloat(r_min)) / Math.abs(parseFloat(r_max) - parseFloat(r_min));
            var endHeight = (bargraph_capacity.getBBox().height) * (end - parseFloat(r_min)) / Math.abs(parseFloat(r_max) - parseFloat(r_min));
            var x = bargraph_capacity.getBBox().x + bargraph_capacity.getBBox().width + 1;
            var y = bargraph_capacity.getBBox().y + bargraph_capacity.getBBox().height - endHeight;
            colorRanges[j].cRObject.setAttributeNS(null, "x", x);
            colorRanges[j].cRObject.setAttributeNS(null, "y", y);
            colorRanges[j].cRObject.setAttributeNS(null, "height", endHeight - startHeight);
        }
    }

    function colorRangeObject(cRObject, start, end, color) {
        this.cRObject = cRObject;
        this.start = start;
        this.end = end;
        this.color = color;
    }

    function transformDisplay() {
        if (textBox) {
            var fontSize = digitalValue.style.fontSize || digitalValue.parentNode.style.fontSize;
            if (digitalValue.parentNode.getBBox().width >= textBox.getBBox().width * 0.95) {
                digitalValue.style.fontSize = parseFloat(fontSize.substring(0, fontSize.indexOf('p'))) * 0.90 + "px";
            }
            else if (digitalValue.parentNode.getBBox().width < textBox.getBBox().width * 0.80
                && parseFloat(fontSize.substring(0, fontSize.indexOf('p'))) * 1.05 < fSize) {
                digitalValue.style.fontSize = parseFloat(fontSize.substring(0, fontSize.indexOf('p'))) * 1.05 + "px";
            }

            digitalValue.parentNode.setAttributeNS(null, "transform", "translate("
                + parseInt(textBox.getBBox().x + (textBox.getBBox().width / 2
                    - digitalValue.parentNode.getBBox().width / 2)
                    - digitalValue.parentNode.getBBox().x)
                + "," + parseInt(textBox.getBBox().y +
                    (textBox.getBBox().height / 2 - digitalValue.parentNode.getBBox().height / 2)
                    - digitalValue.parentNode.getBBox().y) + ")");
        }
    }
    
    return that;
};

REX.UI.SVG.Battery = function(svgElem,args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem,args);
    // Store options for simple usage
    var $o = that.options || {};
    
    var overlay = $(that.getChildByTag("overlay"));
    
    // Get SVG elements for manipulation
    var levels = {
        10:  $(that.getChildByTag("batt-10")),
        25:  $(that.getChildByTag("batt-25")),
        40:  $(that.getChildByTag("batt-40")),
        55:  $(that.getChildByTag("batt-55")),
        70:  $(that.getChildByTag("batt-70")),
        85:  $(that.getChildByTag("batt-85")),
        95: $(that.getChildByTag("batt-100"))
    }   
    $.each( levels, function( key, level ) {        
        level.fill = level.css('fill');        
    });            
    var init = true;
    
    that.$c.value.on('change', function(itm) {        
        if(init){overlay.hide();init=false;}        
        var value = itm.getValue();           
        $.each( levels, function( key, level ) {
            if(value>=key){
                level.css('fill',level.fill);
            }
            else{
                level.css('fill','none');
            }           
        });        
    });

    

    return that;
};

/**
 * SVG component represents Button.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT} 
 * @returns {REX.UI.SVG.Fan} New SVG Button component
 */
REX.UI.SVG.Button = function(svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.HTMLComponent(svgElem, args);
    var $o = that.options || {};    
    
    var type = that.check($o.type,'PushButton');
    var onMouseDownValue = that.parseBoolean($o.reverseMeaning) ? 0 : 1;
    var colorFalse = that.check($o.colorFalse, "#FFFFFF");
    var colorTrue = that.check($o.colorTrue, that.COLORS.primary);
    
    var fontScale = parseFloat((''+that.check($o.fontScale,1)).replace(',', '.'));
    var elementTitle = $(that.element).find('title').text();    

    var labelFalse = that.crlf2br(that.check($o.labelFalse, ""));
    var labelTrue = that.crlf2br(that.check($o.labelTrue, labelFalse));
    if (labelTrue.length === 0) {
        labelTrue = labelFalse;
    }
    var labelColorFalse = that.check($o.labelColorFalse, '#000000');
    var labelColorTrue = that.check($o.labelColorTrue, '#FFFFFF');

    // Stavove promenne
    var pressed = false;
    var active = false;

    var button = $(document.createElement('button'));            
    button.addClass('mdc-button mdc-button--raised rex__button');    
    $(that.div).append(button);    

    // Heuristika. Pokud neni pro MP definovan cteci bod, pak se bude pouzivat pouze label a color False
    if(!that.$c.refresh_from && (type === 'ManualPulse' || type === 'ManualPulseRpt')){
        labelTrue = labelFalse;
        colorTrue = colorFalse;
        labelColorTrue = labelColorFalse;
    }

    that.$c.refresh_from = that.$c.refresh_from || that.$c.value;

    var oldDisable = that.disable;
    that.disable = function () {
        oldDisable.apply(that,arguments);
        button.css("background", "");
        button.css("color", "");
        button.attr("disabled",true);        
        button.css('pointer-events','none');
    };

    var oldEnable = that.enable;
    that.enable = function () {
        oldEnable.apply(that,arguments);
        button.removeAttr("disabled");        
        button.css('pointer-events','');
    };    
    
    // Init font autoresize+
    function updateFontSize() {
        var ctm = that.svg.getScreenCTM();
        // Scale according the width or height which is better
        if (ctm) {
            button.css('font-size', 16*Math.min(ctm.a, ctm.d) * fontScale + 'px');
            button.css('line-height', 16*Math.min(ctm.a, ctm.d) * fontScale + 'px');
        }
    }

    $(window).on('resize orientationchange', function () {
        updateFontSize();
    });

    updateFontSize();


    if (that.$c.value.type === 'R') {
        that.log.error('Connection String: ' + that.$c.value.cstring + '(' + that.$c.value.alias + ') is read-only');
        refresh();
        that.disable();
        // Vypne funkci enable a ukonci ostatni inicializace
        that.enable=function(){};
        return that;
    }

    if (type === 'ToggleButton' && that.$c.value !== that.$c.refresh_from) {
        that.log.error(`Refresh_from datapoint is not supported in the Toggle mode!`);
        refresh();
        that.disable();
        // Vypne funkci enable a ukonci ostatni inicializace
        that.enable=function(){};
        return that;
    }

    function refresh(){
        let value = that.$c.refresh_from.getValue();
        if (value === (1 - onMouseDownValue) || value === null) {
            button.css("background", colorFalse);
            // jQuery is not able to change important flag
            button[0].style.setProperty('color', labelColorFalse, 'important');
            button.html(labelFalse);
            active = false;
        }
        else {
            button.css("background", colorTrue);
            button[0].style.setProperty('color', labelColorTrue, 'important');
            button.html(labelTrue);
            active = true;
        }
    }
    
    that.$c.refresh_from.on('change', refresh);

    function writeFailed(err){        
        that.log.debug("Write failed",err);
        if(typeof(err) === 'string'){
            that.log.error(err);
        }
        else{
            that.log.error("Write failed",err);
        }
    }
    

    button.bind('touchstart mousedown', function(evt) {
        evt.preventDefault(); 
        this.focus();
        if (evt.handled !== true) {
            // Primary mouse button only            
            if (!(evt.button && evt.button > 0)) {                
                if (type === 'ToggleButton') {
                    if (!active) {
                        that.$c.value.write(onMouseDownValue).catch(writeFailed);
                        active = true;
                    }
                    else {
                        that.$c.value.write(1 - onMouseDownValue).catch(writeFailed);
                        active = false;
                    }
                }
                else if (type === 'ManualPulseRpt') {
                    let loopWrite = () => {
                        that.$c.value.write(onMouseDownValue)
                        .then(() => {
                            setTimeout(() => {
                                if (pressed) { loopWrite(); }
                            }, 20);
                        })
                        .catch(writeFailed);
                    };                    
                    loopWrite();
                    that.log.debug(labelFalse + ' ' + evt.type);
                }
                else {
                    that.log.debug(labelFalse + ' ' + evt.type);
                    that.$c.value.write(onMouseDownValue).catch(writeFailed);
                }
                pressed = true;
                that.emit('mousedown');                
            }
            evt.handled = true;
        } else {
            return false;
        }
    })
    .bind('touchend touchcancel touchleave mouseup mouseleave', function(evt) {
        evt.preventDefault();
        this.blur();
        if (evt.handled !== true) {
            // Primary mouse button only       
            // Invoke only when the button was pressed before
            if (!(evt.button && evt.button > 0) && pressed) {
                that.log.debug(labelFalse + ' ' + evt.type);
                if (type === 'PushButton') {
                    that.$c.value.write(1 - onMouseDownValue).catch(writeFailed);
                }
                that.emit('mouseup');
                pressed = false;
            }
            evt.handled = true;
        } else {
            return false;
        }
    });

    that.setReadOnly = function(){
        that.readOnly = true;        
        button.addClass('rex__button--read-only');
        button.off().removeData();
        button.css('pointer-events','none');
    };

    refresh();    
    that.disable();
    return that;
};
REX.UI.SVG.ComAp_Checkbox = function (svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem, args);
    // Store options for simple usage
    var $o = that.options || {};

    // Get options or default values
    var reverse_meaning = that.parseBoolean($o.reverse_meaning);
    var show_cross = that.parseBoolean($o.show_cross);

    that.$c.refresh_from = that.$c.refresh_from || that.$c.value;
    var refresh_from = that.$c.refresh_from;

    if(!that.$c.value.writeCString){
        that.log.error('Item %s is read-only!',that.$c.value.id);
    }
 
    // Get SVG elements for manipulation
    var switchArea = that.element,
        tick = SVG.adopt(that.getChildByTag("tick")),
        cross = SVG.adopt(that.getChildByTag("cross")),
        currentPosition = 0;
        
    that.element.addEventListener("click", toggleValue, false);
    that.element.addEventListener("contextmenu", toggleValue, false);

    function refresh() {
        if (currentPosition === 0) {
            if(show_cross){
                tick.hide();
                cross.show();                
            }
            else{
                tick.hide();
                cross.hide();
            }
        }
        else {
            tick.show();
            cross.hide();
        }
    }

    function toggleValue(event) {
        event.preventDefault();
        if (currentPosition === 0) {            
            that.$c.value.write(!reverse_meaning).catch((err)=>{that.log.error("Write failed",err)});
            currentPosition = 1;                        
        } else {            
            that.$c.value.write(reverse_meaning).catch((err)=>{that.log.error("Write failed",err)});
            currentPosition = 0;
        }
        refresh();
    }
    
    
    refresh_from.on('change', function onChange(itm) {
        if (reverse_meaning) {
            currentPosition = (itm.getValue() === 0) ? 1 : 0;
        }
        else {
            currentPosition = itm.getValue();
        }
        refresh();
    });

    var oldDisable = that.disable;
    that.disable = function () {
        oldDisable.apply(that,arguments);
        tick.hide();
        cross.hide();
    };

    var oldEnable = that.enable;
    that.enable = function () {
        oldEnable.apply(that,arguments);
        refresh();
    };  

    return that;
};

/**
 * SVG component represents ComboBox.
 * @param {SVGElement} svgElem
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT}
 * @returns {REX.UI.SVG.Fan} New SVG ComboBox component
 */
REX.UI.SVG.ComboBox = function(svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.HTMLComponent(svgElem, args);
    var $o = that.options || {};
    var values = $o.values;
    var showValue = that.parseBoolean($o.showValue);
    var fontScale = that.checkNumber($o.fontScale,1);
    var valueType = (that.check($o.valueType,'number')).toLowerCase();

    that.$c.refresh_from = that.$c.refresh_from || that.$c.read || that.$c.value || that.$c.write;
    if(!that.$c.refresh_from){
        that.log.error('Refresh from connection string is not defined! Cannot continue!');
        return that;
    }

    var selectorId='selector'+that.element.id;
    var select = that.select = $('<select name="'+selectorId+'" id="'+selectorId+'">');
    $(that.div).append(select);
    for(var i = 0; i<values.length; i++){
        var desc = '';
        if (!values[i].desc) {
            desc = values[i].value;
        }
        else {
            desc = showValue ? values[i].value + ': ' + values[i].desc : values[i].desc;
        }
        select.append('<option value="'+values[i].value+'">'+desc+'</option>');
    }
    select.selectmenu();

    select.on('selectmenuchange',function (event, ui) {
        var val = $(this).val();
        if (valueType === 'number') {
            val = parseInt(val);
        }
        that.$c.value.write(val).catch((err)=> {
            that.log.error("Write failed", err)
        });
    });

    var selectBtn = $(that.div).find('.ui-selectmenu-button');
    var selectIcon = $(that.div).find('.ui-selectmenu-icon');
    var selectMenu = $('#'+selectorId+'-menu');
    selectBtn.css({"padding-top":"0px","padding-bottom":"0px"});

    var firstRefresh = true;
    that.$c.refresh_from.on('change', function (itm) {
        var value = itm.getValue();
        select.val(value.toString());
        if (select.find('option[value="' + value + '"]').length == 0) {
            select.append('<option value="' + value + '">'+value+'</option>');
            select.selectmenu();
            select.val(value.toString());
            select.selectmenu("refresh");
            firstRefresh = true;
        }
        else {
            select.selectmenu("refresh");
        }        
        if(firstRefresh){
            that.updatePosition();
            firstRefresh = false;
        }
    });

    var oldDisable = that.disable;
    that.disable = function(){
        "use strict";
        oldDisable.apply(that,arguments);
        select.selectmenu('disable');
    };

    var oldEnable = that.enable;
    that.enable = function(){
        "use strict";
        if(oldEnable.apply(that,arguments)){
            select.selectmenu('enable');
            return true;
        }
    };

    var oldUpdatePosition = that.updatePosition;
    that.updatePosition = function(){
        oldUpdatePosition.apply(that,arguments);
        updateFontSize();
        select.selectmenu("option", "width", $(that.div).width() );
        selectBtn.css({'line-height':that.div.style.height,'height':that.div.style.height});
        selectIcon.css('margin-top','calc(('+that.div.style.height +' - 16px )/ 2');
    };

    // Init font autoresize
    function updateFontSize() {
        var ctm = that.svg.getScreenCTM();
        // Scale according the width or height which is better
        selectBtn.css('font-size', Math.min(ctm.a, ctm.d) * fontScale + 'em');
        selectMenu.css('font-size', Math.min(ctm.a, ctm.d) * fontScale + 'em');
    }

    that.disable();
    that.updatePosition();
    return that;
};
/**
 * SVG component represents control led
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT} 
 * @returns {REX.UI.SVG.ControlLed} New Control Led component
 */
REX.UI.SVG.ControlLed = function (svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem, args);
    // Store options for simple usage
    var $o = that.options || {};

    // Load options or default values
    $o.color_true = $o.color_true || $o.colorRun || "#33ee00";
    $o.color_false = $o.color_false || $o.colorStop || "#ffffff";

    var colorTrue = that.parseBoolean($o.reverseMeaning) ? $o.color_false : $o.color_true;
    var colorFalse = that.parseBoolean($o.reverseMeaning) ? $o.color_true : $o.color_false;

    // Get SVG elements for manipulation
    var oled1 = that.getChildByTag('radialgradient-start');
    var oled2 = that.getChildByTag('radialgradient-stop');
    var radialGradientId = that.getChildByTag('radialgradient').id;
    var path = that.getChildByTag('path');

    path.style.fill = "url(#" + radialGradientId + ")";

    // For backward compatibility
    that.$c.value = that.$c.value || that.$c.LIGHT;

    that.$c.value.on('change', function (i) {
        if (!that.isDisabled()) {
            refresh();
        }
    });

    function refresh() {
        if (that.$c.value.getValue()) {
            oled1.style.stopColor = colorTrue;
            oled2.style.stopColor = colorTrue;
        } else {
            oled1.style.stopColor = colorFalse;
            oled2.style.stopColor = colorFalse;
        }
    }

    var oldDisable = that.disable;
    that.disable = function () {
        oldDisable.apply(that, arguments);
        oled1.style.stopColor = "#ffffff";
        oled2.style.stopColor = "#7f7f7f";
    };

    var oldEnable = that.enable;
    that.enable = function () {
        oldEnable.apply(that, arguments);
        refresh();
    };

    return that;

};




REX.UI.SVG.CustomHTML = function(svgElem, args) {
     // Inherit from base component
    var that = new REX.UI.SVG.HTMLComponent(svgElem, args);
    var $o = that.options || {};
    var html = $o.html;

    $(that.div).html(html);

    return that;
};
/**
 * SVG component represents Display.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT}
 * @returns {REX.UI.SVG.Fan} New SVG Display component
 */
REX.UI.SVG.Display = function (svgElem, args) {    
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem, args);
    // Store options for simple usage
    var $o = that.options || {};

    // Load options or default values
    var range_min = that.checkNumber($o.rangeMin, 0);
    var range_max = that.checkNumber($o.rangeMax, 100);
    var color_max = $o.colorAbove || '#ff0000';
    var color_min = $o.colorBelow || '#ffff00';
    var color = $o.color || "black";
    var format = $o.format || '';
    var text_format = $o.text_format || '';
    var scale = that.checkNumber($o.scale, 1);
    var offset = that.checkNumber($o.offset, 0);
    var decimals = that.checkNumber($o.decimals, 4);
    var units = $o.units || '';

    // Get SVG elements for manipulation
    var display = that.getChildByTag("display");

    // For backward compatibility with 2.10.8
    if (!display) {
        display = that.getChildByTag("number");
    }

    // If tspan exist used it
    if($(display).find('tspan').length>0){
        display = $(display).find('tspan').get(0);
    }

    if (!display) {        
        that.log.warn('Display ' + that.id + ' is not valid component');
        return
    }
    
    that.$c.value.on('change', function (itm) {
        switch (format.toLowerCase()) {
            case 'text':
                if(text_format){
                    if(text_format.indexOf("hh:mm")!==-1){
                        display.textContent = that.time2str(itm.getValue(),text_format);
                    }
                }
                // TODO: Add more text formats
                else{
                    display.textContent = itm.getValue();
                }
                break;
            case 'date':
                display.textContent = that.date2str(that.getDateFromREXSeconds(itm.getValue()));
                break;
            case 'time':
                display.textContent = that.getDateFromREXSeconds(itm.getValue()).toLocaleTimeString();
                break;
            case 'datetime':
                display.textContent = that.date2str(that.getDateFromREXSeconds(itm.value)) + ' ' +
                        that.getDateFromREXSeconds(itm.value).toLocaleTimeString();
                break;
            default:
                if (itm.getValue() < range_min) {
                    display.style.fill = color_min;
                } else if (itm.getValue() > range_max) {
                    display.style.fill = color_max;
                } else {
                    display.style.fill = color;
                }
                var resultValue = (itm.value * scale) + offset;                
                display.textContent = '' + resultValue.toFixed(decimals);
                break;
        }
        if(units){
            display.textContent = display.textContent + ' '+units;
        }
    });

    return that;
};
/**
 * SVG component represents DisplayString.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT}
 * @returns {REX.UI.SVG.DisplayString} New SVG DisplayString component
 */
REX.UI.SVG.DisplayString = function (svgElem, args) {    
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem, args);
    // Store options for simple usage
    var $o = that.options || {};

    // Load options or default values    
    var format = ($o.format || '').toLowerCase();
    var showValue = that.parseBoolean($o.showValue);
    var values = {};

    if (format == 'alt') {
        var valuesArr = $o.values;
        // Convert value array to dictionary
        for (var i = 0; i < valuesArr.length; i++) {
            var desc = '';
            if (!valuesArr[i].desc) {
                desc = valuesArr[i].value;
            }
            else {
                desc = showValue ? valuesArr[i].value + ': ' + valuesArr[i].desc : valuesArr[i].desc;
            }
            values[valuesArr[i].value] = desc;
        }
    }
    
    // Get SVG elements for manipulation
    var display = SVG.adopt(that.getChildByTag("display"));

    if (!display) {
        that.log.warn('Display ' + that.id + ' is not valid component');
        return
    }

    // Change line-height for multiline strings
    var $d = $(that.getChildByTag("display"));
    var leading = parseFloat($d.css('line-height')) / parseFloat($d.css('font-size'));
    display.leading(leading);

    
    that.$c.value.on('change', function (itm) {
        var val = ''+itm.getValue();
        display.clear();
        if (val.length > 0) {
            switch (format.toLowerCase()) {
                case 'alt':                
                        display.text(values[val] || val);                
                    break;
                default:                
                        display.text(val);
                    break;
            }
        }
    });

    return that;
};
/**
 * SVG component represents DisplayWithBox.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT}
 * @returns {REX.UI.SVG.DigitalValue} New SVG DigitalValue component
 */

REX.UI.SVG.DisplayWithBox = function (svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem, args);
    // Store options for simple usage
    var $o = that.options || {};

    // Get options or default values
    var decimals = that.checkNumber($o.decimals,2),
        rangeMin = that.checkNumber($o.rangeMin,0),
        rangeMax = that.checkNumber($o.rangeMax,100),
        colorAbove = $o.colorAbove || '#ff0000',
        colorBelow = $o.colorBelow || '#ffff00',
        color = $o.color || "#00ffff",
        o_units = $o.units || " ";
    var format = $o.format || '';
    var scale = that.checkNumber($o.scale, 1);
    var offset = that.checkNumber($o.offset, 0);

    // Get SVG elements for manipulation
    var digitalvalue_area = that.getChildByTag("digitalval_area"),
        digitalValue = that.getChildByTag("digitalval"),
        textBox = that.getChildByTag("textbox"),
        text = that.getChildByTag("text"),
        units = that.getChildByTag("units");

    //Global variables
    var center_x = digitalvalue_area.getBBox().width / 2,
        center_y = digitalvalue_area.getBBox().height / 2;

    //Set units
    units.textContent = o_units;
    units.parentNode.setAttributeNS(null, "transform", "translate(" + parseInt(
        (center_x - units.parentNode.getBBox().width / 2) - units.parentNode.getBBox().x) + "," + 0 + ")");

    function resizeFont() {
        var fontSize = digitalValue.style.fontSize,
            dvBB = digitalValue.parentNode.getBBox(),
            tbBB = textBox.getBBox();
        
        // Change font size        
        if (dvBB.width >= tbBB.width * 0.95) {
            digitalValue.style.fontSize = parseFloat(
                    fontSize.substring(0, fontSize.indexOf('p'))) * 0.9 + "px";
        }
        else if (dvBB.width < tbBB.width * 0.9 && dvBB.height < tbBB.height) {
            digitalValue.style.fontSize = parseFloat(
                    fontSize.substring(0, fontSize.indexOf('p'))) * 1.1 + "px";
        }        
        // Center text
        digitalValue.parentNode.setAttributeNS(null, "transform",
            "translate(" + parseInt(
                (digitalvalue_area.getBBox().width / 2 - dvBB.width / 2) - dvBB.x)
                + "," + 0 + ")");
    }
    
    that.$c.value.on('change', function (itm) {
        switch (format.toLowerCase()) {
            case 'date':
                digitalValue.textContent = that.date2str(that.getDateFromREXSeconds(itm.value));
                break;
            case 'time':
                digitalValue.textContent = that.getDateFromREXSeconds(itm.value).toLocaleTimeString();
                break;
            case 'datetime':
                digitalValue.textContent = that.date2str(that.getDateFromREXSeconds(itm.value)) + ' ' +
                        that.getDateFromREXSeconds(itm.value).toLocaleTimeString();
                break;
            default:
                if (itm.getValue() < rangeMin) {
                    digitalValue.style.fill = colorBelow;
                }
                else if (itm.getValue() <= rangeMax) {
                    digitalValue.style.fill = color;
                }
                else {
                    digitalValue.style.fill = colorAbove;
                }
                var resultValue = (itm.getValue() * scale) + offset;                                
                digitalValue.textContent = resultValue.toFixed(decimals);
                break;
        }
        resizeFont();
    });
    
    resizeFont();

    return that;
};

/**
 * SVG component represents Gauge.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT}
 * @returns {REX.UI.SVG.Gauge} New SVG Gauge component
 */
REX.UI.SVG.Gauge180 = function (svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem, args);
    // Store options for simple usage
    var $o = that.options || {};

    // Load options or default values
    var r_min = parseFloat(that.check($o.rangeMin,0));         //minimum rozsahu
    var r_max = parseFloat(that.check($o.rangeMax,100));       //maximum rozsahu
    var tick_step = that.check($o.tickStep,5);        //krok maleho tiku
    //krok hlavniho tiku s oznacenim
    var main_tick_step = that.check($o.mainTickStep,10);
    //pocet desetinnych mist pro zaokrouhleni digitalni hodnoty
    var decimals = that.check($o.decimals||$o.digitalPrecision,2);
    var o_units = $o.units || " ";                  //jednotky
    var colorZones = $o.colorZones || null;         //barevne rozsahy
    var colorOffLimits = $o.colorOffLimits || "#ff7400";
    var fSize = 28;

    // Get SVG elements for manipulation
    var gauge_area = that.getChildByTag("gauge_area");   //cely objekt
    var hand = that.getChildByTag("hand");               //rucicka
    var middle_circle = that.getChildByTag("middle");    //kruhovy stred
    var border = that.getChildByTag("border");           //okraj
    var tick_0 = that.getChildByTag("tick_0");           //maly tik v pocatku
    var main_tick_0 = that.getChildByTag("main_tick_0"); //hlavni oznaceny tik v pocatku
    var digitalValue = that.getChildByTag("digitalval");   //digitalni hodnota
    var units = that.getChildByTag("units");             //jednotky
    var textBox = that.getChildByTag("text_box");        // prostor pro vykresleni hodnoty
    // Deprecated warning
    if(!textBox){that.log.warn(that.id +': Please upgrade this component');}

    //Global variables
    var center_x = gauge_area.getBBox().width / 2;     //x-ova souradnice stredu 
    var center_y = gauge_area.getBBox().height - middle_circle.getBBox().height / 2 - 1;     //y-ova souradnice stredu;
    var font_digitalval = 24;
    var main_tick_size = 5;
    var main_tick_color = "#ffffff";
    var tick_counter;               //pocet malych tiku
    var main_tick_counter;          //pocet hlavnich oznacenych tiku                          
    var tick_angle;                 //uhel mezi jednotlivymi tiky
    var labels = new Array();       //pole hodnot pro popis osy

    //Fill color, opacity, size
    tick_0.setAttributeNS(null, "style", "fill:#ffffff");
    main_tick_0.setAttributeNS(null, "style", "fill-opacity:0");
    tick_0.setAttributeNS(null, "height", tick_0.getBBox().height / 2);
    tick_0.setAttributeNS(null, "y", tick_0.getBBox().y + tick_0.getBBox().height * 2 / 2 - tick_0.getBBox().height / 2);
    hand.setAttributeNS(null, "style", "fill-opacity:1");

    //Set units
    units.textContent = o_units;
    units.parentNode.setAttributeNS(null, "transform", "translate(" + parseInt((center_x - units.parentNode.getBBox().width / 2) - units.parentNode.getBBox().x) + "," + 10 + ")");

    //Draw ticks
    tick_counter = (Math.abs(r_max - r_min)) / tick_step;
    tick_angle = 180 / tick_counter;
    var i = 0;
    while (i <= tick_counter) {
        createTick(i, "#"+ tick_0.id);
        i = i + 1;
    }
    //Draw main ticks
    main_tick_counter = (Math.abs(r_max - r_min)) / main_tick_step;
    tick_angle = 180 / main_tick_counter;
    i = 0;
    while (i <= main_tick_counter) {
        //createTick(i, "#main_tick_0");
        createLabel(i);
        createMainTick(i);
        i = i + 1;
    }

    //Draw color range
    for (var n = 0; n < colorZones.length; n++){
        drawColorRange(parseFloat(colorZones[n].startValue), parseFloat(colorZones[n].endValue), colorZones[n].color);
    }

    // Change z-index on the top
    hand.parentNode.appendChild(hand);                   //posunuti rucicky v hierarchii uplne nahoru
    middle_circle.parentNode.appendChild(middle_circle); //posunuti kruhoveho stredu v hierarchii uplne nahoru
    digitalValue.setAttributeNS(null, "style", "font-size:" + font_digitalval + "px");

    // Add anonymous function as event listener. There are two events
    // 'read' - it is called every time when item is read
    // 'change' - called for the first time and every time item value is changed    
    that.$c.value.on('change', function (itm) {
        var value = itm.getValue();
        var angle = (value - r_min) * (180 / Math.abs(r_max - r_min)) - 90;
        if (value >= r_min && value <= r_max) {
            hand.setAttributeNS(null, "transform", "rotate(" + angle + "," + center_x + "," + center_y + ")");
            digitalValue.style.fill = "#00ffff";
            border.setAttributeNS(null, "style", "fill:#000000");
        }

        else {
            if (value > r_max) {

                hand.setAttributeNS(null, "transform", "rotate(" + 90 + "," + center_x + "," + center_y + ")");
                digitalValue.style.fill = colorOffLimits;
                border.style.fill = colorOffLimits;
                /*
                var tmp = r_min;
                r_min = r_min + 0.5 * Math.abs(r_max - tmp);
                r_max = r_max + 0.5 * Math.abs(r_max - tmp);
                changeLabels();
                */
            } else {

                hand.setAttributeNS(null, "transform", "rotate(" + -90 + "," + center_x + "," + center_y + ")");
                digitalValue.style.fill = colorOffLimits;
                border.style.fill = colorOffLimits;
                /*
                var tmp = r_min;
                r_min = r_min - 0.5 * Math.abs(r_max - tmp);
                r_max = r_max - 0.5 * Math.abs(r_max - tmp);
                changeLabels();
                */
            }
        }
        digitalValue.innerHTML = value.toFixed(decimals);
        transformDisplay();
    });

    function createTick(i, tick_type) {
        var mat_a = Math.cos((tick_angle * i) * Math.PI / 180);
        var mat_b = Math.sin((tick_angle * i) * Math.PI / 180);
        var mat_e = (-center_x) * Math.cos((tick_angle * i) * Math.PI / 180) + center_y * Math.sin((tick_angle * i) * Math.PI / 180) + center_x;
        var mat_f = (-center_x) * Math.sin((tick_angle * i) * Math.PI / 180) - center_y * Math.cos((tick_angle * i) * Math.PI / 180) + center_y;

        var elem = document.createElementNS("http://www.w3.org/2000/svg", "use");
        elem.setAttributeNS("http://www.w3.org/1999/xlink", "href", tick_type);
        elem.setAttributeNS(null, "transform", "matrix(" + mat_a + "," + mat_b + "," + -mat_b + "," + mat_a + "," + mat_e + "," + mat_f + ")");
        gauge_area.appendChild(elem);
    }

    function createMainTick(i) {
        var x = center_x + Math.sqrt(center_x / 1.888 * center_x / 1.888 + center_y / 1.888 * center_y / 1.888) * Math.cos((180 - tick_angle * i) * Math.PI / 180);
        var y = center_y - Math.sqrt(center_x / 1.888 * center_x / 1.888 + center_y / 1.888 * center_y / 1.888) * Math.sin((180 - tick_angle * i) * Math.PI / 180);

        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttributeNS(null, "cx", x);
        circle.setAttributeNS(null, "cy", y);
        circle.setAttributeNS(null, "r", main_tick_size);
        circle.setAttributeNS(null, "fill", main_tick_color);
        circle.setAttributeNS(null, "style", "stroke:none");
        gauge_area.appendChild(circle);
    }

    function createLabel(i) {
        var x = center_x + Math.sqrt(center_x / 2 * center_x / 2 + center_y / 2 * center_y / 2) * Math.cos((180 - tick_angle * i) * Math.PI / 180);
        var y = center_y - Math.sqrt(center_x / 2 * center_x / 2 + center_y / 2 * center_y / 2) * Math.sin((180 - tick_angle * i) * Math.PI / 180);

        var font_size = 22;
        if (i > 0 && i < main_tick_counter) {
            y = y + font_size / 2 + 1;
        }
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttributeNS(null, "x", x);
        text.setAttributeNS(null, "y", y);
        text.setAttributeNS(null, "fill", "#ffffff");
        text.setAttributeNS(null, "style", "font-size:" + font_size + "px; font-family:Arial");
        text.textContent = Math.round((parseFloat(r_min) + i * main_tick_step) * 100) / 100;
        gauge_area.appendChild(text);
        if (i > main_tick_counter / 2) {
            var translate_x = -text.getBBox().width - 1;
            text.setAttributeNS(null, "transform", "translate(" + translate_x + "," + 0 + ")");
        }
        if (i == main_tick_counter / 2) {
            var translate_x = -text.getBBox().width/2;
            var translate_y = text.getBBox().height /5;
            text.setAttributeNS(null, "transform", "translate(" + translate_x + "," + translate_y + ")");
        }
        labels[i] = text;
    }

    function changeLabels() {
        for (var i = 0; i < labels.length; i++) {
            labels[i].textContent = Math.round((r_min + i * main_tick_step) * 100) / 100;
        }
    }

    function drawColorRange(startValue, endValue, color) {
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        var x = center_x + Math.sqrt(center_x / 2 * center_x / 2 + center_y / 2 * center_y / 2) * Math.cos((180) * Math.PI / 180);
        var y = center_y - Math.sqrt(center_x / 2 * center_x / 2 + center_y / 2 * center_y / 2) * Math.sin((180) * Math.PI / 180);
        path.setAttributeNS(null, "style", "fill:none; stroke:" + color + "; stroke-width:8; stroke-opacity:0.8");
        path.setAttributeNS(null, "d", "M " + x + " " + y);
        gauge_area.appendChild(path);

        if (startValue < r_min) startValue = r_min;
        if (endValue > r_max) endValue = r_max;

        var startAngle = (startValue - r_min) * (180 / Math.abs(r_max - r_min));
        var endAngle = (endValue - r_min) * (180 / Math.abs(r_max - r_min));
        var i = 0;
        while (startAngle <= endAngle) {
            var radians = ((180 - startAngle) / 180) * Math.PI;
            var px = center_x + Math.cos(radians) * Math.sqrt(center_x / 4 * center_x / 4 + center_y / 4 * center_y / 4);
            var py = center_y - Math.sin(radians) * Math.sqrt(center_x / 4 * center_x / 4 + center_y / 4 * center_y / 4);
            //var px = center_x + Math.cos(radians) * Math.sqrt(center_x / 1.7 * center_x / 1.7 + center_y / 1.7 * center_y / 1.7);
            //var py = center_y - Math.sin(radians) * Math.sqrt(center_x / 1.7 * center_x / 1.7 + center_y / 1.7 * center_y / 1.7);
            //var px = center_x + Math.cos(radians) * Math.sqrt(center_x / 1.46 * center_x / 1.46 + center_y / 1.46 * center_y / 1.46);
            //var py = center_y - Math.sin(radians) * Math.sqrt(center_x / 1.46 * center_x / 1.46 + center_y / 1.46 * center_y / 1.46);
            var e = path.getAttribute("d");
            if (i == 0) {
                var d = e + " M " + px + " " + py;
            } else {
                var d = e + " L " + px + " " + py;
            }
            path.setAttributeNS(null, "d", d);
            startAngle += 0.5;
            i++;
        }
    }

    function transformDisplay() {
        if (textBox) {
            var fontSize = digitalValue.style.fontSize || digitalValue.parentNode.style.fontSize;
            if (digitalValue.parentNode.getBBox().width >= textBox.getBBox().width * 0.95) {
                digitalValue.style.fontSize = parseFloat(fontSize.substring(0, fontSize.indexOf('p'))) * 0.90 + "px";
            }
            else if (digitalValue.parentNode.getBBox().width < textBox.getBBox().width * 0.80
                && parseFloat(fontSize.substring(0, fontSize.indexOf('p'))) * 1.05 < fSize) {
                digitalValue.style.fontSize = parseFloat(fontSize.substring(0, fontSize.indexOf('p'))) * 1.05 + "px";
            }

            digitalValue.parentNode.setAttributeNS(null, "transform", "translate("
                + parseInt(textBox.getBBox().x + (textBox.getBBox().width / 2
                    - digitalValue.parentNode.getBBox().width / 2)
                    - digitalValue.parentNode.getBBox().x)
                + "," + parseInt(textBox.getBBox().y +
                    (textBox.getBBox().height / 2 - digitalValue.parentNode.getBBox().height / 2)
                    - digitalValue.parentNode.getBBox().y) + ")");
        }
    }

    return that;
};

/**
 * SVG component represents Gauge.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT}
 * @returns {REX.UI.SVG.Gauge} New SVG Gauge component
 */
REX.UI.SVG.Gauge270 = function(svgElem,args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem,args);
    // Store options for simple usage
    var $o = that.options || {};
    
    // Load options or default values
    var r_min = parseFloat(that.check($o.rangeMin,0));         //minimum rozsahu
    var r_max = parseFloat(that.check($o.rangeMax,100));       //maximum rozsahu
    var tick_step = that.check($o.tickStep,5);               //krok maleho tiku
    var main_tick_step = that.check($o.mainTickStep,10);     //krok hlavniho tiku s oznacenim
    var decimals = that.check($o.decimals||$o.digitalPrecision,2); //pocet desetinnych mist pro zaokrouhleni digitalni hodnoty
    var o_units = $o.units || " ";                  //jednotky
    var colorZones = $o.colorZones || null; //barevne rozsahy
    var colorOffLimits = $o.colorOffLimits || "#ff7400";
    var fSize = 28;

    // Get SVG elements for manipulation
    var gauge_area = that.getChildByTag("gauge_area");   //cely objekt
    var hand = that.getChildByTag("hand");               //rucicka
    var hand1 = that.getChildByTag("hand1");             //1.cast rucicky
    var hand2 = that.getChildByTag("hand2");             //2.cast rucicky
    var middle_circle = that.getChildByTag("middle");    //kruhovy stred
    var border = that.getChildByTag("border");           //okraj
    var tick_0 = that.getChildByTag("tick_0");           //maly tik v pocatku
    var main_tick_0 = that.getChildByTag("main_tick_0"); //hlavni oznaceny tik v pocatku
    var digitalValue = that.getChildByTag("digitalval");   //digitalni hodnota
    var units = that.getChildByTag("units");             //jednotky
    var textBox = that.getChildByTag("text_box");        // prostor pro vykresleni hodnoty
    // Deprecated warning
    if(!textBox){that.log.warn(that.id +': Please upgrade this component');}

    //Global variables
    var center_x = gauge_area.getBBox().width / 2;     //x-ova souradnice stredu 
    var center_y = gauge_area.getBBox().height / 2     //y-ova souradnice stredu 
    var tick_counter;               //pocet malych tiku
    var main_tick_counter;          //pocet hlavnich oznacenych tiku 
    var main_tick_size = 5;
    var main_tick_color = "#ffffff";
    var tick_angle;                 //uhel mezi jednotlivymi tiky
    var labels = new Array();       //pole hodnot pro popis osy

    //Fill color, opacity, size
    tick_0.setAttributeNS(null, "style", "fill:#ffffff");
    main_tick_0.setAttributeNS(null, "style", "fill-opacity:0");
    tick_0.setAttributeNS(null, "height", tick_0.getBBox().height / 2);
    tick_0.setAttributeNS(null, "y", tick_0.getBBox().y + tick_0.getBBox().height * 2 / 2 - tick_0.getBBox().height / 2);
    hand.setAttributeNS(null, "style", "fill-opacity:1");

    //Set units
    units.textContent = ''+o_units;
    units.parentNode.setAttributeNS(null, "transform", "translate(" + parseInt((center_x - units.parentNode.getBBox().width / 2) - units.parentNode.getBBox().x) + "," + 0 + ")");

    //Draw ticks
    tick_counter = (Math.abs(r_max - r_min)) / tick_step;
    tick_angle = 270 / tick_counter;
    var i = 0;
    while (i <= tick_counter) {
        createTick(i, "#" + tick_0.id);
        i = i + 1;
    }
    //Draw main ticks
    main_tick_counter = (Math.abs(r_max - r_min)) / main_tick_step;
    tick_angle = 270 / main_tick_counter;
    i = 0;
    while (i <= main_tick_counter) {
        //createTick(i, "#main_tick_0");
        createMainTick(i);
        createLabel(i);
        i = i + 1;
    }

    //Draw color range
    for (var n = 0; n < colorZones.length; n++) {
        drawColorRange(parseFloat(colorZones[n].startValue), parseFloat(colorZones[n].endValue), colorZones[n].color);
    }

    // Change z-index on the top
    hand.parentNode.appendChild(hand);                   //posunuti rucicky v hierarchii uplne nahoru
    middle_circle.parentNode.appendChild(middle_circle); //posunuti kruhoveho stredu v hierarchii uplne nahoru

    // Add anonymous function as event listener. There are two events
    // 'read' - it is called every time when item is read
    // 'change' - called for the first time and every time item value is changed    
    that.$c.value.on('change', function(itm) {
        var value = itm.getValue();
        var angle = (value - r_min) * (270 / Math.abs(r_max - r_min));
        if (value >= r_min && value <= r_max) {
            hand1.setAttributeNS(null, "transform", "rotate(" + angle + "," + center_x + "," + center_y + ")");
            hand2.setAttributeNS(null, "transform", "rotate(" + angle + "," + center_x + "," + center_y + ")");
            digitalValue.style.fill = "#00ffff";
            border.setAttributeNS(null, "style", "fill:#000000");
        } else {
            if (value > r_max) {
                hand1.setAttributeNS(null, "transform", "rotate(" + 270 + "," + center_x + "," + center_y + ")");
                hand2.setAttributeNS(null, "transform", "rotate(" + 270 + "," + center_x + "," + center_y + ")");
                digitalValue.style.fill = colorOffLimits;
                border.style.fill = colorOffLimits;
                /*
                var tmp = r_min;
                r_min = r_min + 0.5 * Math.abs(r_max - tmp);
                r_max = r_max + 0.5 * Math.abs(r_max - tmp);
                changeLabels();
                */
            } else {
                hand1.setAttributeNS(null, "transform", "rotate(" + 0 + "," + center_x + "," + center_y + ")");
                hand2.setAttributeNS(null, "transform", "rotate(" + 0 + "," + center_x + "," + center_y + ")");
                digitalValue.style.fill = colorOffLimits;
                border.style.fill = colorOffLimits;
                /*
                var tmp = r_min;
                r_min = r_min - 0.5 * Math.abs(r_max - tmp);
                r_max = r_max - 0.5 * Math.abs(r_max - tmp);
                changeLabels();
                */
            }
        }
        digitalValue.innerHTML = value.toFixed(decimals);
        transformDisplay()
    });

    function createTick(i,tick_type) {
        var mat_a = Math.cos((tick_angle * i) * Math.PI / 180);
        var mat_b = Math.sin((tick_angle * i) * Math.PI / 180);
        var mat_e = (-center_x) * Math.cos((tick_angle * i) * Math.PI / 180) + center_y * Math.sin((tick_angle * i) * Math.PI / 180) + center_x;
        var mat_f = (-center_x) * Math.sin((tick_angle * i) * Math.PI / 180) - center_y * Math.cos((tick_angle * i) * Math.PI / 180) + center_y;

        var elem = document.createElementNS("http://www.w3.org/2000/svg", "use");
        elem.setAttributeNS("http://www.w3.org/1999/xlink", "href", tick_type);
        elem.setAttributeNS(null, "transform", "matrix(" + mat_a + "," + mat_b + "," + -mat_b + "," + mat_a + "," + mat_e + "," + mat_f + ")");
        gauge_area.appendChild(elem);
    }

    function createMainTick(i) {
        var x = center_x + Math.sqrt(center_x / 1.888 * center_x / 1.888 + center_y / 1.888 * center_y / 1.888) * Math.cos((225 - tick_angle * i) * Math.PI / 180);
        var y = center_y - Math.sqrt(center_x / 1.888 * center_x / 1.888 + center_y / 1.888 * center_y / 1.888) * Math.sin((225 - tick_angle * i) * Math.PI / 180);

        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttributeNS(null, "cx", x);
        circle.setAttributeNS(null, "cy", y);
        circle.setAttributeNS(null, "r", main_tick_size);
        circle.setAttributeNS(null, "fill", main_tick_color);
        circle.setAttributeNS(null, "style", "stroke:none");
        gauge_area.appendChild(circle);
    }

    function createLabel(i) {
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        var x = center_x + Math.sqrt(center_x/2 * center_x/2 + center_y/2 * center_y/2) * Math.cos((225 - tick_angle * i) * Math.PI / 180);
        var y = center_y - Math.sqrt(center_x/2 * center_x/2 + center_y/2 * center_y/2) * Math.sin((225 - tick_angle * i) * Math.PI / 180);
        var font_size = 28;
        if (i > 0 && i < main_tick_counter) {
            y = y + font_size/2;
        }
        if (i == main_tick_counter / 2) {
            x = x - font_size / 3;
            y = y + font_size / 4;
        }
        if (i > main_tick_counter / 2) {
            x = x - font_size*1.1;
        }
        text.setAttributeNS(null, "x", x);
        text.setAttributeNS(null, "y", y);
        text.setAttributeNS(null, "fill", "#ffffff");
        text.setAttributeNS(null, "style", "font-size:" + font_size + "px; font-family:Arial");
        text.textContent = Math.round((parseFloat(r_min) + i * main_tick_step) * 100) / 100;
        gauge_area.appendChild(text);
        labels[i] = text;

    }

    function changeLabels() {
        for (var i = 0; i < labels.length; i++) {
            labels[i].textContent = Math.round((parseFloat(r_min) + i * main_tick_step)*100)/ 100;
        }
    }

    function drawColorRange(startValue,endValue,color) {
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        var x = center_x + Math.sqrt(center_x / 2 * center_x / 2 + center_y / 2 * center_y / 2) * Math.cos((225) * Math.PI / 180);
        var y = center_y - Math.sqrt(center_x / 2 * center_x / 2 + center_y / 2 * center_y / 2) * Math.sin((225) * Math.PI / 180);
        path.setAttributeNS(null, "style", "fill:none; stroke:" + color + "; stroke-width:10; stroke-opacity:0.7");
        path.setAttributeNS(null, "d", "M " + x + " " + y);
        gauge_area.appendChild(path);

        if (startValue < r_min) startValue = r_min;
        if (endValue > r_max) endValue = r_max;

        var startAngle = (startValue - r_min) * (270 / Math.abs(r_max - r_min));
        var endAngle = (endValue - r_min) * (270 / Math.abs(r_max - r_min));
        var i = 0;
        while (startAngle <= endAngle) {
            var radians = ((225 -startAngle) / 180) * Math.PI;
            //var px = center_x + Math.cos(radians) * Math.sqrt(center_x / 3 * center_x / 3 + center_y / 3 * center_y / 3);
            //var py = center_y - Math.sin(radians) * Math.sqrt(center_x / 3 * center_x / 3 + center_y / 3 * center_y / 3);
            var px = center_x + Math.cos(radians) * Math.sqrt(center_x/1.558 * center_x/1.558 + center_y/1.558 * center_y/1.558);
            var py = center_y - Math.sin(radians) * Math.sqrt(center_x / 1.558 * center_x / 1.558 + center_y / 1.558 * center_y / 1.558);
            //var px = center_x + Math.cos(radians) * Math.sqrt(center_x / 1.46 * center_x / 1.46 + center_y / 1.46 * center_y / 1.46);
            //var py = center_y - Math.sin(radians) * Math.sqrt(center_x / 1.46 * center_x / 1.46 + center_y / 1.46 * center_y / 1.46);
            var e = path.getAttribute("d");
            if (i == 0) {
                var d = e + " M " + px + " " + py;
            } else {
                var d = e + " L " + px + " " + py;
            }
            path.setAttributeNS(null, "d", d);
            startAngle += 0.5;
            i++;
        }
    }

    function transformDisplay() {
        if (textBox) {
            var fontSize = digitalValue.style.fontSize || digitalValue.parentNode.style.fontSize;
            if (digitalValue.parentNode.getBBox().width >= textBox.getBBox().width * 0.95) {
                digitalValue.style.fontSize = parseFloat(fontSize.substring(0, fontSize.indexOf('p'))) * 0.90 + "px";
            }
            else if (digitalValue.parentNode.getBBox().width < textBox.getBBox().width * 0.80
                && parseFloat(fontSize.substring(0, fontSize.indexOf('p'))) * 1.05 < fSize) {
                digitalValue.style.fontSize = parseFloat(fontSize.substring(0, fontSize.indexOf('p'))) * 1.05 + "px";
            }

            digitalValue.parentNode.setAttributeNS(null, "transform", "translate("
                + parseInt(textBox.getBBox().x + (textBox.getBBox().width / 2
                    - digitalValue.parentNode.getBBox().width / 2)
                    - digitalValue.parentNode.getBBox().x)
                + "," + parseInt(textBox.getBBox().y +
                    (textBox.getBBox().height / 2 - digitalValue.parentNode.getBBox().height / 2)
                    - digitalValue.parentNode.getBBox().y) + ")");
        }
    }

    return that;
};


REX.UI.SVG.GaugeBars = function(svgElem,args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem,args);
    // Store options for simple usage
    var $o = that.options || {};
    
    // Load options or default values
    var r_min = parseFloat(that.check($o.rangeMin,0));         //minimum rozsahu
    var r_max = parseFloat(that.check($o.rangeMax,100));       //maximum rozsahu
    var decimals = that.check($o.decimals,0);   //pocet desetinnych mist pro zaokrouhleni digitalni hodnoty
    var o_units = $o.units || "%";                  //jednotky    
    var o_label = $o.label || "power";              //obsah popisku
    
    // Get SVG elements for manipulation
    var text = that.getChildByTag("text");             //hodnota textove
    var label = that.getChildByTag("label");           //popisek  
    
    var ticks = $(that.element).find('[rexsvg\\:tag="tick"]');
    var ticksCount = ticks.length;
    // var range = r_max-r_min;
    //Set units
    label.textContent = ''+o_label;    

    that.$c.value.on('change', function(itm) {
        
        var value = itm.getValue();            
        var actTickCount = Math.round((value - r_min) * (ticksCount / Math.abs(r_max - r_min)));
        ticks.slice(0,actTickCount).hide();
        ticks.slice(actTickCount).show();
        text.textContent = value.toFixed(decimals) + ' ' + o_units;
    });

    

    return that;
};


REX.UI.SVG.GaugeGradient = function(svgElem,args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem,args);
    // Store options for simple usage
    var $o = that.options || {};
    var r_min = parseFloat(that.check($o.rangeMin,0));         //minimum rozsahu
    var r_max = parseFloat(that.check($o.rangeMax,100));       //maximum rozsahu
    
    // Load options or default values        
    
    var overlay = $(that.getChildByTag("overlay"));
    
     
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, radius, startAngle, endAngle){
        
        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);        

        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";        
        
        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, arcSweep, 0, end.x, end.y,            
            //"L", x,y,
            //"L", start.x, start.y            
        ].join(" ");
        return d;
    }

    /**
     * Return necessary information about Path (arc) object
     * @param svgPath - SVG Path
     * @param max {Number} - maximum when the circle is full
     * @returns {{element: svhPath, cx: Number, cy: Number, rx: Number, ry: Number, max: *, current: *}}
     */
    function initArc(svgPath,start) {
        return {
            element:svgPath,
            cx: parseFloat(svgPath.attr('sodipodi:cx')),
            cy: parseFloat(svgPath.attr('sodipodi:cy')),
            rx: parseFloat(svgPath.attr('sodipodi:rx')),
            ry: parseFloat(svgPath.attr('sodipodi:ry')),
            start: start,
            current: 0,
            update: function(current,cw){
                this.current = current;
                var arc;
                if(!cw){
                    arc = describeArc(this.cx,this.cy,this.rx,start,current);
                }
                else{
                    arc = describeArc(this.cx,this.cy,this.rx,current,start);
                }
                svgPath.attr('d',arc);
            }
        }
    }
    var greenArc = initArc($(that.getChildByTag("greenBar")),135);
    var redArc = initArc($(that.getChildByTag("redBar")),405);    
    
    var init = true;    
    that.$c.value.on('change', function(itm) {        
        if(init){overlay.hide();init=false;}                        
        var value = (itm.getValue() - r_min)/ Math.abs(r_max - r_min);        
        // Saturation
        if(value>1){value = 1;}
        if(value<0){value = 0;}
        
        greenArc.update(135+(270*value));
        redArc.update(405-(270*(1-value)),true);
    });

    

    return that;
};

/**
 * SVG component represents General Component with multiple transformation
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT} 
 * @returns {REX.UI.SVG.GeneralComponent} New Genral Component component
 */
REX.UI.SVG.GeneralComponent = function(svgElem, args) {
    var that = new REX.UI.SVG.Component(svgElem, args);
    var $o = that.options || {};

    $o.changeFill = that.check($o.changeFill,"True");

    var bbox = that.element.getBBox(),
            ocmi = $o.colorMin || ' ',
            ocma = $o.colorMax || ' ',
            R_min = hexToR(ocmi) || 0,
            G_min = hexToG(ocmi) || 0,
            B_min = hexToB(ocmi) || 0,
            R_max = hexToR(ocma) || 0,
            G_max = hexToG(ocma) || 0,
            B_max = hexToB(ocma) || 0,            
            changeFill = that.parseBoolean($o.changeFill),
            changeStroke = that.parseBoolean($o.changeStroke),
            rotationR = that.checkNumber($o.rotationRange,0),
            rotationSMax = that.checkNumber($o.rotationSignalMax,0),
            rotationSMin = that.checkNumber($o.rotationSignalMin,0),
            rotOffsetX = parseFloat(
                    that.element.getAttribute('inkscape:transform-center-x')) || 0,
            rotOffsetY = parseFloat(
                    that.element.getAttribute('inkscape:transform-center-y')) || 0,
            elemCenterX = bbox.x + bbox.width / 2,
            elemCenterY = bbox.y + bbox.height / 2,
            scaleMax = that.checkNumber($o.scaleMax,0),
            scaleMin = that.checkNumber($o.scaleMin,0),
            scaleSMax = that.checkNumber($o.scaleSignalMax,0),
            scaleSMin = that.checkNumber($o.scaleSignalMin,0),
            scaleX = that.parseBoolean($o.scaleX),
            scaleY = that.parseBoolean($o.scaleY),
            opacityMax = that.checkNumber($o.opacityMax,0),
            opacityMin = that.checkNumber($o.opacityMin,0),
            opacityR = opacityMax - opacityMin || 0,
            opacitySMax = that.checkNumber($o.opacitySignalMax,0),
            opacitySMin = that.checkNumber($o.opacitySignalMin,0),
            txR = that.checkNumber($o.xRange,0),
            txSMax = that.checkNumber($o.xSignalMax,0),
            txSMin = that.checkNumber($o.xSignalMin,0),
            tyR = that.checkNumber($o.yRange,0),
            tySMax = that.checkNumber($o.ySignalMax,0),
            tySMin = that.checkNumber($o.ySignalMin,0);
    
    that.element.setAttribute('transform', '');
    var tRotate,tTranslate,tScale,tScaleT;
    // K animaci se nove vyuziva nastaveni atributu primo objektu transformace. Diky tomu lze lehce nastavit vsechny typy
    // tranfsormaci nad stejnym objektem. Dulezite je tady jejich retezeni viz kod nize
    if(that.element.transform){
        that.element.transform.baseVal.clear();
        tTranslate = that.svg.createSVGTransform();
        tTranslate.setTranslate(0,0);        
        tScale = that.svg.createSVGTransform();
        tScale.setScale(1,1);    
        tScaleT = that.svg.createSVGTransform();
        tScaleT.setTranslate(0,0);
        tRotate = that.svg.createSVGTransform();
        tRotate.setRotate(0,0,0);        
        // Toto je potreba zachovat aby se objekt spravne animoval dle nastaveneho stredu pomoci atributu transform-center
        that.element.transform.baseVal.appendItem(tTranslate);
        that.element.transform.baseVal.appendItem(tScaleT);
        that.element.transform.baseVal.appendItem(tScale);        
        that.element.transform.baseVal.appendItem(tRotate);
    }

    

    that.changeColor = function(color) {
        if (REX.HELPERS.isNumber(color)) {
            var R, G, B, X;

            if (color > $o.colorSignalMin && color < $o.colorSignalMax) {
                R = Math.round(R_min + ((R_max - R_min) * (color - $o.colorSignalMin)) / ($o.colorSignalMax - $o.colorSignalMin));
                G = Math.round(G_min + ((G_max - G_min) * (color - $o.colorSignalMin)) / ($o.colorSignalMax - $o.colorSignalMin));
                B = Math.round(B_min + ((B_max - B_min) * (color - $o.colorSignalMin)) / ($o.colorSignalMax - $o.colorSignalMin));
                X = rgbToHex(R, G, B);
                if(changeFill){
                    that.element.style.fill = X;
                }
                if(changeStroke){
                    that.element.style.stroke = X;
                }
            }
            else if (color <= $o.colorSignalMin) {
                if(changeFill){
                    that.element.style.fill = $o.colorMin;
                }
                if(changeStroke){
                    that.element.style.stroke = $o.colorMin;
                }
            }
            else if (color >= $o.colorSignalMax) {
                if(changeFill){
                    that.element.style.fill = $o.colorMax;
                }
                if(changeStroke){
                    that.element.style.stroke = $o.colorMax;
                }
            }
            else {
                if(changeFill){
                    that.element.style.fill = "grey";
                }
                if(changeStroke){
                    that.element.style.stroke = "grey";
                }
            }
            return;
        } else if (typeof color === 'string') {
            if(changeFill){
                that.element.style.fill = color;
            }
            if(changeStroke){
                that.element.style.stroke = color;
            }
        }
    };

    that.rotate = function (angle) {
        var angleR = rotationR * (angle - rotationSMin) / (rotationSMax - rotationSMin);
        if (tRotate) {
            tRotate.setRotate(angleR,(elemCenterX + rotOffsetX),(elemCenterY - rotOffsetY));
        }
        else { //Deprecated            
            var str = that.element.getAttribute('transform');
            var oldVal = getOldValue('rotate', str);
            var newVal = 'rotate(' + angleR + ',' + (elemCenterX + rotOffsetX) + ',' + (elemCenterY - rotOffsetY) + ')';
            str = str.replace(oldVal, newVal);
            that.element.setAttribute('transform', str);
        }
    };

    that.translate = function (val, axis) {
        if (tTranslate) {
            let tXa,tYa;
            if (axis === 'x') {
                tXa = txR * (val - txSMin) / (txSMax - txSMin);
                tYa = tTranslate.matrix.f;
            }
            else{
                tXa = tTranslate.matrix.e;
                tYa = tYa = tyR * (val - tySMin) / (tySMax - tySMin);
            }
            tTranslate.setTranslate(tXa,tYa);
        }
        else { // Deprecated
            var str, startI, endI, toReplace, newVal, oldVal;
            if (axis === 'x') {
                var tXa = txR * (val - txSMin) / (txSMax - txSMin),
                    str = that.element.getAttribute('transform'),
                    oldVal = getOldValue('translate', str);
                if (oldVal === '') {
                    newVal = 'translate(' + tXa + ',0)';
                }
                else {
                    startI = oldVal.search('\\(');
                    endI = oldVal.search(',');
                    toReplace = oldVal.slice(startI + 1, endI + 1);
                    newVal = oldVal.replace(toReplace, tXa + ',');
                }
            }
            else {
                var tYa = tyR * (val - tySMin) / (tySMax - tySMin),
                    str = that.element.getAttribute('transform'),
                    oldVal = getOldValue('translate', str);
                if (oldVal === '') {
                    newVal = 'translate(0,' + (-tYa) + ')';
                }
                else {
                    startI = oldVal.search(',');
                    endI = oldVal.search('\\\)');
                    toReplace = oldVal.slice(startI, endI);
                    newVal = oldVal.replace(toReplace, ',' + tYa);
                }
            }

            str = str.replace(oldVal, newVal);
            that.element.setAttribute('transform', str);
        }
    };

    that.scale = function(scale) {
        if(tScale){
            let scaleA = scaleMin + (scaleMax - scaleMin) * (scale - scaleSMin) / (scaleSMax - scaleSMin);
            let sx = scaleX?scaleA:1;
            let sy = scaleY?scaleA:1;
            tScaleT.setTranslate(((1 - sx) * (elemCenterX + rotOffsetX)),((1 - sy) * (elemCenterY - rotOffsetY)));
            tScale.setScale(sx,sy);
        }
        else{ // Deprecated
            if (scaleX || scaleY) {
                var oldVal, newVal;
                var scaleA = parseFloat(scaleMin) + (scaleMax - scaleMin) * (scale - scaleSMin) / (scaleSMax - scaleSMin),
                        str = that.element.getAttribute('transform');
                oldVal = getOldValue('matrix', str);
                if (scaleX && !scaleY) {
                    newVal = 'matrix(' + scaleA + ',0,0,1,' + ((1 - scaleA) * (elemCenterX + rotOffsetX)) + ',0)';
                }
                if (!scaleX && scaleY) {
                    newVal = 'matrix(1,0,0,' + scaleA + ',0,' + ((1 - scaleA) * (elemCenterY - rotOffsetY)) + ')';
                }
                if (scaleX && scaleY) {
                    newVal = 'matrix(' + scaleA + ',0,0,' + scaleA + ',' + ((1 - scaleA) * (elemCenterX + rotOffsetX)) + ',' + ((1 - scaleA) * (elemCenterY - rotOffsetY)) + ')';
                }
                str = str.replace(oldVal, newVal);
                that.element.setAttribute('transform', str);
            }
        }
        
    };

    that.opacity = function(opacity) {
        var opacityA = opacityMin + opacityR * (opacity - opacitySMin) / (opacitySMax - opacitySMin);
        that.element.setAttribute('opacity', Math.abs(opacityA));
        if (opacityA <= 0) {
            $(that.element).css('pointer-events', 'none');
        }
        else
            $(that.element).css('pointer-events', 'auto');
    };

    if (typeof that.$c.COLOR !== "undefined") {                
        removeColorAttrFromChildren();
        if(changeFill){
            that.element.style.fill = "grey";
        }
        if(changeStroke){
            that.element.style.stroke = "grey";
        }        
        that.$c.COLOR.on('change', function(i) {
            that.changeColor(i.getValue());
            that.emit('color');
        });
    }
    if (typeof that.$c.ROTATE !== "undefined") {
        that.$c.ROTATE.on('change', function(i) {
            that.rotate(i.getValue());
            that.emit('rotate');
        });
    }
    if (typeof that.$c.TRANSLATE_X !== "undefined") {
        that.$c.TRANSLATE_X.on('change', function(i) {
            that.translate(i.getValue(), 'x');
            that.emit('translate-x');
        });
    }
    if (typeof that.$c.TRANSLATE_Y !== "undefined") {
        that.$c.TRANSLATE_Y.on('change', function(i) {
            that.translate(i.getValue(), 'y');
            that.emit('translate-y');
        });
    }
    if (typeof that.$c.SCALE !== "undefined") {
        that.$c.SCALE.on('change', function(i) {
            that.scale(i.getValue());
            that.emit('scale');
        });
    }
    if (typeof that.$c.OPACITY !== "undefined") {
        that.$c.OPACITY.on('change', function(i) {
            that.opacity(i.getValue());
            that.emit('opacity');
        });
    }

    // Deprecated
    function getOldValue(option, string) {
        var startVal = string.search(option + '\\(');
        if (startVal > -1) {
            string = string.slice(startVal);
            var endVal = string.search('\\\)');
            return string.slice(0, endVal + 1);
        }
        else
            return '';
    }

    function removeColorAttrFromChildren() {
        var childNodes = Array.prototype.slice.call(that.element.childNodes);

        for (var i = 0; i < childNodes.length; i++) {
            var item = childNodes[i];
            if (item.getAttribute) {
                if(changeFill){
                    item.style.fill = '';
                }
                if(changeStroke){
                    item.style.stroke = '';
                }                
            }
            childNodes = childNodes.concat(Array.prototype.slice.call(item.childNodes));
        }
    }
    function rgbToHex(R, G, B) {
        return '#' + toHex(R) + toHex(G) + toHex(B);
    }
    function toHex(n) {
        n = parseInt(n, 10);
        if (isNaN(n))
            return "00";
        n = Math.max(0, Math.min(n, 255));
        return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
    }
    
    function hexToR(h) {
        return parseInt((cutHex(h)).substring(0, 2), 16);
    }
    
    function hexToG(h) {
        return parseInt((cutHex(h)).substring(2, 4), 16);
    }
    
    function hexToB(h) {
        return parseInt((cutHex(h)).substring(4, 6), 16);
    }
    
    function cutHex(h) {
        return (h.charAt(0) === "#") ? h.substring(1, 7) : h;
    }

    // Refresh component to be shown in Firefox
    that.hide();
    setTimeout(()=>{that.show();},100);
    return that;
};

REX.UI.SVG.ImageChanger = function(svgElem, args) {
     // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem, args);
    var $o = that.options || {};
	var imagePath = that.check($o.imagePath,'./image.png');
	var appendKey = that.parseBoolean($o.appendKey)

    // Trend
    var svgImage = SVG.adopt(that.getChildByTag("image")); //image
	
	that.$c.refresh_from.on('change',function(itm){
		var path = imagePath;
		if(appendKey){
			path = path.replace('{0}',itm.getValue())
		}
		path += '?version='+ new Date().getTime().toString(32); // Add some hash to refresh image
		svgImage.attr('xlink:href',path);
    });

    return that;
};
/**
 * SVG component represents numeric input.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT} 
 * @returns {REX.UI.SVG.Fan} New SVG numeric input component
 */
REX.UI.SVG.Input = function (svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.HTMLComponent(svgElem, args);
    var $o = that.options || {};
    var $div = $(that.div);

    var format = ($o.format || '').toLowerCase();
    var fontScale = parseFloat(that.check($o.fontScale, 1));
    var align = that.check($o.textAlign, 'left');
    var min = validateNumericOption('min', $o, -Number.MAX_VALUE);
    var max = validateNumericOption('max', $o, Number.MAX_VALUE);
    var scale = validateNumericOption('scale', $o, 1);
    var offset = validateNumericOption('offset', $o, 0);
    var decimals = validateNumericOption('decimals', $o, 2);
    var setOnBlur = that.parseBoolean($o.setOnBlur,false);    

    var virtualKeyboard = that.parseBoolean($o.virtualKeyboard,false);
    var writePerm = that.check($o.writePerm, []);

    var readOnly = false;

    // value_R and value_W remains for backward compatibility
    that.$c.refresh_from = that.$c.refresh_from || that.$c.value_R || that.$c.value || that.$c.value_W;
    that.$c.value = that.$c.value || that.$c.value_W;

    var input = $(document.createElement('input'));
    input.attr('type', 'text');
    input.attr('value', 'NaN');
    input.attr('name', 'value');
    input.attr('class', 'rex__input rex__input--default');
    input.css('width', '100%');
    input.css('height', '100%');
    $div.append(input);
    $(input).css({'text-align':align});

    if ($o.css) {
        if (typeof $o.css === 'object') {
            $(input).css($o.css);
        }
        else {
            that.log.error(that.id + "css property is not an object. Write it as a value pair JSON object");
        }
    }

    // Init font autoresize
    function updateFontSize() {
        var ctm = that.svg.getScreenCTM();
        // Scale according the width or height which is better
        if (ctm) {
        input.css('font-size', Math.min(ctm.a, ctm.d) * fontScale + 'em');
    }
    }

    updateFontSize();
    $(window).resize(function () {
        updateFontSize();
    });
    

    function validateNumericOption(name, options, defaultValue) {
        if (options[name] && REX.HELPERS.isNumber(options[name])) {
            return Number(options[name]);
        }
        if (options[name] && !REX.HELPERS.isNumber(options[name]))
        {
            that.log.error(options.alias + ": "
                    + name
                    + " is not a number. Set to "
                    + defaultValue);
            options[name] = defaultValue;
            return options[name];
        }
        if (options[name] !== "" && options[name] == 0) {
            return options[name];
        }
        else {
            return defaultValue;
        }
    }
    
    if (that.$c.value.type === 'R') {
        that.log.error('Connection String: ' + that.$c.value.cstring + '(' + that.$c.value.alias + ') is read-only');
        return that;
    }

    var writeFailed = function(err){
        if(err.msg && err.msg.header.errno == -1){
            that.log.error(that.id +": Write failed! Unexpected value type.");
        }
        else{
            that.log.error(that.id +": Write failed!",err.msg || err);
        }
    };

    var refresh_from = that.$c.refresh_from;
    var dateSelected = false;
    if(!readOnly){
        switch (format) {
            case 'date':            
                input.datepicker({
                    dateFormat: 'dd.mm.yy',
                    onSelect: function() {
                        if (!that.isDisabled()) {
                            that.$c.value
                                .write(that.getREXSecondsFromDate(input.datepicker("getDate")))
                                .catch(writeFailed);
                            updateRefreshFromItemAfterWrite();
                        }
                    }
                });
                break;
            case 'time':
                input.timepicker({
                    // defautValue:"NaN",
                    parse: "loose",
                    alwaysSetTime: false,
                    timeFormat: "HH:mm",
                    onOpen:function(){
                        refresh_from.disableRefresh = true;
                    },
                    onSelect:function(date){
                        dateSelected = true;
                    },
                    onClose: function(date) {
                        // Save only if date was selected
                        if (date && dateSelected && !that.isDisabled())  {
                            that.$c.value
                                .write(that.getREXSecondsFromDate(input.datetimepicker("getDate")))
                                .catch(writeFailed);
                            updateRefreshFromItemAfterWrite();
                        }
                        dateSelected = false;
                        refresh_from.disableRefresh = false;
                    }
                });
                break;
            case 'datetime':
                input.datetimepicker({
                    //defautValue:"NaN",
                    parse: "loose",
                    alwaysSetTime: false,
                    dateFormat: 'dd.mm.yy',
                    timeFormat: 'HH:mm',
                    onOpen:function(){
                        that.disableRefresh = true;
                    },
                    onSelect:function(date){
                        dateSelected = true;
                    },
                    onClose: function(date) {
                        // Save only if date was selected
                        if (date && dateSelected && !that.isDisabled()) {
                            that.$c.value
                                .write(that.getREXSecondsFromDate(input.datetimepicker("getDate")))
                                .catch(writeFailed);
                            updateRefreshFromItemAfterWrite();
                        }
                        dateSelected = false;
                        that.disableRefresh = false;
                    }
                });
    
                break;
            default:
                input.focus(function (evt) {
                    that.disableRefresh = true;
                }).blur(function (evt) {
                    if (setOnBlur) {
                        var e = $.Event("keypress");
                        e.which = 13; //choose the one you want
                        e.keyCode = 13;
                        input.trigger(e);
                    }
                    that.disableRefresh = false;
                    if (refresh_from) {
                        refresh_from.emit('change',refresh_from);
                    }
                });
                input.keypress(function (evt) {
                    var keyCode = evt.keyCode || evt.which;
                    if (keyCode === 13) { //Enter keycode
                        if (format === 'text') {
                            that.$c.value.write(input.prop('value')).catch(writeFailed);
                            updateRefreshFromItemAfterWrite();
                        }
                        else {
                            var numberStr = input.prop('value').replace(',', '.');
                            if (REX.HELPERS.isNumber(numberStr)) {
                                var number = Number(numberStr);
                                if (number >= min && number <= max) {
                                    input.removeClass('ui-state-error');
                                    if (!that.isDisabled()) {
                                        number = (number - offset) / scale;
                                        that.$c.value.write(number).catch(writeFailed);
                                        updateRefreshFromItemAfterWrite();
                                    }
                                }
                                else {
                                    // TODO: Show tootltip with range
                                    input.addClass('ui-state-error');
                                    return;
                                }
                            }
                            else {
                                input.addClass('ui-state-error');
                            }
                        }
                    }
    
                });
                input.keyup(function(evt) {
                    var keyCode = evt.keyCode || evt.which;
                    if (keyCode === 27) { //ESC keycode
                        var setOnBlurTmp = setOnBlur;
                        // Temporary disable set on blur behaviour for ESC key
                        setOnBlur = false;
                        input.blur();
                        setOnBlur = setOnBlurTmp;
                    }
                });
                break;
        }
    }
    

    function updateRefreshFromItemAfterWrite() {
        // Temporary save the same value to the refreshfrom item
        if (refresh_from) {
            refresh_from.setValue(that.$c.value.getValue());
        }
    }

    function refresh(itm) {
        switch (format) {
            case 'date':
                input.datepicker("setDate", that.getDateFromREXSeconds(itm.value));
                break;
            case 'time':
                input.datetimepicker('setDate', that.getDateFromREXSeconds(itm.value));
                break;
            case 'datetime':
                input.datetimepicker("setDate", that.getDateFromREXSeconds(itm.value));
                break;
            case 'text':
                input.prop("value",'' + itm.value);
                break;
            default:
                    var resultValue = (itm.value * scale) + offset;
                    input.prop("value",'' + resultValue.toFixed(decimals));
                break;
        }
    }

    refresh_from.on('change', function (itm) {
        if (!refresh_from.disableRefresh) {
            refresh(itm);
        }
    });

    // Override disable and enable function
    var old_disable = that.disable;
    that.disable = function () {
        input.addClass('ui-state-disabled');
        old_disable.apply(this, arguments);
    };
    var old_enable = that.enable;
    that.enable = function () {        
        input.removeClass('ui-state-disabled');
        old_enable.apply(this, arguments);
    };

    if(virtualKeyboard){
        input.keyboard({
            // *** choose layout ***
            layout: 'custom',
            // Qwerty only with Accept key
            customLayout: {
                default: ['7 8 9 {b}',
                    '4 5 6 -',
                    "1 2 3 +",
                    '0 . {clear} {a}']
            },
//        position: {
//            of: '#Input-div input', // optional - null (attach to input/textarea) or a jQuery object (attach elsewhere)
//            my: 'center top',
//            at: 'center top'
//        },
            // preview added above keyboard if true, original input/textarea used if false
            usePreview: false,
            // if true, the keyboard will always be visible
            alwaysOpen: false,
            // give the preview initial focus when the keyboard becomes visible
            initialFocus: false,
            // if true, keyboard will remain open even if the input loses focus.
            stayOpen: false,
            // *** Useability ***
            // Auto-accept content when clicking outside the keyboard (popup will close)
            autoAccept: false,
            // Prevents direct input in the preview window when true
            lockInput: false,
            // Prevent keys not in the displayed keyboard from being typed in
            restrictInput: false,
            // Check input against validate function, if valid the accept button is clickable;
            // if invalid, the accept button is disabled.
            acceptValid: false,
            // Use tab to navigate between input fields
            tabNavigation: false,
            // press enter (shift-enter in textarea) to go to the next input field
            enterNavigation: false,
            // mod key options: 'ctrlKey', 'shiftKey', 'altKey', 'metaKey' (MAC only)
            enterMod: 'altKey', // alt-enter to go to previous; shift-alt-enter to accept & go to previous

            // if true, the next button will stop on the last keyboard input/textarea; prev button stops at first
            // if false, the next button will wrap to target the first input/textarea; prev will go to the last
            stopAtEnd: true,
            // Set this to append the keyboard immediately after the input/textarea it is attached to.
            // This option works best when the input container doesn't have a set width and when the
            // "tabNavigation" option is true
            appendLocally: false,
            // If false, the shift key will remain active until the next key is (mouse) clicked on;
            // if true it will stay active until pressed again
            stickyShift: true,
            // Prevent pasting content into the area
            preventPaste: false,
            // Set the max number of characters allowed in the input, setting it to false disables this option
            maxLength: false,
            // Mouse repeat delay - when clicking/touching a virtual keyboard key, after this delay the key
            // will start repeating
            repeatDelay: 500,
            // Mouse repeat rate - after the repeatDelay, this is the rate (characters per second) at which the
            // key is repeated. Added to simulate holding down a real keyboard key and having it repeat. I haven't
            // calculated the upper limit of this rate, but it is limited to how fast the javascript can process
            // the keys. And for me, in Firefox, it's around 20.
            repeatRate: 20,
            // resets the keyboard to the default keyset when visible
            resetDefault: false,
            // Event (namespaced) on the input to reveal the keyboard. To disable it, just set it to ''.
            openOn: 'focus',
            // When the character is added to the input
            keyBinding: 'mousedown touchstart',
            // combos (emulate dead keys : http://en.wikipedia.org/wiki/Keyboard_layout#US-International)
            // if user inputs `a the script converts it to à, ^o becomes ô, etc.
            useCombos: false,
            accepted:function(e, keyboard, el){
                input.trigger($.Event('keypress', {keyCode:13}));
            },
            visible:function(e, keyboard, el){
                // Clear value on open
                keyboard.$preview.val("");
            }
        });
    }

    that.setReadOnly = function(){
        readOnly = true;
        if(virtualKeyboard){
            input.keyboard().getkeyboard().destroy();
        }
        input.off().removeData();        
        input.attr('disabled',"");
        input.addClass('rex__input--read-only');
    };

    that.setPermissions = function(whoami){
        let login = whoami.login;
        if(writePerm && writePerm.length > 0){
            for(p of writePerm){
                if(p.login.toLowerCase() === login.toLowerCase().trim()){
                    return;
                }                    
            }
            that.log.debug('Login '+login+' not fount in write permission list.');
            that.setReadOnly();
        }
    };

    that.disable();
    return that;
};
/**
 * SVG component represents Led.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT}
 * @returns {REX.UI.SVG.Led} New SVG Led component
 */

REX.UI.SVG.Led = function (svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem, args);
    // Store options for simple usage
    var $o = that.options || {};

    $o.colorFalse = that.check($o.colorFalse, that.COLORS.false);
    $o.colorTrue = that.check($o.colorTrue, that.COLORS.primary);
    let colorError = that.check($o.colorError, that.COLORS.error);

    let colorTrue = that.parseBoolean($o.reverseMeaning) ? $o.colorFalse : $o.colorTrue;
    let colorFalse = that.parseBoolean($o.reverseMeaning) ? $o.colorTrue : $o.colorFalse;

    // Get SVG elements for manipulation    
    let led = that.getChildByTag("main");
    if(!led){
        that.log.error('You are using the old version of the Led component, do a Full upgrade or replace with new from library.');        
        that.disable();
        // Vypne funkci enable a ukonci ostatni inicializace
        that.enable=function(){};
        return that;
    }

    let $led = $(led);

    that.$c.value.on('change', function (i) {
        if (!that.isDisabled()) {
            refresh();
        }
    });

    if (that.$c.error_by) {
        that.$c.error_by.on('change', function (i) {
            refresh();
        });
    }


    function refresh() {
        if (that.$c.error_by && that.$c.error_by.getValue()) {
            $led.css("fill", colorError);
        }
        else {
            if (that.$c.value.getValue()) {
                $led.css("fill", colorTrue);
            } else {
                $led.css("fill", colorFalse);
            }

        }

    }

    var oldDisable = that.disable;
    that.disable = function () {
        oldDisable.apply(that, arguments);
        $led.css("fill", that.COLORS.false);
    };

    var oldEnable = that.enable;
    that.enable = function () {
        oldEnable.apply(that, arguments);
        refresh();
    };

    return that;
};

/**
 * Status component with label
 * @param svgElem
 * @param args
 * @returns {*}
 * @constructor
 */
REX.UI.SVG.LedLabel = function (svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem,args);
    // Store options for simple usage
    var $o = that.options || {};

    // Load options or default values
    var label_false = $o.label_false || ($o.reverse_meaning ? "NOK(1)" : "NOK(0)");
    var label_true = $o.label_true || ($o.reverse_meaning ? "OK(0)" : "OK(1)");
    var reverse_meaning = $o.reverse_meaning || false;
    var color_false = $o.color_false || "#E74E3E";
    var color_true = $o.color_true || "#46B281";

    // Get SVG elements for manipulation
    var svgLabel = that.getChildByTag("label");//tspan
    var svgLed = that.getChildByTag("led"); //rect
    var $svgLed = $(svgLed);

    // Backward compatibility
    that.$c.value = that.$c.value || that.$c.STATUS;

    that.$c.value.on('change', function (i) {
        if (!that.isDisabled()) {
            refresh();
        }
    });

    function refresh() {
        if (that.$c.value.getValue() == reverse_meaning) {
            svgLabel.textContent = label_false;
            if (color_false) {
                $svgLed.css('fill', color_false);
            }
        }
        else {
            svgLabel.textContent = label_true;
            if (color_true) {
                $svgLed.css('fill', color_true);
            }
        }
    }

    var oldDisable = that.disable;
    that.disable = function () {
        oldDisable.apply(that, arguments);
        svgLabel.textContent = "";
        $svgLed.css('fill', "#7f7f7f");
    };

    var oldEnable = that.enable;
    that.enable = function () {
        oldEnable.apply(that, arguments);
        refresh();
    };

    return that;
};












/**
 * SVG component represents PushOnOff.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT}
 * @returns {REX.UI.SVG.PushOnOff} New SVG PushOnOff component
 */

REX.UI.SVG.PushOnOff = function (svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem, args);
    // Store options for simple usage
    var $o = that.options || {};

    // Get options or default values
    var type = that.check($o.type,'PushButton');
    var onMouseDownValue = that.parseBoolean($o.reverseMeaning) ? 0 : 1;
    var colorFalse = that.check($o.colorFalse, "#FFFFFF");
    var colorTrue = that.check($o.colorTrue, that.COLORS.primary);
    
    // Heuristika. Pokud neni pro MP definovan cteci bod, pak se bude pouzivat pouze color False
    if(!that.$c.refresh_from && (type === 'ManualPulse' || type === 'ManualPulseRpt')){        
        colorTrue = colorFalse;
    }

    that.$c.refresh_from = that.$c.refresh_from || that.$c.value;

    // Get SVG elements for manipulation
    var baseEl = that.getChildByTag("button"),
        mainEl = that.getChildByTag("main"),  
        hoverEl = that.getChildByTag("hover"),
        activeEl = that.getChildByTag("active");

    //Global variables
    var centerX = baseEl.getBBox().width / 2,
        centerY = baseEl.getBBox().height / 2,                
        pressed = false,
        over = false,
        active = false;

    if (!baseEl) {
        that.log.error('You are using the old version of the PushOnOff component, do a Full upgrade or replace with new from library.');        
        that.disable();
        // Vypne funkci enable a ukonci ostatni inicializace
        that.enable=function(){};
        return that;
    }
    
    if (that.$c.value.type === 'R') {
        that.log.error('Connection String: ' + that.$c.value.cstring + '(' + that.$c.value.alias + ') is read-only');        
        that.disable();
        // Vypne funkci enable a ukonci ostatni inicializace
        that.enable=function(){};
        return that;
    }

    if (type === 'ToggleButton' && that.$c.value !== that.$c.refresh_from) {
        that.log.error(`Refresh_from datapoint is not supported in the Toggle mode!`);        
        that.disable();
        // Vypne funkci enable a ukonci ostatni inicializace
        that.enable=function(){};
        return that;
    }    


    function refresh() {
        let value = that.$c.refresh_from.getValue();
        if (value === (1 - onMouseDownValue) || value === null) {
            active = false;            
            mainEl.style.fill = colorFalse;
            
        }
        else {
            active = true;            
            mainEl.style.fill = colorTrue;
        }
    }
    
    that.$c.refresh_from.on('change', refresh);

    function writeFailed(err){        
        that.log.debug("Write failed",err);
        if(typeof(err) === 'string'){
            that.log.error(err);
        }
        else{
            that.log.error("Write failed",err);
        }
    }

    function stateHover(){
        hoverEl.style.display = 'block';
        activeEl.style.display = 'none';
    }

    function stateActive(){
        hoverEl.style.display = 'none';
        activeEl.style.display = 'block';
    }

    function stateNone(){
        hoverEl.style.display = 'none';
        activeEl.style.display = 'none';
    }

    $(baseEl).bind('mouseenter', function (evt) {
        over = true;                                
        stateHover();
    }).bind('touchstart mousedown', function (evt) {
        evt.preventDefault();
        if (evt.handled !== true) {
            if (!(evt.button && evt.button > 0)) {
                if (type === 'ToggleButton') {
                    if (!active) {
                        that.$c.value.write(onMouseDownValue).catch(writeFailed);
                        active = true;
                    }
                    else {
                        that.$c.value.write(1 - onMouseDownValue).catch(writeFailed);
                        active = false;
                    }
                }
                else if (type === 'ManualPulseRpt') {
                    let loopWrite = () => {
                        that.$c.value.write(onMouseDownValue)
                            .then(() => {
                                setTimeout(() => {
                                    if (pressed) { loopWrite(); }
                                }, 20);
                            })
                            .catch(writeFailed);
                    };
                    loopWrite();                    
                }
                else {                    
                    that.$c.value.write(onMouseDownValue).catch(writeFailed);
                }
                pressed = true;         
                stateActive();
                that.emit('mousedown');
            }
            evt.handled = true;
        } else {
            return false;
        }
    }).bind('touchend touchcancel touchleave mouseup mouseleave', function (evt) {
        evt.preventDefault();                
        if (evt.type === 'mouseup') {                
            stateHover();
        } else {                
            stateNone();
        }        
        over = false;
        if (evt.handled !== true) {
            // Primary mouse button only       
            // Invoke only when the button was pressed before
            if (!(evt.button && evt.button > 0) && pressed) {                
                if (type === 'PushButton') {
                    that.$c.value.write(1 - onMouseDownValue).catch(writeFailed);
                }
                that.emit('mouseup');
                pressed = false;
            }
        } else {
            return false;
        }
    }).bind('contextmenu', (evt) => { 
        // Disable context menu
        evt.preventDefault();
    });

    that.setReadOnly = function(){
        that.readOnly = true;                
        $(baseEl).off()
        .removeData()
        .css('pointer-events','none');
        stateNone();
    };

    var oldDisable = that.disable;
    that.disable = function () {
        oldDisable.apply(that, arguments);
        stateNone();
    };
    
    return that;
};

/**
 * SVG component represents SimpleLogger.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT} 
 * @returns {SimpleLogger} New HTML component
 */
REX.UI.SVG.SimpleLogger = function (svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.HTMLComponent(svgElem, args);
    var $div = $(that.div);
    
    var $o = that.options || {};
    var lines = that.checkNumber($o.lines, 1);
    var timestamp = that.parseBoolean($o.timestamp);
    var showKey = that.parseBoolean($o.showKey);
    var format = $o.format || "alt";

    $div.css({"white-space":"pre-wrap","overflow-x": "hidden","overflow-y": "auto","text-align": "left"});
    $div.addClass("rexhmi-ui-svg-simplelogger");

    if ($o.css) {
        if (typeof $o.css === 'object') {
            $div.css($o.css);
        }
        else {
            that.log.error(that.id + "css property is not an object. Write it as a value pair JSON object");
        }
    }
    
    var texts = {};
    // If text is defined than convert array to object where key is id (number)
    // and value is text
    if ($o.texts && $o.texts.length > 0) {
        var result = {};
        for (var i = 0; i < $o.texts.length; i++) {
            result[$o.texts[i].id] = $o.texts[i].text;
        }
        texts = result;
    }

    that.$c.value.on('change', function (itm) {
        var log_msg = '<div>';
        let val ="";
        if (timestamp) {
            var actDate = new Date();
            var hours = (actDate.getHours() < 10) ? "0" + actDate.getHours() : "" + actDate.getHours();
            var minutes = (actDate.getMinutes() < 10) ? "0" + actDate.getMinutes() : "" + actDate.getMinutes();
            var seconds = (actDate.getSeconds() < 10) ? "0" + actDate.getSeconds() : "" + actDate.getSeconds();
            log_msg += '<span class="logger-timestamp"><b>' + hours + ':' + minutes + ':' + seconds + '</b></span>';
        }
        if(showKey){
            val = (''+itm.getValue()).trim();
            log_msg+="<span class='logger-key'>"+val+"</span>";
        }
        log_msg+="<span class='logger-value'>";
        switch (format.toLowerCase()) {
            case 'text':
                log_msg += (''+itm.getValue()).trim();
                break;
            default:
                if (texts[itm.getValue()])
                    log_msg += texts[itm.getValue()];
                else{
                    log_msg += (''+itm.getValue()).trim();
                }
                break;
        }
        log_msg += '</span></div>';
        $div.prepend(log_msg);
        if ($div.children().length > lines) {
            $div.children().last().remove();
        }
        //$div.scrollTop($div[0].scrollHeight);
    });

    // Override disable and enable function
    var old_disable = that.disable;
    that.disable = function () {
        $div.addClass('ui-state-disabled');
        old_disable.apply(this, arguments);
    };
    var old_enable = that.enable;
    that.enable = function () {
        $div.removeClass('ui-state-disabled');
        old_enable.apply(this, arguments);
    };

    that.disable();
    return that;
};
/**
 * SVG component represents Slider.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT}
 * @returns {REX.UI.SVG.Slider} New SVG Slider component
 */

REX.UI.SVG.SliderHorizontal = function (svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem, args);
    // Store options for simple usage
    var $o = that.options || {};

    // value_R and value_W remains for backward compatibility
    that.$c.refresh_from = that.$c.refresh_from || that.$c.value_R || that.$c.value || that.$c.value_W;
    that.$c.value = that.$c.value || that.$c.value_W;

    // Get SVG elements for manipulation
    var sliderArea = that.getChildByTag("slider_area"),
        level = that.getChildByTag("slider_level"),
        levelBox = that.getChildByTag("slider_capacity"),
        dragPoint = that.getChildByTag("drag_point"),
        digitalValue = that.getChildByTag("digitalval"),
        textBox = that.getChildByTag("text_box");
    // Deprecated warning
    if (!textBox) { that.log.warn(that.id + ': Please upgrade this component'); }

    //Load options or default values
    var min = parseFloat(that.check($o.min, 0)),
        max = parseFloat(that.check($o.max, 100)),
        step = parseFloat(that.check($o.step, 1)),
        scale = parseFloat(that.check($o.scale, 1)),
        offset = parseFloat(that.check($o.offset, 0)),
        decimals = parseFloat(that.check($o.decimals, 0)),
        fScale = parseFloat(that.check($o.fontScale, 1)),
        fSize = fScale * 18,
        label = $o.label || "",
        writeOnChange = that.parseBoolean($o.writeOnChange);

    digitalValue.style.fontSize = (fScale * 18) + "px"
    createLabel();

    //Global variables
    var setPoint,
        setPointChanged = false,
        sliderActive = false,
        writeEnabled = true,
        activeArea = createActiveArea(),
        activePoint = activeArea.createSVGPoint();


    $(sliderArea).on('touchstart mousedown', sliderDown)
        .on('contextmenu', function (e) { e.stopPropagation(); return false; });
    $(window).on('touchmove mousemove', sliderMove);
    $(window).on('touchend touchcancel mouseup', sliderUp);


    that.$c.refresh_from.on('change', function (itm) {
        if (!that.$c.refresh_from.disableRefresh) {
            updateSlider((itm.getValue() * scale) + offset);
        }
    });

    function sendActiveStatus(active) {
        if (!that.$c.active) {
            return
        }
        // Start peridically updating the status when the slider is active
        that.$c.active.write(active)
            .then(() => {
                setTimeout(() => {
                    if (sliderActive) { sendActiveStatus(active); }
                }, 20);
            })
            .catch((err) => { that.log.error("Write failed", err); });
    }

    function writeValue() {
        if (writeEnabled) {
            var value = (parseFloat(setPoint) - offset) / scale;
            that.$c.value.write(value)
                .then(() => { writeEnabled = true; })
                .catch((err) => { that.log.error("Write failed", err); writeEnabled = true; });
            if (that.$c.value !== that.$c.refresh_from) {
                that.$c.refresh_from.setValue(value);
            }
            writeEnabled = false;
        }
    }

    function sliderDown(event) {
        event.stopPropagation();
        sliderActive = true;
        that.$c.refresh_from.disableRefresh = true;
        updatePosition(event);
        if (that.$c.active) { writeValue(); }
        sendActiveStatus(true);
    }

    function sliderMove(event) {     
        if (sliderActive) {
            updatePosition(event);
            if (writeOnChange) {
                writeValue()
            }
        }
    }

    function sliderUp(event) {
        if (sliderActive) {
            that.$c.refresh_from.disableRefresh = false;
            // To be sure that the sliderUp value will be written to the target
            writeEnabled = true;
            writeValue();
            sliderActive = false;
            sendActiveStatus(false);
        }
    }

    function updatePosition(event) {
        activePoint.x = typeof event.pageX !== 'undefined' ? event.pageX : event.originalEvent.touches[0].pageX;
        activePoint.y = typeof event.pageY !== 'undefined' ? event.pageY : event.originalEvent.touches[0].pageY;
        var newPoint = coordinateTransform(activePoint, activeArea);
        var position = newPoint.x;
        setValue(position);
        if (sliderActive) {
            // Saturace na meze slideru
            if (position < 0) {
                position = 0;
            }
            else if (position > levelBox.getBBox().width + 1) {
                position = levelBox.getBBox().width + 1;
            }

            dragPoint.setAttributeNS(null, "transform", "translate(" + parseFloat(position) + "," + 0 + ")");
            level.setAttributeNS(null, "width", position);
            digitalValue.textContent = setPoint.toFixed(decimals);
            transformDisplay();
        }
    }

    function setValue(val) {
        var relativeStep = (levelBox.getBBox().width) / (Math.abs(max - min) / step);
        if (val % relativeStep < relativeStep) {
            setPoint = min + Math.round(val / relativeStep) * step;
            if (setPoint < min) {
                setPoint = min;
            }
            else if (setPoint > max) {
                setPoint = max;
            }
        }
    }

    function updateSlider(setPointValue) {
        var setP = setPointValue;
        var position;
        if (setP >= min && setP <= max) {
            position = (setP - min) * (levelBox.getBBox().width) / Math.abs(max - min);
        } else {
            if (setP < min) {
                setP = min;
                position = 0;
            }
            else {
                setP = max;
                position = levelBox.getBBox().width;
            }
        }
        digitalValue.textContent = setP.toFixed(decimals);
        transformDisplay();
        dragPoint.setAttributeNS(null, "transform", "translate(" + parseFloat(position) + "," + 0 + ")");
        level.setAttributeNS(null, "width", position);
    }

    function coordinateTransform(screenPoint, someSvgObject) {
        var CTM = someSvgObject.getScreenCTM();
        if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
            var newCoordinates = screenPoint.matrixTransform(CTM.inverse());
            newCoordinates.x -= (levelBox.getBBox().x);
            return newCoordinates;
        } else {
            return screenPoint.matrixTransform(CTM.inverse());
        }
    }

    function createActiveArea() {
        var area = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        area.setAttribute('x', levelBox.getBBox().x);
        area.setAttribute('y', levelBox.getBBox().y);
        area.setAttribute('width', levelBox.getBBox().width);
        area.setAttribute('height', levelBox.getBBox().height);
        sliderArea.appendChild(area);
        return area;
    }

    function createLabel() {
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttributeNS(null, "fill", "#ffffff");
        text.setAttributeNS(null, "style", "font-size:" + fSize + "px; font-family:Arial");
        text.textContent = label;
        sliderArea.appendChild(text);
        text.setAttributeNS(null, "x", levelBox.getBBox().x + levelBox.getBBox().width / 2 - text.getBBox().width / 2);
        text.setAttributeNS(null, "y", (levelBox.getBBox().y + levelBox.getBBox().height + text.getBBox().height * 1.1));
    }

    function transformDisplay() {
        if (textBox) {
            var fontSize = digitalValue.style.fontSize;
            if (digitalValue.parentNode.getBBox().width >= textBox.getBBox().width * 0.9) {
                digitalValue.style.fontSize = parseFloat(fontSize.substring(0, fontSize.indexOf('p'))) * 0.9 + "px";
            }
            else if (digitalValue.parentNode.getBBox().width < textBox.getBBox().width * 0.85 && parseFloat(fontSize.substring(0, fontSize.indexOf('p'))) * 1.05 < fSize) {
                digitalValue.style.fontSize = parseFloat(fontSize.substring(0, fontSize.indexOf('p'))) * 1.05 + "px";
            }
            digitalValue.parentNode.setAttributeNS(null, "transform", "translate(" + parseInt(textBox.getBBox().x + (textBox.getBBox().width / 2
                    - digitalValue.parentNode.getBBox().width / 2) - digitalValue.parentNode.getBBox().x) + "," + parseInt(textBox.getBBox().y +
                    (textBox.getBBox().height / 2 - digitalValue.parentNode.getBBox().height / 2) - digitalValue.parentNode.getBBox().y) + ")");
        }
    }

    return that;
};
/**
 * SVG component represents Slider.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT}
 * @returns {REX.UI.SVG.Slider} New SVG Slider component
 */

REX.UI.SVG.SliderVertical = function (svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem, args);
    // Store options for simple usage
    var $o = that.options || {};

    // value_R and value_W remains for backward compatibility
    that.$c.refresh_from = that.$c.refresh_from || that.$c.value_R || that.$c.value || that.$c.value_W;
    that.$c.value = that.$c.value || that.$c.value_W;

    // Get SVG elements for manipulation
    var sliderArea = that.getChildByTag("slider_area"),
        level = that.getChildByTag("slider_level"),
        levelBox = that.getChildByTag("slider_capacity"),
        dragPoint = that.getChildByTag("drag_point"),
        digitalValue = that.getChildByTag("digitalval"),
        textBox = that.getChildByTag("text_box");

    // Deprecated warning
    if (!textBox) { that.log.warn(that.id + ': Please upgrade this component'); }

    //Load options or default values
    var min = parseFloat(that.check($o.min, 0)),
        max = parseFloat(that.check($o.max, 100)),
        step = parseFloat(that.check($o.step, 1)),
        scale = parseFloat(that.check($o.scale, 1)),
        offset = parseFloat(that.check($o.offset, 0)),
        decimals = parseFloat(that.check($o.decimals, 0)),
        fScale = parseFloat(that.check($o.fontScale, 1)),
        fSize = fScale * 18,
        label = $o.label || "",
        writeOnChange = that.parseBoolean($o.writeOnChange);

    digitalValue.style.fontSize = (fScale * 18) + "px";
    createLabel();
    level.setAttributeNS(null, "transform", "rotate(" + 180 + "," + (levelBox.getBBox().x +
    levelBox.getBBox().width / 2) + "," + (levelBox.getBBox().y + levelBox.getBBox().height) + ")");


    //Global variables
    var setPoint,
        setPointChanged = false,
        sliderActive = false,
        writeEnabled = true,
        activeArea = createActiveArea(),
        activePoint = activeArea.createSVGPoint();

    $(sliderArea).on('touchstart mousedown', sliderDown)
        .on('contextmenu', function (e) { e.stopPropagation(); return false; });
    $(window).on('touchmove mousemove', sliderMove);
    $(window).on('touchend touchcancel mouseup', sliderUp);

    that.$c.refresh_from.on('change', function (itm) {
        if (!that.$c.refresh_from.disableRefresh) {
            updateSlider((itm.getValue() * scale) + offset);
        }
    });

    function sendActiveStatus(active) {
        if (!that.$c.active) {
            return
        }
        // Start peridically updating the status when the slider is active
        that.$c.active.write(active)
            .then(() => {
                setTimeout(() => {
                    if (sliderActive) { sendActiveStatus(active); }
                }, 20);
            })
            .catch((err) => { that.log.error("Write failed", err); });
    }

    function writeValue() {
        if (writeEnabled) {
            var value = (parseFloat(setPoint) - offset) / scale;
            that.$c.value.write(value)
                .then(() => { writeEnabled = true; })
                .catch((err) => { that.log.error("Write failed", err); writeEnabled = true; });
            if (that.$c.value !== that.$c.refresh_from) {
                that.$c.refresh_from.setValue(value);
            }
            writeEnabled = false;
        }
    }

    function sliderDown(event) {
        event.stopPropagation();
        sliderActive = true;
        that.$c.refresh_from.disableRefresh = true;
        updatePosition(event);
        if (that.$c.active) { writeValue(); }
        sendActiveStatus(true);
    }

    function sliderMove(event) {        
        if (sliderActive) {
            updatePosition(event);
            if (writeOnChange) {
                writeValue()
            }
        }
    }

    function sliderUp(event) {
        if (sliderActive) {
            that.$c.refresh_from.disableRefresh = false;
            // To be sure that the sliderUp value will be written to the target
            writeEnabled = true;
            writeValue();
            sliderActive = false;
            sendActiveStatus(false);
        }
    }

    function updatePosition(event) {
        activePoint.x = typeof event.pageX !== 'undefined' ? event.pageX : event.originalEvent.touches[0].pageX;
        activePoint.y = typeof event.pageY !== 'undefined' ? event.pageY : event.originalEvent.touches[0].pageY;
        var newPoint = coordinateTransform(activePoint, activeArea);
        var position = levelBox.getBBox().height - newPoint.y;
        setValue(position);
        if (sliderActive) {
            // Saturace na meze slideru
            if (position < 0) {
                position = 0;
            }
            else if (position > levelBox.getBBox().height + 1) {
                position = levelBox.getBBox().height + 1;
            }
            dragPoint.setAttributeNS(null, "transform", "translate(" + 0 + "," + -parseFloat(position) + ")");
            level.setAttributeNS(null, "height", position);
            digitalValue.textContent = setPoint.toFixed(decimals);
            transformDisplay();            
        }
    }

    function setValue(val) {
        var relativeStep = (levelBox.getBBox().height) / (Math.abs(max - min) / step);
        if (val % relativeStep < relativeStep) {
            setPoint = min + Math.round(val / relativeStep) * step;
            if (setPoint < min) {
                setPoint = min;
            }
            else if (setPoint > max) {
                setPoint = max;
            }
        }
    }

    function updateSlider(setPointValue) {
        var setP = setPointValue;
        var position;
        if (setP >= min && setP <= max) {
            position = (setP - min) * (levelBox.getBBox().height) / Math.abs(max - min);
        } else {
            if (setP < min) {
                setP = min;
                position = 0;
            }
            else {
                setP = max;
                position = levelBox.getBBox().height;
            }
        }
        digitalValue.textContent = setP.toFixed(decimals);
        transformDisplay();
        dragPoint.setAttributeNS(null, "transform", "translate(" + 0 + "," + -parseFloat(position) + ")");
        level.setAttributeNS(null, "height", position);
    }

    function coordinateTransform(screenPoint, someSvgObject) {
        var CTM = someSvgObject.getScreenCTM();
        if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
            var newCoordinates = screenPoint.matrixTransform(CTM.inverse());
            newCoordinates.y -= (levelBox.getBBox().y);
            return newCoordinates;
        } else {
            return screenPoint.matrixTransform(CTM.inverse());
        }
    }

    function createActiveArea() {
        var area = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        area.setAttribute('x', levelBox.getBBox().x);
        area.setAttribute('y', levelBox.getBBox().y);
        area.setAttribute('width', levelBox.getBBox().width);
        area.setAttribute('height', levelBox.getBBox().height);
        sliderArea.appendChild(area);
        return area;
    }

    function createLabel() {
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        var oldWidth = sliderArea.getBBox().width;
        text.setAttributeNS(null, "fill", "#ffffff");
        text.setAttributeNS(null, "style", "font-size:" + fSize + "px; font-family:Arial");
        text.textContent = label;
        sliderArea.appendChild(text);
        // Resize font size if needed
        if (text.getBBox().width > oldWidth) {
            var newFontSize = (oldWidth / text.getBBox().width) * fSize * 0.98;
            text.setAttributeNS(null, "style", "font-size:" + newFontSize.toFixed(3) + "px; font-family:Arial");
        }
        text.setAttributeNS(null, "x", levelBox.getBBox().x + levelBox.getBBox().width / 2 - text.getBBox().width / 2);
        text.setAttributeNS(null, "y", (levelBox.getBBox().y + levelBox.getBBox().height + text.getBBox().height * 1.1));
    }

    function transformDisplay() {
        if (textBox) { // For backward compatibility
            var fontSize = digitalValue.style.fontSize;
            if (digitalValue.parentNode.getBBox().width >= textBox.getBBox().width * 0.9) {
                digitalValue.style.fontSize = parseFloat(fontSize.substring(0, fontSize.indexOf('p'))) * 0.9 + "px";
            }
            else if (digitalValue.parentNode.getBBox().width < textBox.getBBox().width * 0.85 && parseFloat(fontSize.substring(0, fontSize.indexOf('p'))) * 1.05 < fSize) {
                digitalValue.style.fontSize = parseFloat(fontSize.substring(0, fontSize.indexOf('p'))) * 1.05 + "px";
            }
            digitalValue.parentNode.setAttributeNS(null, "transform", "translate(" + parseInt(textBox.getBBox().x + (textBox.getBBox().width / 2
                    - digitalValue.parentNode.getBBox().width / 2) - digitalValue.parentNode.getBBox().x) + "," + parseInt(textBox.getBBox().y +
                    (textBox.getBBox().height / 2 - digitalValue.parentNode.getBBox().height / 2) - digitalValue.parentNode.getBBox().y) + ")");
        }
    }

    return that;
};
/**
 * SVG component represents Switch.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT}
 * @returns {REX.UI.SVG.Switch} New SVG Switch component
 */

REX.UI.SVG.Switch = function (svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem, args);
    // Store options for simple usage
    var $o = that.options || {};

    // Get options or default values
    var positions = $o.positions || null;

    that.$c.refresh_from = that.$c.refresh_from || that.$c.value_R || that.$c.value || that.$c.value_W;
    var refresh_from = that.$c.refresh_from;

    that.$c.value = that.$c.value || that.$c.value_W;
 
    // Get SVG elements for manipulation
    var switchArea = that.getChildByTag("switch_area"),
        hand = that.getChildByTag("hand");

    //Global variables
    var centerX = switchArea.getBBox().width / 2,
        centerY = switchArea.getBBox().height / 2 - 1,
        currentPosition = 0,
        points = new Array();

    var valuesOfPositions = new Array();
    for (var j = 0; j < positions.length; j++) {
        valuesOfPositions[j] = positions[j].valueOfPosition;
    }

    var i = 0;
    var pointAngle = 360 / valuesOfPositions.length;
    while (i < valuesOfPositions.length) {
        createPoint(i);
        i++;
    }

    switchArea.addEventListener("click", switchValueRight, false);
    switchArea.addEventListener("contextmenu", switchValueLeft,false);

    function switchValueRight(event) {
            event.preventDefault();
            currentPosition = (currentPosition + 1) % valuesOfPositions.length;
            that.$c.value.write(parseFloat(valuesOfPositions[currentPosition])).catch((err)=>{that.log.error("Write failed",err)});
            refresh();
    }

    function switchValueLeft(event) {
        event.preventDefault();        
        currentPosition = currentPosition - 1 % valuesOfPositions.length;
        if (currentPosition < 0) currentPosition = valuesOfPositions.length - 1;
        that.$c.value.write(parseFloat(valuesOfPositions[currentPosition])).catch((err)=>{that.log.error("Write failed",err)});
        refresh();
    }

    function createPoint(i) {
        var x = centerX + Math.sqrt(centerX / 1.6888 * centerX / 1.6888 + centerY / 1.6888 * centerY / 1.6888) * Math.cos((180 - pointAngle * i) * Math.PI / 180);
        var y = centerY - Math.sqrt(centerX / 1.6888 * centerX / 1.6888 + centerY / 1.6888 * centerY / 1.6888) * Math.sin((180 - pointAngle * i) * Math.PI / 180);

        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttributeNS(null, "cx", x);
        circle.setAttributeNS(null, "cy", y);
        circle.setAttributeNS(null, "r", 1);
        circle.setAttributeNS(null, "fill", "#ffffff");
        circle.setAttributeNS(null, "style", "stroke:none");
        switchArea.appendChild(circle);
        points[i] = circle;
    }
    

    refresh_from.on('change', function onChange(itm) {
        if (valuesOfPositions.lastIndexOf(itm.getValue().toString()) >= 0) {
            var currentAngle = pointAngle * valuesOfPositions.lastIndexOf(itm.getValue().toString());
            hand.setAttributeNS(null, "transform", "rotate(" + currentAngle + "," + centerX + "," + centerY + ")");
            currentPosition = valuesOfPositions.lastIndexOf(itm.getValue().toString());
            for (var i = 0; i < points.length; i++) {
                points[i].style.fill = "#ffffff";
                points[i].setAttributeNS(null, "r", 1);
            }
            points[currentPosition].style.fill = "#00ff00";
            points[currentPosition].setAttributeNS(null, "r", 2);
        } else {
            for (var i = 0; i < valuesOfPositions.length -1; i++) {
                if (itm.getValue() > parseFloat(valuesOfPositions[i]) && itm.getValue() < parseFloat(valuesOfPositions[i + 1])) {
                    var currentAngle = pointAngle * i;
                    hand.setAttributeNS(null, "transform", "rotate(" + currentAngle + "," + centerX + "," + centerY + ")");
                    currentPosition = i;
                    for (var j = 0; j < points.length; j++) {
                        points[j].style.fill = "#ffffff";
                        points[j].setAttributeNS(null, "r", 1);
                    }
                    points[currentPosition].style.fill = "#00ff00";
                    points[currentPosition].setAttributeNS(null, "r", 2);
                }
            }
        }
    });
    
    function refresh(){
        refresh_from.setValue(that.$c.value.getValue());
        refresh_from.emit('change',refresh_from);
    }

    return that;
};

/**
 * SVG component represents Switch.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT}
 * @returns {REX.UI.SVG.Switch} New SVG Switch component
 */

REX.UI.SVG.SwitchOnOff = function (svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.Component(svgElem, args);
    // Store options for simple usage
    var $o = that.options || {};

    // Get options or default values
    var reverse_meaning = that.parseBoolean($o.reverse_meaning);

    that.$c.refresh_from = that.$c.refresh_from || that.$c.VALUE_R || that.$c.value || that.$c.VALUE_W;
    var refresh_from = that.$c.refresh_from;

    that.$c.value = that.$c.value || that.$c.VALUE_W;

    if(!that.$c.value.writeCString){
        that.log.error('Item %s is read-only!',that.$c.value.id);
    }
 
    // Get SVG elements for manipulation
    var switchArea = that.getChildByTag("switch_area"),
        hand = that.getChildByTag("hand"),
        numberOne = that.getChildByTag("number_one");

    //Global variables
    var centerX = switchArea.getBBox().width / 2,
        centerY = switchArea.getBBox().height / 2,
        currentPosition,
        init = false;

    switchArea.addEventListener("click", switchValue, false);
    switchArea.addEventListener("contextmenu", switchValue, false);
    
    function refresh() {
        if (currentPosition === 0) {
            hand.setAttributeNS(null, "transform", "rotate(" + 0 + "," + centerX + "," + centerY + ")");
            numberOne.style.fill = "#ffffff";
        }
        else {
            hand.setAttributeNS(null, "transform", "rotate(" + 90 + "," + centerX + "," + centerY + ")");
            numberOne.style.fill = "#00ff00";
        }
    }

    function switchValue(event) {
        event.preventDefault();
        if (currentPosition === 0) {            
            that.$c.value.write(!reverse_meaning).catch((err)=>{that.log.error("Write failed",err)});
            currentPosition = 1;                        
        } else {            
            that.$c.value.write(reverse_meaning).catch((err)=>{that.log.error("Write failed",err)});
            currentPosition = 0;
        }
        refresh();
    }
    
    
    refresh_from.on('change', function onChange(itm) {
        if (reverse_meaning) {
            currentPosition = (itm.getValue() === 0) ? 1 : 0;
        }
        else {
            currentPosition = itm.getValue();
        }
        refresh();
    });

    return that;
};

/**
 * SVG component represents OnOff switch.
 * @param {SVGElement} svgElem 
 * @param {Object} args It is possible to specify {type:"",svg:SVG_ELEMENT,defs:DEFS_ELEMENT} 
 * @returns {REX.UI.SVG.SwitchOnOff2} New SVG SwitchOnOff2 component
 */
REX.UI.SVG.SwitchOnOff2 = function (svgElem, args) {
    // Inherit from base component
    var that = new REX.UI.SVG.HTMLComponent(svgElem, args);
    var $o = that.options || {};
    var onMouseDownValue = that.parseBoolean($o.reverseMeaning) ? 0 : 1;
    var writePerm = that.check($o.writePerm, []);
    var readOnly = false;

    var id = that.element.getAttributeNS(null, 'id');
    $(that.div).css('transform-origin', `top left`);

    // SVG text zustane viditelny, tak neni problem s jeho scalovanim
    // zatim lze pouze za switchem    
    $(that.element).find('text').css('visibility', 'visible');

    // HACK: Pri volani funkce update position se bude brat v potaz pouze pozice Switche ne labelu
    that.element = $(that.element).find('g')[0];

    that.div.innerHTML =
        `<div class="mdc-switch">
            <input type="checkbox" id="${id}-switch" class="mdc-switch__native-control" />
            <div class="mdc-switch__background">
                <div class="mdc-switch__knob"></div>
            </div>
        </div>`;
    //        <label for="${id}-switch" class="mdc-switch-label">${$o.label || ""}</label>`;

    var input = $(that.div).find('input');

    that.$c.refresh_from = that.$c.refresh_from || that.$c.value;

    if (that.$c.value.type === 'R') {
        that.log.error('Connection String: ' + that.$c.value.cstring + '(' + that.$c.value.alias + ') is read-only');
        return that;
    }


    that.on('disable', (disable) => {
        if (disable) {
            input.attr("disabled", true);
            input.css('pointer-events', 'none');
            $(that.div).find('*').css('cursor', 'default');
        }
        else{
            input.removeAttr("disabled");
            input.css('pointer-events', '');
            $(that.div).find('*').css('cursor', '');
        }
    });

    that.on('updatePosition', (pos) => {
        let r;
        // Oprava pro DWM, kdyz ma SVG display:none, tak nejde spocitat getBBox()
        try {
            r = Math.min(pos.height / that.element.getBBox().height, pos.width / that.element.getBBox().width);
        } catch (error) {
            r = 1;
        }
        $(that.div).css('transform', `scale(${r.toFixed(4)})`);
    });

    let writeFailed = (err) => {
        that.log.debug("Write failed", err);
        that.log.error("Write failed! Is the cstring RW capable?");
    };

    let active = false;
    input.change(function (evt) {
        evt.preventDefault();
        if (active) {
            that.$c.value.write(1 - onMouseDownValue).catch(writeFailed);
        }
        else{
            that.$c.value.write(onMouseDownValue).catch(writeFailed);
        }
        $(this).blur();
    });

    that.$c.refresh_from.on('change', function (itm) {
        if (itm.getValue() === (1 - onMouseDownValue)) {
            input.prop('checked', false);
            active = false;
        }
        else {
            input.prop('checked', true);
            active = true;
        }
    });

    that.setReadOnly = function () {
        input.css('pointer-events', 'none');
        input.off('change');
        $(that.div).find('*').css('cursor', 'default');
    };

    that.updatePosition();
    that.disable();
    return that;
};