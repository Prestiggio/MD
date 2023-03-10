<!DOCTYPE html>
@section("html")
<html ng-app="appPublic" ng-strict-di>
@show
@section("head")
<head>
@show
<meta charset="utf-8" />
@section("meta")
<title>Ry Material Design Angular Js</title>
@show
<meta name="viewport" content="width=device-width, initial-scale=1">
<link type="text/css" href="{{url("vendor/rymd/css/style.min.css")}}" rel="stylesheet">
<script src="https://use.fontawesome.com/5b67e30396.js"></script>
@yield("basescript")
</head>
<body>
@yield("body")
</body>
</html>