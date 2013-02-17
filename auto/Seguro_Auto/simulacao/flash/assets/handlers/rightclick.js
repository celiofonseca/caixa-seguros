/**
 *
 * Copyright 2007
 *
 * Paulius Uza
 * http://www.uza.lt
 *
 * Dan Florio
 * http://www.polygeek.com
 *
 * Project website:
 * http://code.google.com/p/custom-context-menu/
 *
 * Licence:
 * http://code.google.com/p/custom-context-menu/wiki/License
 * --
 * RightClickHandler for Flash Player.
 * Version 0.6.2
 *
 * Updated 11/2/2007: Updated to use non-External Interface method (skf)
 * Updated 11/2/2007: Updated to send events to call function (skf)
 * Updated 11/27/2007: Changed to "RightClickHandler" (skf)
 */
var RightClickHandler = {

	FlashObjectID:"flashObj",
	FlashContainerID:"flashContent",
	Cache:"flashObj",

	/**
	 *  Constructor
	 */
	init: function () {
		if(window.addEventListener){
			 window.addEventListener("mousedown", this.onGeckoMouse(), true);
		} else {
			document.getElementById(this.FlashContainerID).onmouseup = function() { document.getElementById(RightClickHandler.FlashContainerID).releaseCapture(); }
			document.oncontextmenu = function(){ if(window.event.srcElement.id == RightClickHandler.FlashObjectID) { return false; } else { RightClickHandler.Cache = "nan"; }}
			document.getElementById(this.FlashContainerID).onmousedown = RightClickHandler.onIEMouse;
		}
	},
	/**
	 * GECKO / WEBKIT event overkill
	 * @param {Object} eventObject
	 */
	killEvents: function(eventObject) {
		if(eventObject) {
			if (eventObject.stopPropagation) eventObject.stopPropagation();
			if (eventObject.preventDefault) eventObject.preventDefault();
			if (eventObject.preventCapture) eventObject.preventCapture();
		 if (eventObject.preventBubble) eventObject.preventBubble();
		}
	},
	/**
	 * GECKO / WEBKIT call right click
	 * @param {Object} ev
	 */
	onGeckoMouse: function(ev) {
		return function(ev) {
		if (ev.button != 0) {
			RightClickHandler.killEvents(ev);
			if(ev.target.id == RightClickHandler.FlashObjectID && RightClickHandler.Cache == RightClickHandler.FlashObjectID) {
				RightClickHandler.call(ev);
			}
			RightClickHandler.Cache = ev.target.id;
		}
	  }
	},
	/**
	 * IE call right click
	 * @param {Object} ev
	 */
	onIEMouse: function() {
		if (event.button> 1) {
			if(window.event.srcElement.id == RightClickHandler.FlashObjectID && RightClickHandler.Cache == RightClickHandler.FlashObjectID) {
				RightClickHandler.call(event);
			}
			document.getElementById(RightClickHandler.FlashContainerID).setCapture();
			if(window.event.srcElement.id)
			RightClickHandler.Cache = window.event.srcElement.id;
		}
	},
	/**
	 * Main call to Flash
	 */
	call: function(event)
	{
		// Specific to uPerform output
		flashlmsadapter.setVariable('processExternalRightClick|'+event.clientX+','+event.clientY);
	}
}