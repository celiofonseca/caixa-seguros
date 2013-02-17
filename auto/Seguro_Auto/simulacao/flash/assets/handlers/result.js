/*
ResultHandler

Author: Sean K. Friese
Version 1.0 20080206

Copyright 2007 RWD Technologies, Inc.
*/

var ResultHandler = {

	resultPage: "result.htm",
	resultObj: {},

	init: function(args)
	{
		for(arg in args)
		{
			ResultHandler.resultObj[arg] = args[arg];
		}

		ResultHandler.fixResults();
	},

	fixResults: function()
	{
		ResultHandler.resultObj['incNumberList'] = ResultHandler.resultObj['incNumberList'].split("-").join(",");
		ResultHandler.resultObj['status'] = (ResultHandler.resultObj['status'] == "true" ? "PASS": "FAIL")
	},

	getResult: function()
	{
		return ResultHandler.resultObj;
	},

	post: function()
	{
		var resultsWin =  window.open(ResultHandler.resultPage,"ResultsWin");
		if(!resultsWin)
		{
			alert('An error occurred while attempting to post results.');
		}
	}
}