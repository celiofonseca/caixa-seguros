<% @CODEPAGE=65001 %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<title>Result</title>
<style type="text/css">
body
{
background-color: #E8E6E1;
margin: 10px;
font-family: Tahoma, Verdana, Arial, Helvetica;
}

h1
{
font-weight: bold;
font-size: 14pt;
color: #86A4D3;
font-family: Tahoma, Verdana, Arial
}

p,td
{
font-family: Tahoma, Verdana, Arial, Helvetica;
font-size: 12px;
color: #003366;
}
</style>
</head>
<body>

<div align="center">
	<h1>Result</h1>
	<table border="0" cellpadding="0" cellspacing="5" width="100%">
		<tr> 
			<td width="50%" align="right" valign="top"><b>Lesson name:</b></td>
			<td width="50%"><%=Request.Form("LessonName")%></td>
		</tr>
		<tr> 
			<td width="50%" align="right" valign="top"><b>Student's name:</b></td>
			<td width="50%"><%=Request.Form("StudentName")%></td>
		</tr>
		<tr> 
			<td width="50%" align="right" valign="top"><b>Lesson type:</b></td>
			<td width="50%"><%=Request.Form("LessonType")%></td>
		</tr>
		<tr> 
			<td width="50%" align="right" valign="top"><b>Total Interactions:</b></td>
			<td width="50%"><%=Request.Form("TotalInteractions")%></td>
		</tr>
		<tr> 
			<td width="50%" align="right" valign="top"><b>Total Incorrect:</b></td>
			<td width="50%"><%=Request.Form("TotalIncorrect")%></td>
		</tr>
		<tr> 
			<td width="50%" align="right" valign="top"><b>Score:</b></td>
			<td width="50%"><%=Request.Form("Score")%></td>
		</tr>
		<tr> 
			<td width="50%" align="right" valign="top"><b>Result:</b></td>
			<td width="50%"><%=Request.Form("Status")%></td>
		</tr>
		<tr> 
			<td width="50%" align="right" valign="top"><b>Incorrect Interactions:</b></td>
			<td width="50%"><%=Request.Form("ListOfIncorrect")%></td>
		</tr>
	</table>
</div>
</body>
</html>