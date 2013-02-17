
// #################### swfHttp API Functions ############################

function swfHttpAPI(swf,params,heartbeatInterval)
{
	this.swf = swf;
	this.aiccurl = params['aicc_url'];
	this.aiccsid = params['aicc_sid'];

	this.map =
	{
		'cmi.core.student_id' : 'aicc.core.student_id',
		'cmi.core.student_name' : 'aicc.core.student_name',
		'cmi.core.lesson_mode' : 'aicc.core.lesson_mode',
		'cmi.core.lesson_location' : 'aicc.core.lesson_location',
		'cmi.core.lesson_status' : 'aicc.core.lesson_status',
		'cmi.core.credit' : 'aicc.core.credit',
		'cmi.core.score.raw' : 'aicc.core.score',
		'cmi.core.session_time' : 'aicc.core.time',
		'cmi.suspend_data' : 'aicc.core_lesson.__value__'
	};
	
	this.errors = {0:"No Error"};	
	this.lastError = 0;

	this.ready = false;
	
	var me = this;
	this.heartbeat = setInterval(function() { me._heartbeat(); },heartbeatInterval);
	
}

function swfHttpAICCInit(aiccdata)
{
	this.aicc = new AICC(aiccdata);
	this.ready = true;
}

function swfHttpLMSInitialize(parameter)
{
	if (!this.ready) { return false; }
	
	if (this.console)
	{
		this.console.writeln("Initial AICC Data from " + this.aiccurl + ":" + this.aicc.toString());
		this.console.writeln("---------------");
	}
	
	return true;
}

function swfHttpLMSFinish(parameter)
{
	if (!this.ready) { return false; }
	this.ready = false;
	if (this.console)
	{
		this.console.writeln("AICC data sent to "  + this.aiccurl + ":command=exitau&version=2.0&session_id=" + escape(this.aiccsid));
		this.console.writeln("---------------");
	}

	if(!exitSent)
	{
		this._post("command=exitau&version=2.0&session_id=" + escape(this.aiccsid));
	}

	setTimeout(function() {top.close();},1000);

	return true;
}

function swfHttpLMSGetValue(data_element)
{
	if (!this.ready || !data_element) { return ''; }
	
	var aicc = this.aicc;
	var value = eval(this._remap(data_element));
	
	if (data_element == "cmi.core.lesson_status")
	{
		var status = value.charAt(0).toLowerCase();
		
		switch (status)
		{
			case 'n':
				value = 'not attempted';
				break;
			case 'i':
				value ='incomplete';
				break;
			case 'c':
				value = 'completed';
				break;
			case 'p':
				value = 'completed';
				break;
			case 'b':
				value = 'browsed';
				break;
		}
	}
	
	return value;

}

function swfHttpLMSSetValue(data_element, value)
{
	if (!this.ready || !data_element) { return false; }
	
	if (data_element.indexOf('cmi.interactions') >= 0) { return true; }	

	/*
	if(data_element == "cmi.core.lesson_status" && (value.toLowerCase() == "completed" || value.toLowerCase() == "passed"))
	{
		value = 'P';
	}
	*/
	
	var aicc = this.aicc;
	value = '' + value;
	value = value.replace("'","\\'");
	value = value.replace('"','\\"');
	if (this._remap(data_element))
	{
		eval(this._remap(data_element) + "='" + value + "'");
	}
	
	return true;
}

function swfHttpLMSCommit(parameter)
{
	if (!this.ready) { return false; }
	if (this.console)
	{
		this.console.writeln("AICC data sent to "  + this.aiccurl + ":command=putparam&version=2.0&session_id=" + escape(this.aiccsid) + "&aicc_data=" + escape(this.aicc.toString()));
		this.console.writeln("---------------");
	}
	this._post("command=putparam&version=2.0&session_id=" + escape(this.aiccsid) + "&aicc_data=" + escape(this.aicc.toString()));

	return true;
}

// #################### swfHttp API Storage Impl ############################

function swfHttpRemap(data_element)
{
	var aicc_map = this.map[data_element];
	if (aicc_map)
	{

		if (data_element == 'cmi.suspend_data')
		{
			if (!this.aicc.core_lesson)
			{
				this.aicc.core_lesson = {};
			}
		}
		return aicc_map;
	}

	var cmiobjectives = data_element.match(/cmi\.objectives\.?\[?(\d+)\]?\.(.*)/i);
	if (cmiobjectives && cmiobjectives.length > 2)
	{
		if (!this.aicc.objectives_status)
		{
			this.aicc.objectives_status = {};
		}
		var id = cmiobjectives[1];
		var slot = cmiobjectives[2];
		if (slot == 'score.raw') { slot = 'score'; }
		aicc_map = 'aicc.objectives_status["j_' + slot + '.' + id + '"]';
		return aicc_map;
	}

	return '';

}

function swfHttpHeartbeat()
{
	this._post("command=getparam&version=2.0&session_id=" + escape(this.aiccsid));
}

function swfHttpPost(s)
{
	var fo = new FlashObject("aiccadapter.swf", "aiccadapter", "1", "1", "6.0.79.0", "#FFFFFF");
	fo.addVariable("command", escape(s));
	fo.addParam("swliveconnect", "true");
	fo.write(this.swf);
}

// #################### swfHttp API Prototypes ############################

swfHttpAPI.prototype.LMSInitialize = swfHttpLMSInitialize;
swfHttpAPI.prototype.LMSFinish = swfHttpLMSFinish;
swfHttpAPI.prototype.LMSGetValue = swfHttpLMSGetValue;
swfHttpAPI.prototype.LMSSetValue = swfHttpLMSSetValue;
swfHttpAPI.prototype.LMSCommit = swfHttpLMSCommit;
swfHttpAPI.prototype.LMSGetLastError = function() { return this.lastError; }
swfHttpAPI.prototype.LMSGetErrorString = function(errorCode) { return this.errors[errorCode]; }
swfHttpAPI.prototype.LMSGetDiagnostic = function() { return ''; }

swfHttpAPI.prototype.AICCInit = swfHttpAICCInit

swfHttpAPI.prototype._remap = swfHttpRemap;
swfHttpAPI.prototype._heartbeat = swfHttpHeartbeat;
swfHttpAPI.prototype._post = swfHttpPost;

// #################### Debug API Functions ############################

function DebugAPI(API) {
	this.API = API;
	var debugwin = window.open("about:blank","debugwin","location=no,menubar=no,scrollbars=yes");
	this.console = new Console(debugwin);	
	API.console = this.console;
	
}

function debugLMSInitialize(parameter) {
	var initialize = this.API.LMSInitialize(parameter);
	this.console.writeln("LMSInitialize('" + parameter + "') = " + initialize);
	this.debugDump();
	this.ready = true;
	return initialize;
}

function debugLMSFinish(parameter) {
	var finish = this.API.LMSFinish(parameter);
	this.console.writeln("LMSFinish('" + parameter + "') = " + finish);
	this.debugDump();
	this.ready = false;
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

