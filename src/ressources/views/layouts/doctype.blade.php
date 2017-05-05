<!DOCTYPE html>
@section("html")
<html ng-app="appPublic" ng-strict-di>
@show
<head>
<meta charset="utf-8" />
@section("meta")
<title>Ry Material Design Angular Js</title>
@show
<meta name="viewport" content="width=device-width, initial-scale=1">
<link type="text/css" href="{{url("vendor/rymd/css/style.min.css")}}" rel="stylesheet">
@yield("basescript")
</head>
<body>
@yield("body")
</body>
</html>