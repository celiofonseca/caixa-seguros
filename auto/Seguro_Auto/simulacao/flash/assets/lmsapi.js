/***************************************************************************
**
** Advanced Distributed Learning Co-Laboratory (ADL Co-Lab) grants you
** ("Licensee") a non-exclusive, royalty free, license to use, modify and
** redistribute this software in source and binary code form, provided that
** i) this copyright notice and license appear on all copies of the software;
** and ii) Licensee does not utilize the software in a manner which is
** disparaging to ADL Co-Lab.
**
** This software is provided "AS IS," without a warranty of any kind.  ALL
** EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND WARRANTIES, INCLUDING
** ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
** OR NON-INFRINGEMENT, ARE HEREBY EXCLUDED.  ADL Co-Lab AND ITS LICENSORS
** SHALL NOT BE LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF
** USING, MODIFYING OR DISTRIBUTING THE SOFTWARE OR ITS DERIVATIVES.  IN NO
** EVENT WILL ADL Co-Lab OR ITS LICENSORS BE LIABLE FOR ANY LOST REVENUE,
** PROFIT OR DATA, OR FOR DIRECT, INDIRECT, SPECIAL, CONSEQUENTIAL,
** INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER CAUSED AND REGARDLESS OF THE
** THEORY OF LIABILITY, ARISING OUT OF THE USE OF OR INABILITY TO USE
** SOFTWARE, EVEN IF ADL Co-Lab HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
** DAMAGES.
**
***************************************************************************/

var _Debug = false;


/*******************************************************************************
**
** Function findAPI(win)
** Inputs:  win - a Window Object
** Return:  If an API object is found, it's returned, otherwise null is returned
**
** Description:
** This function looks for an object named API in parent and opener windows
**
*******************************************************************************/
function findAPI_12(win)
{
	while ((win.API == null) && (win.parent != null) && (win.parent != win))
	{
		findAPITries++;
		// Note: 7 is an arbitrary number, but should be more than sufficient
		if (findAPITries > 7) 
		{
			if(_Debug)
			{
				alert("Error finding API -- too deeply nested.");
			}
			return null;
		}

		win = win.parent;

	}
	return win.API;
}


/*******************************************************************************
**
** Function getAPI()
** Inputs:  none
** Return:  If an API object is found, it's returned, otherwise null is returned
**
** Description:
** This function looks for an object named API, first in the current window's 
** frame hierarchy and then, if necessary, in the current window's opener window
** hierarchy (if there is an opener window).
**
*******************************************************************************/
function getAPI_12()
{
	var theAPI = findAPI_12(window);
	if ((theAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined"))
	{
		theAPI = findAPI_12(window.opener);
	}
	if ((theAPI == null) && (parent.window != null) && (parent.window.opener != null) && (typeof(parent.window.opener) != "undefined"))
	{
		theAPI = findAPI_12(parent.window.opener);
	}
	if ((theAPI == null) && (top.opener != null) && (top.opener.top != null) && (top.opener.top.opener != null) && (typeof(top.opener.top.opener) != "undefined"))
	{   
		theAPI = findAPI_12(top.opener.top.opener);
	}
	if (theAPI == null)
	{
		if(_Debug)
		{
			alert("Unable to find an API adapter");
		}
	}
	return theAPI
}


// #################### End ADL Co-Lab Licensed Code ###################

// #################### Local API Functions ############################

function LocalAPI(config) {
	this.config = config;
	this.ready = false;
	this._data_elements = null;
}

function localLMSInitialize(parameter) {
	this.ready = true;
	this._data_elements = this._unpickle();
	return true;
}

function localLMSFinish(parameter) {
	this.ready = false;
	return true;
}

function localLMSGetValue(data_element) {
	if (!this.ready || !this._data_elements || !data_element) { return ''; }
	
	if (this._data_elements[data_element]) {
		return this._data_elements[data_element];
	}
	return '';
}

function localLMSSetValue(data_element, value) {

	if (!this.ready || !this._data_elements || !data_element) { return false; }
	if (data_element != null && data_element.indexOf("interactions") < 0) {
		this._data_elements[data_element] = value;
	}
	return true;
}

function localLMSCommit(parameter) {

	if (!this.ready) { return false; }

	this._pickle(this._data_elements);
	return true;
}

// #################### Local API Storage Impl ############################

function LocalAPIPickleImpl(obj) {
	var pickle = new Cookie(document,this.config.name,this.config.lifetime,'/');
	for (var o in obj) {
		pickle[o] = obj[o];
	}
	pickle.store();
}

function LocalAPIUnpickleImpl() {
	var pickle = new Cookie(document,this.config.name,this.config.lifetime,'/');
	pickle.load();
	var obj = new Object();
	for (var o in pickle) {
		if ((o.charAt(0) != '$') && ((typeof pickle[o]) != 'function')) { obj[o] = pickle[o]; }
	}
	return obj;
}

// #################### Local API Prototypes ############################

LocalAPI.prototype.LMSInitialize = localLMSInitialize;
LocalAPI.prototype.LMSFinish = localLMSFinish;
LocalAPI.prototype.LMSGetValue = localLMSGetValue;
LocalAPI.prototype.LMSSetValue = localLMSSetValue;
LocalAPI.prototype.LMSCommit = localLMSCommit;
LocalAPI.prototype.LMSGetErrorString = function() { return 'No Error'; }
LocalAPI.prototype.LMSGetDiagnostic = function() { return 'The previous LMS API Function call completed successfully.'; }
LocalAPI.prototype.LMSGetLastError = function() { return 0; }

LocalAPI.prototype._pickle = LocalAPIPickleImpl;
LocalAPI.prototype._unpickle = LocalAPIUnpickleImpl;


// #################### Applet API Functions ############################

function AppletAPI(appletref,web_launch) {
	this.appletref = appletref;
	if (web_launch) { this.web_launch = web_launch; } else { this.web_launch = ''; }
	this.ready = false;
}

function AppletLMSInitialize(parameter) {
	this.ready = true;
	return true;
}

function AppletLMSFinish(parameter) {
	if (!this.ready) { return false; }
	this.ready = false;
	this.appletref.ExitAU();
	return true;
}

function AppletLMSGetValue(data_element) {
	if (!this.ready || !data_element) { return ''; }

	if (eval(data_element)) {
		return eval(data_element)(this);
	}
	return '';

}

function AppletLMSSetValue(data_element, value) {
	if (!this.ready || !data_element) { return false; }
	
	if (eval(data_element)) {
		eval(data_element)(this,value);
	}
	
	return true;

}

function AppletLMSCommit(parameter) {
	return true;
}

// #################### Applet API Storage Impl ############################

function AICCImplFactory(group,name) {
	var element_factory = function(self,value) {
		var appletref = self.appletref;
		if (value != null) {
			if (name) {
				appletref.PutParam(group,name,value);
			} else {
				appletref.PutParam(group,value);
			}
		} else {
			var getparam = appletref.GetParam(group,name);
			return getparam;
		}
	}
	
	return element_factory;
	
}

function AICCLaunchData(self,value) { 
	if (value == null) {
		return self.web_launch;
	}
}

var cmi=new Object();
cmi.core = new Object();
cmi.core.student_id = AICCImplFactory('[core]','student_id');
cmi.core.student_name = AICCImplFactory('[core]','student_name');
cmi.core.lesson_location = AICCImplFactory('[core]','lesson_location');
cmi.core.lesson_status = AICCImplFactory('[core]','lesson_status');
cmi.core.credit = AICCImplFactory('[core]','credit');
cmi.core.score = new Object();
cmi.core.score.raw = AICCImplFactory('[core]','score');
cmi.core.time = AICCImplFactory('[core]','time');
cmi.suspend_data = AICCImplFactory('[core_lesson]',null);
cmi.launch_data = AICCLaunchData;



// #################### Applet API Prototypes ############################

AppletAPI.prototype.LMSInitialize = AppletLMSInitialize;
AppletAPI.prototype.LMSFinish = AppletLMSFinish;
AppletAPI.prototype.LMSGetValue = AppletLMSGetValue;
AppletAPI.prototype.LMSSetValue = AppletLMSSetValue;
AppletAPI.prototype.LMSCommit = AppletLMSCommit;
AppletAPI.prototype.LMSGetErrorString = function() { return 'No Error'; }
AppletAPI.prototype.LMSGetDiagnostic = function() { return 'The previous LMS API Function call completed successfully.'; }
AppletAPI.prototype.LMSGetLastError = function() { return 0; }

// #################### Debug API Functions ############################

function DebugAPI(API) {
	this.API = API;
	var debugwin = window.open("about:blank","debugwin","location=no,menubar=no,scrollbars=yes");
	this.console = new Console(debugwin);
}

function debugLMSInitialize(parameter) {
	var initialize = this.API.LMSInitialize(parameter);
	this.console.writeln("LMSInitialize('" + parameter + "') = " + initialize);
	this.debugDump();
	return initialize;
}

function debugLMSFinish(parameter) {
	var finish = this.API.LMSFinish(parameter);
	this.console.writeln("LMSFinish('" + parameter + "') = " + finish);
	this.debugDump();	
	return finish;
}

function debugLMSGetValue(data_element) {
	var value = this.API.LMSGetValue(data_element);
	this.console.writeln("LMSGetValue('" + data_element + "') = " + value);
	this.debugDump();
	return value;
}

function debugLMSSetValue(data_element, value) {
	var setvalue = this.API.LMSSetValue(data_element, value);
	this.console.writeln("LMSSetValue('" + data_element + "','" + value + "') = " + setvalue);
	this.debugDump();
	return setvalue;
}

function debugLMSCommit(parameter) {
	var commit = this.API.LMSCommit(parameter);
	this.console.writeln("LMSCommit('" + parameter + "') = " + commit);
	this.debugDump();
	return commit;
}

function debugLMSGetErrorString(parameter) {
	var errorstr = this.API.LMSGetErrorString(parameter);
	this.console.writeln("LMSGetErrorString('" + parameter + "') = " + errorstr);
	return errorstr;
}

function debugLMSGetDiagnostic(parameter) {
	var diag = this.API.LMSGetDiagnostic(parameter);
	this.console.writeln("LMSGetDiagnostic('" + parameter + "') = " + diag);
	return diag;
}

function debugLMSGetLastError() {
	var lasterr = this.API.LMSGetLastError();
	this.console.writeln("LMSGetLastError() = " + lasterr);
	return lasterr;
}

function debugDump() {
	var lasterr = this.LMSGetLastError();
	var lasterrstr = this.LMSGetErrorString(lasterr);
	var lasterrdiag = this.LMSGetDiagnostic(lasterr);
	this.console.writeln("---------------");
}

// #####

function Console(win) {
	this.win = win;
	win.document.open("text/plain");
}

Console.prototype.writeln = function(text) {
	if (this.win && !this.win.closed) {
		this.win.document.writeln(text);
	}
}

// #################### Debug API Prototypes ############################

DebugAPI.prototype.LMSInitialize = debugLMSInitialize;
DebugAPI.prototype.LMSFinish = debugLMSFinish;
DebugAPI.prototype.LMSGetValue = debugLMSGetValue;
DebugAPI.prototype.LMSSetValue = debugLMSSetValue;
DebugAPI.prototype.LMSCommit = debugLMSCommit;
DebugAPI.prototype.LMSGetErrorString = debugLMSGetErrorString;
DebugAPI.prototype.LMSGetDiagnostic = debugLMSGetDiagnostic;
DebugAPI.prototype.LMSGetLastError = debugLMSGetLastError;
DebugAPI.prototype.debugDump = debugDump;

// #################### Checked API Functions ############################

function CheckedAPI(API) {
	this.API = API;
	this.__inited__ = false;
}

function CheckedLMSInitialize(parameter) {
	var initialize = this.API.LMSInitialize(parameter);
	if (initialize) { this.__inited__ = true; }
	return initialize;
}

function CheckedLMSFinish(parameter) {
	this.__inited__ = false;
	var finish = this.API.LMSFinish(parameter);
	return finish;
}

function CheckedLMSGetValue(data_element) {
	var value = this.API.LMSGetValue(data_element);
	return value;
}

function CheckedLMSSetValue(data_element, value) {
	var setvalue = this.API.LMSSetValue(data_element, value);
	return setvalue;
}

function CheckedLMSCommit(parameter) {
	var commit = this.API.LMSCommit(parameter);
	return commit;
}

function CheckedLMSGetErrorString(parameter) {
	var errorstr = this.API.LMSGetErrorString(parameter);
	return errorstr;
}

function CheckedLMSGetDiagnostic(parameter) {
	var diag = this.API.LMSGetDiagnostic(parameter);
	return diag;
}

function CheckedLMSGetLastError() {
	var lasterr = this.API.LMSGetLastError();
	return lasterr;
}

// #################### Checked API Prototypes ############################

CheckedAPI.prototype.LMSInitialize = CheckedLMSInitialize;
CheckedAPI.prototype.LMSFinish = CheckedLMSFinish;
CheckedAPI.prototype.LMSGetValue = CheckedLMSGetValue;
CheckedAPI.prototype.LMSSetValue = CheckedLMSSetValue;
CheckedAPI.prototype.LMSCommit = CheckedLMSCommit;
CheckedAPI.prototype.LMSGetErrorString = CheckedLMSGetErrorString;
CheckedAPI.prototype.LMSGetDiagnostic = CheckedLMSGetDiagnostic;
CheckedAPI.prototype.LMSGetLastError = CheckedLMSGetLastError;

// #################### Wrapped 2004 API Functions ############################

 /**************************************************************************
**
** Function: API Object
** Inputs:  Catch all for 1.2 SCO calls
** Return:  none
**
** Description:
** APIObject is a JavaScript Object that acts as the SCORM 1.2 api and is
** used to catch all the SCORM 1.2 calls prior to sending the calls onto
** the LMS.
**
**************************************************************************/ 
function APIObject()
{
   this.LMSInitialize = LMSInitialize;
   this.LMSFinish = LMSFinish;
   this.LMSGetValue = LMSGetValue;
   this.LMSSetValue = LMSSetValue;
   this.LMSCommit = LMSCommit;
   this.LMSGetLastError = LMSGetLastError;
   this.LMSGetErrorString = LMSGetErrorString;
   this.LMSGetDiagnostic = LMSGetDiagnostic;  
}

/**************************************************************************
**
** Function: LMSInitialize()
** Inputs:  None
** Return:  A string indicating whether or not the function completed 
**          successfully (true or false)
**
** Description:
** Initialize communication with LMS by calling the Initialize
** function which will be implemented by the LMS. The result is returned
** by the SCOPlayerWrapper.js file.
**
**************************************************************************/
function LMSInitialize()
{
   // CALL INITIALIZE
   result = doLMSInitialize();
   if(result)
	{
	   this.__inited__ = true;
	}
   return result.toString(); 
}

/**************************************************************************
**
** Function: LMSFinish()
** Inputs:  None
** Return:  A string indicating whether or not the function completed 
**          successfully (true or false)
**
** Description:
** LMSFinish comunicates with the LMS via SCOPlayerWrapper, converting the 
** LMSFinish call to Terminate and passing on to the LMS.
**
**************************************************************************/    
function LMSFinish()
{
   // CALL TERMINATE
   result = doLMSFinish();
   if(result)
	{
	   this.__inited__ = false;
	}
   return result.toString();
}

/**************************************************************************
**
** Function: LMSGetValue()
** Inputs:  Name of Element to retrieve
** Return:  Result of the getValue call 
**
** Description:
** This funciton takes in the name of the element that is attempting to be 
** set, passes the element along to the SCOPlayerWrapper.js and in return 
** the SCOPlayerWrapper.js file returns the appropriate SCORM 1.2 conformant
** value. 
**
**************************************************************************/    
function LMSGetValue(name)
{
   result = doLMSGetValue(name);
   return result.toString();
}

/**************************************************************************
**
** Function: LMSSetValue()
** Inputs:  Element name and value to set it to
** Return:  A string indicating whether or not the function completed 
**          successfully (true or false)
**
** Description:
** LMSSetValue accepts the value and element name to set, passing them on
** to doLMSSetValue within SCOPlayerWrapper.js to complete the conversion
** process communicating with the SCORM 2004 LMS.
**
***************************************************************************/    
function LMSSetValue(name, value)
{
   result = doLMSSetValue(name, value);
   return result.toString();
}

/**************************************************************************
**
** Function: LMSCommit()
** Inputs:  None
** Return:  A string indicating whether or not the function completed 
**          successfully (true or false)
**
** Description:
** LMSCommit calls doLMSCommit within SCOPlayerWrapper.js file passing the 
** call on to the SCORM 2004 LMS.
**
***************************************************************************/    
function LMSCommit()
{
   var result = doLMSCommit();
   return result.toString();
}

/***************************************************************************
**
** Function doLMSGetLastError()
** Inputs:  None
** Return:  The error code that was set by the last LMS function call
**
** Description:
** Calls the doLMSGetLastError function, located in SCOPlayerWrapper.js
** which converts the SCORM 2004 error code provided by the LMS to 
** SCORM 1.2. 
**
***************************************************************************/
function LMSGetLastError()
{
   if ( _InternalErrCode == 1 )
   {
	  // There is no error the APIWrapper caught the last call and did not
	  // comunicate with the LMS
	  return 0;
   }
   else
   {
	  errorcode12 = doLMSGetLastError();
	  return errorcode12;
   }
}

/***************************************************************************
**
** Function doLMSGetErrorString(errorCode)
** Inputs:  errorCode - Error Code
** Return:  The textual description that corresponds to the input error code
**
** Description:
** Calls doLMSGetErrorString function located within SCOPlayerWrapper.js. 
**
***************************************************************************/
function LMSGetErrorString(errorCode)
{
   var errString = doLMSGetErrorString(errorCode);
   return errString;
}

/***************************************************************************
**
** Function doLMSGetDiagnostic(errorCode)
** Inputs:  errorCode - Error Code(integer format), or null
** Return:  The vendor specific textual description that corresponds to the 
**          input error code
**
** Description:
** Calls doLMSGetDiagnostic function located within SCOPlayerWrapper.js.n
**
***************************************************************************/
function LMSGetDiagnostic(errorCode)
{
   var errString = getErrorString(errorCode);
   return errString;
}

