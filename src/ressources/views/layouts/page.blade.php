@extends("rymd::layouts.doctype")

@section("html")
<html ng-app="appPublic" ng-strict-di>
@stop

@section("meta")
<title>Ry Material Design Angular Js</title>
@stop

@section("basescript")
<script type="text/javascript" src="{{url("vendor/rymd/js/script.min.js")}}"></script>
<script type="application/ld+json" id="conf">
{!!$js!!}
</script>
<script type="text/javascript">
(function(window, angular, $, gameApp, undefined){

	angular.module("appPublic", ["ngApp"]);
	
})(window, window.angular, window.jQuery, window.appApp);
</script>
@yield("script")
@stop

@section("body")
@yield("main")
@stop