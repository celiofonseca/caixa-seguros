/*
KeyHandler

Author: Sean K. Friese
Version 1.0 20071120

Copyright 2007 RWD Technologies, Inc.
*/

var KeyHandler = {

	init: function () {
		this.FlashObjectID = "flashObj";
		document.onkeydown = KeyHandler.keyDown;
		document.onkeyup = KeyHandler.keyUp;
		if(document.onkeypress){document.onkeypress = KeyHandler.keyDown};
	},

	killEvents: function(eventObject) {
		if(eventObject) {
			if (eventObject.stopPropagation) eventObject.stopPropagation();
			if (eventObject.preventDefault) eventObject.preventDefault();
			if (eventObject.preventCapture) eventObject.preventCapture();
		 if (eventObject.preventBubble) eventObject.preventBubble();
		}
	},

	keyDown: function(ev)
	{
		KeyHandler.killEvents(ev);
		if(window.event)
		{
			ev = window.event;
			keycode = ev.keyCode;
			if(keycode <16 || keycode > 18)
			{
				ev.keyCode = 0;
			}
			ev.returnValue = false;
		}
		else
		{
			keycode = ev.which;
		}

		KeyHandler.call(keycode);
		return false;
	},

	keyUp: function(ev)
	{
		KeyHandler.killEvents(ev);
		if(window.event)
		{
			ev = window.event;
			keycode = ev.keyCode;
			if(keycode <16 || keycode > 18)
			{
				ev.keyCode = 0;
			}
			ev.returnValue = false;
		}
		else
		{
			keycode = ev.which;
		}

		KeyHandler.clearModifiers(keycode);
		return false;
	},
		
	clearModifiers: function(keycode)
	{
		// Specific to uPerform output
		flashlmsadapter.setVariable('processKeyUpEvent|'+keycode);
	},

	call: function(keycode)
	{
		// Specific to uPerform output
		flashlmsadapter.setVariable('processKeyDownEvent|'+keycode);
	}
}