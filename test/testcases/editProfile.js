<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head profile="http://selenium-ide.openqa.org/profiles/test-case">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="selenium.base" href="https://pairletes2.herokuapp.com/" />
<title>editProfile</title>
</head>
<body>
<table cellpadding="1" cellspacing="1" border="1">
<thead>
<tr><td rowspan="1" colspan="3">editProfile</td></tr>
</thead><tbody>
<tr>
	<td>clickAndWait</td>
	<td>css=button.btn.btn-default</td>
	<td></td>
</tr>
<tr>
	<td>type</td>
	<td>id=street</td>
	<td>5 Smith Lane</td>
</tr>
<tr>
	<td>type</td>
	<td>id=city</td>
	<td>Perth</td>
</tr>
<tr>
	<td>select</td>
	<td>id=state</td>
	<td>label=WA</td>
</tr>
<tr>
	<td>select</td>
	<td>id=interest1</td>
	<td>label=Cycling</td>
</tr>
<tr>
	<td>select</td>
	<td>id=interest2</td>
	<td>label=Rowing</td>
</tr>
<tr>
	<td>select</td>
	<td>id=interest3</td>
	<td>label=Triathalon</td>
</tr>
<tr>
	<td>type</td>
	<td>id=gym</td>
	<td> That new gym</td>
</tr>
<tr>
	<td>type</td>
	<td>id=aboutMe</td>
	<td> I am a testing bot</td>
</tr>
<tr>
	<td>clickAndWait</td>
	<td>css=input.btn.btn-default</td>
	<td></td>
</tr>
<tr>
	<td>verifyText</td>
	<td>css=div.col-sm-8 &gt; p</td>
	<td>newuser</td>
</tr>
<tr>
	<td>verifyText</td>
	<td>//div[2]/div[2]/p</td>
	<td>NewPassword</td>
</tr>
<tr>
	<td>verifyText</td>
	<td>//div[3]/div[2]/p</td>
	<td>Male</td>
</tr>
<tr>
	<td>verifyText</td>
	<td>//div[4]/div[2]/p</td>
	<td>1987-04-19</td>
</tr>
<tr>
	<td>verifyText</td>
	<td>//div[5]/div[2]/p</td>
	<td>That new gym</td>
</tr>
<tr>
	<td>verifyText</td>
	<td>//div[6]/div[2]/p</td>
	<td>1. cycling</td>
</tr>
<tr>
	<td>verifyText</td>
	<td>//p[2]</td>
	<td>2. rowing</td>
</tr>
<tr>
	<td>verifyText</td>
	<td>//p[3]</td>
	<td>3. triathalon</td>
</tr>
<tr>
	<td>verifyText</td>
	<td>//div[7]/div[2]/p</td>
	<td>exact:Street: 5 Smith Lane</td>
</tr>
<tr>
	<td>verifyText</td>
	<td>//div[7]/div[2]/p[2]</td>
	<td>City/Suburb: Perth</td>
</tr>
<tr>
	<td>verifyText</td>
	<td>//div[7]/div[2]/p[2]</td>
	<td>City/Suburb: Perth</td>
</tr>
<tr>
	<td>verifyText</td>
	<td>//div[7]/div[2]/p[3]</td>
	<td>exact:State: WA</td>
</tr>
<tr>
	<td>verifyText</td>
	<td>//p[4]</td>
	<td>australia</td>
</tr>
<tr>
	<td>verifyText</td>
	<td>//div[8]/div[2]/p</td>
	<td>I am a testing bot</td>
</tr>

</tbody></table>
</body>
</html>
