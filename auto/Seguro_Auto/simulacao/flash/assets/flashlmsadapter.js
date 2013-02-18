
function FlashLMSAdapter(apiref)
{
	this.api = apiref;
	this._default_elements = ['cmi.core.student_id','cmi.core.student_name','cmi.core.lesson_location','cmi.core.lesson_status','cmi.core.score.raw','cmi.suspend_data'];
	this._data_model = null;
}

FlashLMSAdapter.prototype.register = function(elements)
{
	if (!elements) { var elements = this._default_elements; }
	
	var data_model = '';
	
	for (var i=0;i<elements.length;i++)
	{
		var element = elements[i];
		var element_value = this.api.LMSGetValue(element);
		data_model += element + ':' + element_value + '~';
	}
	
	this._data_model = escape(data_model.substring(0,data_model.length-1));
}

FlashLMSAdapter.prototype.loadFlash = function(src,bgcolor,varsObj)
{

	if (!src) { alert('You must specify a src!'); return; }

	var swfID = 'flashObj';
	var vars = ""

	// Additional Vars...
	for(prop in varsObj)
	{
		if(typeof(varsObj[prop]) != "function")
		{
			vars += "&"+prop+"="+varsObj[prop];
		}
	}

	var protocol = (document.location.protocol.toLowerCase().indexOf('file') < 0) ? document.location.protocol : 'http:';

	if (!bgcolor) { bgcolor = '#FFFFFF'; }

	var tags = '';
	tags += '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"';
	tags += ' codebase="'+protocol+'//fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0"';
	tags += ' id="' + swfID + '" width="100%" height="100%" align="middle">\n';
	tags += ' <param name="src" value="' + src + '" />\n';
	tags += ' <param name="bgcolor" value="' + bgcolor + '" />\n';
	tags += ' <param name="FlashVars" value="' + vars.substr(1) + '" />\n';
	tags += ' <param name="loop" value="false" />\n';
	tags += ' <param name="quality" value="best" />\n';
	tags += ' <param name="scale" value="noscale" />\n';
	tags += ' <param name="allowScriptAccess" value="always">';
	
	if(handleRightClick)
	{
		tags += ' <param name="menu" value="false" />\n';
		tags += ' <param name="wmode" value="opaque" />\n';
	}

	tags += '<embed src="' + src + '" FlashVars="' + vars.substr(1) + '" scale="noscale" quality="best" bgcolor="' + bgcolor + '"';
	tags += ' width="100%" height="100%" align="middle" ';
	tags += ' swLiveConnect="true" name="' + swfID + '" id="' + swfID + '" ';
	tags += ' allowScriptAccess="always"';
	
	if(handleRightClick)
	{
		tags += ' menu="false" ';
		tags += ' wmode="opaque" ';
	}
	
	tags += ' type="application/x-shockwave-flash" ';
	tags += ' pluginspage="http://www.macromedia.com/go/getflashplayer">';
	tags += '</embed>\n';

	tags += '</object>\n';

	document.getElementById('flashContent').innerHTML = tags;

	try
	{
		var simFlashObj = document.getElementById(swfID);
		simFlashObj.attachEvent('fscommand',flashObj_DoFSCommand);
	}
	catch (e) { }
}

FlashLMSAdapter.prototype.setVariable = function(val)
{
	if (!this.flashObject)
	{
		this.flashObject = document["flashObj"];
	}

	var self = this;
	setTimeout(function(){self.flashObject.SetVariable('fromjs',val);}, 100);
}

function flashObj_DoFSCommand(command, args)
{
	if(command != 'showmenu')
	{
		eval (command + ((command.indexOf("(") == -1) ? ("(\"" + args + "\")") : ""));
	}
}
