@extends("rymd::canvas.layouts.material")

@section("content")
<div layout="row" ng-view layout-align="center center" flex>
	
</div>
<div flex="20">
	<resolve-loader></resolve-loader>
</div>
@stop
