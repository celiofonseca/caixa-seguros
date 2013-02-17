/*
MouseWheelHandler

Author: Sean K. Friese
Version 1.0 20071126

Copyright 2007 RWD Technologies, Inc.
*/

var MouseWheelHandler = {

	init: function () {
		this.FlashObjectID = "flashObj";
		if(window.addEventListener)
		{
			window.addEventListener('DOMMouseScroll', MouseWheelHandler.mouseScroll, false);
		}
		else
		{
			window.onmousewheel = document.onmousewheel = MouseWheelHandler.mouseScroll;
		}
	},

	killEvents: function(eventObject) {
		if(eventObject) {
			if (eventObject.stopPropagation) eventObject.stopPropagation();
			if (eventObject.preventDefault) eventObject.preventDefault();
			if (eventObject.preventCapture) eventObject.preventCapture();
		 if (eventObject.preventBubble) eventObject.preventBubble();
		}
	},

	mouseScroll: function(ev)
	{
		MouseWheelHandler.killEvents(ev);
		var delta = 0;
		if(!ev)
		{
			ev = window.event;
		}
		
		if(ev.wheelDelta)
		{
			delta = ev.wheelDelta/120;

			if (window.opera)
			{
				delta = -delta;
			}
		}
		else if(ev.detail)
		{
			delta = -ev.detail/3;
		}

		if(delta)
		{
			MouseWheelHandler.call(delta);
		}
	},

	call: function(delta)
	{
		// Specific to uPerform output
		setTimeout(function(){flashlmsadapter.setVariable('processMouseWheelEvent|'+delta);},100);
	}
}



