<md-button ng-click="ngPaginate(1)" aria-label="@lang("rymd::overall.first")" ng-show="data.current_page!=1 && data.last_page > 1">@lang("rymd::overall.first")</md-button>
<md-button ng-repeat="i in []|pagination:data.last_page" ng-click="ngPaginate(i)" ng-class="{current:(data.current_page==i)}" ng-disabled="data.current_page==i" arial-label="@{{i}}">@{{i}}</md-button>
<md-button ng-click="ngPaginate(data.last_page)" ng-show="data.last_page!=data.current_page && data.last_page > 3" aria-label="@lang("rymd::overall.last")">@lang("rymd::overall.last")</md-button>