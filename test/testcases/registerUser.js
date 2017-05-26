<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head profile="http://selenium-ide.openqa.org/profiles/test-case">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="selenium.base" href="https://pairletes2.herokuapp.com/" />
<title>Register</title>
</head>
<body>
<table cellpadding="1" cellspacing="1" border="1">
<thead>
<tr><td rowspan="1" colspan="3">Register</td></tr>
</thead><tbody>
<tr>
	<td>open</td>
	<td>/</td>
	<td></td>
</tr>
<tr>
	<td>clickAndWait</td>
	<td>link=Register</td>
	<td></td>
</tr>
<tr>
	<td>type</td>
	<td>id=username</td>
	<td>newuser</td>
</tr>
<tr>
	<td>type</td>
	<td>id=name</td>
	<td>NewPassword</td>
</tr>
<tr>
	<td>type</td>
	<td>id=email</td>
	<td>User@email.com</td>
</tr>
<tr>
	<td>type</td>
	<td>id=pwd</td>
	<td>User1</td>
</tr>
<tr>
	<td>select</td>
	<td>id=gender</td>
	<td>label=Male</td>
</tr>
<tr>
	<td>select</td>
	<td>name=mth</td>
	<td>label=Apr</td>
</tr>
<tr>
	<td>select</td>
	<td>name=day</td>
	<td>label=19</td>
</tr>
<tr>
	<td>select</td>
	<td>name=year</td>
	<td>label=1987</td>
</tr>
<tr>
	<td>clickAndWait</td>
	<td>css=input.btn.btn-default</td>
	<td></td>
</tr>
<tr>
	<td>verifyLocation</td>
	<td>https://pairletes2.herokuapp.com/</td>
	<td>newuser</td>
</tr>
<tr>
	<td>clickAndWait</td>
	<td>link=Logout</td>
	<td></td>
</tr>

</tbody></table>
</body>
</html>
