
var pluginVer = [requiredMajorVersion,requiredMinorVersion,requiredRevision].join(".");
var flashlmsadapter;
var API;
var api;
var apiObj;
var debugEnabled = false;
var _GET;
var srch = top.location.search.substring(1);
var embedded = false;
var aiccFound = false;
var aiccPreview = false;
var exiting = false;
var started = false;
var sessionInterval;
var cName = 'StudentName';
var enableKeyDelay = true;
var keyDelay = 100;

function doRegExMatch(txt,pattern)
{
	txt = doDecode(txt);
	pattern = doDecode(pattern);
	
	var re = new RegExp(pattern);
	
	if(txt.match(re))
	{
		// We have a match
		flashlmsadapter.setVariable('processEditActionRegex|true');
	}
	else
	{
		// We DON'T have a match
		flashlmsadapter.setVariable('processEditActionRegex|false');
	}
}

function doDecode(txt)
{
	var tmp = "";
	var arrText = txt.split(" ");

	for(var i=0;i<arrText.length;i++)
	{
		tmp += String.fromCharCode(arrText[i]);
	}

	return tmp;
}

function getExternalValue(method)
{
	var result = "some result from javascript";
	flashlmsadapter.setVariable(method+"|"+result);
}

function setFlashFocus()
{
	if(BrowserHandler.browser == "Explorer")
	{
		try
		{
			window.focus(document);
			document.flashObj.focus();
			flashlmsadapter.setVariable("focusEditDefault|");
		}
		catch(e){}
	}
}

function doFocus()
{
	if(BrowserHandler.browser == "Explorer")
	{
		window.focus(document);
	}
}

function GetVars()
{
	var query, qs = top.location.search.substring(1);
	var queries = qs.split(/\&/);
	for (var i=0; i<queries.length; i++)
	{
		query = queries[i].split(/\=/);
		this[query[0]] = (typeof query[1] == 'undefined') ? null : unescape(query[1]).replace(/\+/g," ");
	}
}

function openWindow(url_name,window_name,w,h,options) {
	if (options === null) { options=""; }
	winopts = "toolbar=" + (options.indexOf("toolbar") == -1 ? "no," : "yes,") +
	"location="  + (options.indexOf("location") == -1 ? "no," : "yes,") +
	"menubar=" + (options.indexOf("menubar") == -1 ? "no," : "yes,") +
	"scrollbars=" + (options.indexOf("scrollbars") == -1 ? "no," : "yes,") +
	"status=" + (options.indexOf("status") == -1 ? "no," : "yes,") +
	"resizable=" + (options.indexOf("resizable") == -1 ? "no," : "yes,") +
	"copyhistory=" + (options.indexOf("copyhistory") == -1 ? "no," : "yes,") +
	"width=" + w + ",height=" + h;
	return window.open(url_name,window_name,winopts);
}

function openPrintableSteps()
{
	var simPrintableStepsWin = openWindow('printable/printable.htm','simPrintableSteps',800,600,'scrollbars,resizable');
	if(simPrintableStepsWin)
	{
		simPrintableStepsWin.print();
	}
	else
	{
		alert('Unable to open printable steps window.  Please disable any popup blockers and try again.');
	}
}

function openPrintableDebug(debug)
{
	var simPrintableDebugWin = openWindow('assets/blank.htm','simPrintableDebug',800,600,'scrollbars,resizable');
	if(simPrintableDebugWin)
	{
		setTimeout(function(){simPrintableDebugWin.document.body.innerHTML = unescape(debug);},500);
	}
	else
	{
		alert('Unable to open printable steps window.  Please disable any popup blockers and try again.');
	}
}

function quit()
{
	exiting = true;
	
	if(API.__inited__ || apiVer=="AICC")
	{
		computeTime();
		API.LMSCommit('');
		API.LMSFinish('');
	}

	setTimeout(function() {top.close();},1000);
}

function exposeDataModel(dataString)
{
	//try
	//{
		// do something with the data_model
		if(window.opener)
		{
			if(embedded && window.opener.sendSimApi)
			{
				var dataStringArray = dataString.split("~~");
				var title = unescape(dataStringArray[0]);
				var totalToInclude = dataStringArray[1];
				var totalIncorrect = dataStringArray[2];
				var incStepNumberList = dataStringArray[3];

				//alert(title);
				//alert(totalSteps);
				//alert(totalIncorrectSteps);
				//alert(incStepNumberList);

				window.opener.sendSimApi(API.toJSONString(),title,totalToInclude,totalIncorrect,incStepNumberList);
			}

			if(window.opener.updateStatus)
			{
				window.opener.updateStatus('Exposed Data Model From Simulation:\n'+unescape(dataString));
			}
		}

		top.close();
	//} catch (e) { }
}

function finish()
{
	clearInterval(sessionInterval);

	if(apiVer == "AICC")
	{
		if(API && !exitSent)
		{
			API.LMSCommit('');
		}
		sendExit();
	}
	else
	{
		try {
			if (API && API.__inited__) {
				computeTime();
				API.LMSCommit('');
				API.LMSFinish('');
			}
		} catch (e) { }
	}
}

function resizeWindow(p_width,p_height)
{
	var w = 0;
	var h = 0;
	var t = 0;
	var l = 0;

	if(windowControl)
	{
		if(fullscreen)
		{
			w = screen.availWidth;
			h = screen.availHeight;
			top.resizeTo(w,h);
			top.moveTo(0,0);
		}
		else
		{
			w = parseInt(p_width,10);
			h = parseInt(p_height,10);
			top.resizeTo(w,h);
			top.moveTo((screen.availWidth-w)/2,(screen.availHeight-h)/2);
		}
	}
}

function sendResult(lessonName, studentName, totalToInclude, totalIncorrect, score, status, assessmentURI, incNumberList)
{
	if(!aiccPreview)
	{
		var args = {};

		args.lessonName		= lessonName;
		args.studentName	= studentName;

		// If they entered a student name in the sim, no cookie existed previous to launchinng, set it now.
		var c = new Cookie(document,cName,730,'/');
		c.load();
		if(!c["username"] || (c["username"].length == 0))
		{
			c["username"] = studentName;
			c.store();
		}

		args.totalToInclude	= totalToInclude;
		args.totalIncorrect	= totalIncorrect;
		args.score			= score;
		args.status			= status;
		args.assessmentURI	= assessmentURI;
		args.incNumberList	= incNumberList;

		ResultHandler.init(args);
		ResultHandler.post();
	}
	else
	{
		top.close();
	}
}

function noFlash()
{
	document.getElementById('noFlashContent').style.display = 'block';
	document.getElementById('flashContent').style.display = 'none';
}

function checkExit(evnt)
{
	if(!exiting && started)
	{
		computeTime();
		API.LMSCommit('');
		evnt.returnValue = LANGSTRING_AICC_Check_Before_Unload;
	}
	else
	{
		if(API && !exitSent)
		{
			computeTime();
			API.LMSCommit('');
		}
		sendExit();
	}
}

function customGetURL(url)
{
	var externalWin = window.open(url, 'extWin'+Math.ceil(1000*Math.random()), "width="+simWidth+",height="+simHeight+",resizable=yes,scrollbars=yes,status=yes");
}

// Catch extraneous FSCommands from within Flash
allowScale = function(){ };
allowscale = function(){ };
showMenu = function(){ };
showmenu = function(){ };

function parseParams(paramString)
{
	paramString = paramString.substring(1,paramString.length);
	var d = new Object();
	if(paramString.indexOf('=') != -1) {
		var index0 = -1;
		var count = 1;
		while(((index0 + 1) < paramString.length) &&
				((index0 = paramString.indexOf('&', index0 + 1)) != -1)) {
			count++;
		}

		var index1 = 0;
		var index2 = 0;
		var keyValue = null;
		var subindex = 0;
		var len = paramString.length;

		while(index1 < len) {
			index2 = paramString.indexOf('&', index1);
			if(index2 == -1)
				index2 = len;
				keyValue = paramString.substring(index1, index2);
				subindex = keyValue.indexOf('=');
				var key = keyValue.substring(0, subindex);
				var key = key.toLowerCase();
				var val = keyValue.substring(subindex + 1, keyValue.length);
				d[unescape(key)] = unescape(val.replace(/\+/g,' '));
				index1 = index2 + 1;
			}
		}
	return d;
}

// ----------------------------------------------
// Events
// ----------------------------------------------

window.onload=function()
{
	BrowserHandler.init();
	resizeWindow(simWidth,simHeight);
	document.body.scroll="no";

	doFocus();

	if(BrowserHandler.browser == "Explorer")
	{
		   document.onfocusin = function()
		   {
				  //focused
				  KeyHandler.clearModifiers();
		   }
	}
	else
	{
		   window.onfocus = function()
		   {
				  //focused
				  KeyHandler.clearModifiers();
		   }
	}
};

window.onunload=function()
{
	finish();
	
	if(window.opener && !window.opener.closed)
	{
		if(window.opener.__is_uPerform_Sim_Index__ && window.opener.opener && !window.opener.opener.closed)
		{
			window.opener.close();
		}
	}
	
};

window.onbeforeunload=function(evnt)
{
	if(!evnt)
	{
		evnt = window.event;
	}

	if(apiVer == "AICC")
	{
		checkExit(evnt);
	}
};

// ----------------------------------------------
// Page initialization
// ----------------------------------------------
function init()
{
	document.getElementById('noFlashContent').style.display = 'none';

	//_GET = new GetVars();

	if(srch.indexOf("embedded=true") > -1)
	{
		embedded = true;
		apiVer = "SCORM1.2";
	}
	else
	{
		switch(apiVer)
		{
			case 'AICC':
				if(window.opener && !window.opener.closed && window.opener.__is_uPerform_Sim_Index__)
				{
					params = getAICCParams(window.opener);
				}
				else
				{
					params = getAICCParams();
				}

				if(params && (params['aicc_sid'] || params['AICC_SID']) && (params['aicc_url'] || params['AICC_URL']))
				{
					aiccFound = true;
					initClient();
				}
				else
				{
					if(document.location.protocol.toLowerCase().indexOf('file') < 0)
					{
						aiccPreview = true;
						apiVer = "Local";
						alert('Lesson data will not be sent to the server unless the content is accessed through the LMS.\nPlease contact your LMS administrator to ensure AICC parameters are specified correctly.');
					}
					else
					{
						aiccPreview = true;
						apiVer = "Local";
					}
				}
				break;
			
			case 'SCORM1.2':
				if(window.opener && !window.opener.closed)
				{
					if(window.opener.__is_uPerform_Sim_Index__)
					{
						if(window.opener.embedded)
						{
							embedded = true;
						}
						else
						{
							if(window.opener.API)
							{
								API = window.opener.API;
								apiVer = window.opener.apiVer;
							}
							else
							{
								API = getAPI_12();
								if(API != null)
								{
									if(_Debug)
									{
										alert('SCORM 1.2 API FOUND');
									}
									// Wrap 1.2 API with CheckedAPI to maintain initialization status
									API = new CheckedAPI(API);
								}
							}
						}
					}
					else
					{
						if(!embedded)
						{
							API = getAPI_12();
							if(API != null)
							{
								if(_Debug)
								{
									alert('SCORM 1.2 API FOUND');
								}
								// Wrap 1.2 API with CheckedAPI to maintain initialization status
								API = new CheckedAPI(API);
							}
						}
					}
				}
				
				break;

			case 'SCORM2004':
				if(window.opener && !window.opener.closed)
				{
					if(window.opener.__is_uPerform_Sim_Index__)
					{
						if(window.opener.API)
						{
							API = window.opener.API;
							apiVer = window.opener.apiVer;
						}
						else
						{
							api = getAPIHandle();
							if(api != null)
							{
								if(_Debug)
								{
									alert('SCORM 2004 API FOUND');
								}
								// Create fake wrapper API to map 1.2 calls to 2004
								API = new APIObject();
							}
						}
					}
				}
				break;
		}
	}

	// No valid SCORM or AICC API can be found.
	// Use cookie-based LocalAPI to catch all 1.2 calls
	if((API == null) && (apiVer != "AICC"))
	{
		var isEmbeddedInAssessment = (embedded && window.opener.sendSimApi && mode == 3);
		API = new LocalAPI({name:simAPIName+mode,'lifetime':48,disableStore:isEmbeddedInAssessment});
		apiVer = "Local";
	}

	if(apiVer != "AICC")
	{
		initAdapter();
		run();
	}
}

function initAdapter()
{
	if(API)
	{
		if(!API.__inited__)
		{
			API.LMSInitialize('');
		}
		startTimer();
		sessionInterval = setInterval(function(){computeTime();},heartbeatInterval);
	}

	flashlmsadapter = new FlashLMSAdapter(API);
	flashlmsadapter.register();

	var varsObj = {};
	varsObj.__SIM_MODE__ = mode;
	varsObj.__REVIEWER_ENABLED__ = reviewerEnabled;
	varsObj.__API_DATA_MODEL__ = flashlmsadapter._data_model;
	varsObj.__DEBUG_ENABLED__ = debugEnabled;
	varsObj.__API_VER__ = apiVer;
	varsObj.__BROWSER__ = BrowserHandler.browser;
	varsObj.__BROWSER_VER__ = BrowserHandler.version;
	varsObj.__OS__ = BrowserHandler.OS;
	varsObj.__EMBEDDED__ = embedded;
	varsObj.__ENABLE_KEY_DELAY__ = enableKeyDelay;
	varsObj.__KEY_DELAY__ = keyDelay;
	varsObj.__DISPLAY_USERNAME_PROMPT__ = displayUsernamePrompt;
	try{varsObj.__COMPLETION_STRING__ = completion;}catch(e){}

	var c = new Cookie(document,cName,72,'/');
	c.load();

	if(window.opener && !window.opener.closed)
	{
		if(window.opener.__is_uPerform_Sim_Index__)
		{
			if(window.opener.username)
			{
				varsObj.__USERNAME__ = window.opener.username;
			}
			else
			{
				if(c["username"] && (c["username"].length > 0))
				{
					varsObj.__USERNAME__ = c["username"];
				}
				else
				{
					varsObj.__USERNAME__ = '';
				}
			}
		}
	}

	flashlmsadapter.loadFlash('assets/rwd_simulation_output.swf','#FFFFFF', varsObj);

	if(handleRightClick)
	{
		RightClickHandler.init();
	}
	KeyHandler.init();
	MouseWheelHandler.init();
}

function run()
{
	var lesson_status;

	if(API)
	{
		lesson_status = API.LMSGetValue('cmi.core.lesson_status');
		
		if(lesson_status)
		{
			if((lesson_status.toLowerCase().indexOf('n') == 0) || (lesson_status.toLowerCase().indexOf('i') == 0))
			{
				API.LMSSetValue('cmi.core.lesson_status','incomplete');
			}
		}
	}

	started = true;
}
