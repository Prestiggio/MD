@extends("rymd::layouts.doctype")

@section("html")
<html ng-app="appPublic" ng-strict-di>
@stop

@section("meta")
<title>Ry Material Design Angular Js</title>
<meta name="csrf-token" content="{{ csrf_token() }}">
@stop

@section("script")
<script type="text/javascript" src="{{url("vendor/rymd/js/script.min.js")}}"></script>
<script type="application/ld+json" id="conf">
{!!$js!!}
</script>
<script type="text/javascript">
(function(window, angular, $, gameApp, undefined){

	angular.module("appPublic", ["gameApp"]);
	
})(window, window.angular, window.jQuery, window.gameApp);
</script>
@stop
