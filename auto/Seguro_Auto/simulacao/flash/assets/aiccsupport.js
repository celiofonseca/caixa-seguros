
var API = null;
var params = null;
var hasErrors = false;

var APIDebug = false;

var heartbeatInterval = 900000;

var exitSent = false;

function initDone()
{
	run();
}

function sendExit()
{
	var reqObj;
	var aiccURL = (params['aicc_url']) ? params['aicc_url'] : params['AICC_URL'];
	var aiccSID = (params['aicc_sid']) ? params['aicc_sid'] : params['AICC_SID'];

	if(window.XMLHttpRequest)
	{
		reqObj = new XMLHttpRequest();
	}
	else if(window.ActiveXObject)
	{
		try
		{
			reqObj = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(e)
		{
			try
			{
				reqObj = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch(e){}
		}
	}

	if(reqObj)
	{
		try
		{
			reqObj.open('POST',aiccURL,false);
			reqObj.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			reqObj.send("command=exitau&version=2.0&session_id="+aiccSID);
		}
		catch (e)
		{
			document.forms['ensureExit'].submit();
		}
		
		exitSent = true;
	}
}

// -----------------------------------------------------------
function getAICCParams(indexOpener)
{
	var hasSearch = false;

	if(indexOpener)
	{
		if(indexOpener.document.location.search)
		{
			var aiccparms = indexOpener.document.location.search;
			var protocol = indexOpener.document.location.protocol;
			hasSearch = true;
		}
	}
	else
	{
		if(document.location.search)
		{
			var aiccparms = document.location.search;
			var protocol = document.location.protocol;
			hasSearch = true;
		}
		else if(parent.document.location.search)
		{
			var aiccparms = parent.document.location.search;
			var protocol = parent.document.location.protocol;
			hasSearch = true;
		}
		else
		{
			hasSearch = false;
		}
	}

	if(hasSearch)
	{
		if(aiccparms.toLowerCase().indexOf('aicc_sid') >=0 && aiccparms.toLowerCase().indexOf('aicc_url') >=0)
		{
			var params = parseParams(aiccparms);
			
			if (params['aicc_url'].indexOf(protocol) == -1)
			{
				params['aicc_url'] = protocol + "//" + params['aicc_url'];
			}
			params['aicc_raw'] = aiccparms;
			return params;
		}
		else
		{
			return parseParams(aiccparms);
		}
	}
	else
	{
		return false;
	}
}

function initClient()
{
	if (API && API.ready) { return; }

	var fo = new SWFObject("aiccadapter.swf", "aiccadapter", "1", "1", "6.0.79.0", "#FFFFFF");
	fo.addParam("name","aiccadapter");
	fo.setAttribute('redirectUrl', 'noflash.htm');
	fo.write("aiccclient");

	try
	{
		var aiccadapter = document.getElementById('aiccadapter');
		aiccadapter.attachEvent('fscommand',aiccadapter_doFSCommand);
	}
	catch (e) { }

}

//

var aiccInited = false;

function AICCInit(data)
{
	if (aiccInited) { return; }

	if (data != "undefined")
	{
		var swf = document.getElementById('aicc');
		API = new swfHttpAPI("aiccclient",params,heartbeatInterval);
		API.AICCInit(unescape(data));
		if (APIDebug) { API = new DebugAPI(API); }
	}
	else
	{
		hasErrors = true;
	}
	
	aiccInited = true;

	initAdapter();

	initDone();
}

function AICCServerInit()
{
	var aicc_server = "";
	if(remoteProxy)
	{
		aicc_server = params['aicc_url'].substring(0,params['aicc_url'].lastIndexOf('/'));
		aicc_server = aicc_server.substring(0,aicc_server.lastIndexOf('/')+1);
		aicc_server += "aicc/";
	}

	aicc_server += "aicc.swf";

	var fo = new SWFObject(aicc_server, "aicc", "1", "1", "6.0.79.0", "#FFFFFF");
	fo.addVariable("aicc_url", params['aicc_url']);
	fo.addVariable("aicc_sid", params['aicc_sid']);

	fo.addParam("swliveconnect", "true");
	fo.setAttribute('redirectUrl', 'noflash.htm');
	fo.write("aiccserver");

	document.forms['ensureExit'].action = params['aicc_url'];
	document.forms['ensureExit'].elements['session_id'].value = params['aicc_sid'];

}

function aiccadapter_doFSCommand(command,args)
{
	if (command == "AICCInit")
	{
		AICCInit(args);
	}
}