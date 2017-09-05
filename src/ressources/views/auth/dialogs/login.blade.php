<script type="text/javascript">
(function(angular, $, undefined){
	var $scope = angular.element($("#popuplogin")).scope();
	var $http = angular.injector(["ng"]).get("$http");
	var $app = angular.element($("#popuplogin")).injector().get("$appSetup");
	var $mdDialog = angular.element($("#popuplogin")).injector().get("$mdDialog");
	var $timeout = angular.element($("#popuplogin")).injector().get("$timeout");
	var $shopping = angular.element($("#popuplogin")).injector().get("$shopping");
	var $sessionStorage = angular.element($("#popuplogin")).injector().get("$sessionStorage");
	var ryfb = angular.element($("#popuplogin")).injector().get("ryfb");
	var $location = angular.element($("#popuplogin")).injector().get("$location");

	$scope.loading = false;
	
	$scope.userdata = {};

	$scope.userdatareset = {};
	
	$scope.login = function(){
		$scope.loading = true;

		$timeout(function(){
			document.location.reload();
		}, 30000);
		
		$http.post("{{ url('/login') }}", $scope.userdata).then(function(response){
			document.location.href = response.data.redirect;
			$scope.loading = false;
		}, function(error){
			$scope.loading = false;
			$mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(document.location.host)
			        .textContent(error.message)
			        .ok('OK!'));
		});
	}

	$scope.gofb = function(){
		$scope.loading = true;
		delete $sessionStorage.fb.facebookphobia;
		ryfb.user().then(function(response){
			$scope.loading = false;
			if(response.redirect)
				document.location.href = response.redirect;
		}, function(error){
			$scope.loading = false;
			$mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(document.location.host)
			        .textContent(error.data.message)
			        .ok('OK!'));
		});
	}

	$scope.reset = function(){
		$http.post("{{ url('/password/email') }}", $scope.userdatareset).then(function(response){
			$mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title(document.location.host)
			        .textContent(response.data.message)
			        .ok('OK!'));
		}, function(){
			
		});
	};

	$scope.register = function(){
		$timeout(function(){
			document.location.reload();
		}, 5000);
		
		$scope.loading = true;
		$http.post("{{ url('/register') }}", $scope.userdata).then(function(response){
			document.location.href = response.redirect;
			$scope.loading = false;
		}, function(error){
			$scope.loading = false;
			$mdDialog.show($mdDialog.alert().clickOutsideToClose(false).title(document.location.host)
			        .textContent(error.message)
			        .ok('OK!'));
		});
	};
	
})(window.angular, window.jQuery);
</script>
<md-tabs id="popuplogin" md-dynamic-height md-border-bottom>
	<md-tab label="@lang("rymd::auth.login")">
		<md-content class="md-padding">
			<form name="frm_login" novalidate ng-submit="frm_login.$valid && login()">
		         <div class="text-center md-headline">@lang("rysocin::auth.login")</div>
		         <div class="text-center md-subhead">@lang("rysocin::auth.oneclick")</div>
		         <div layout="row" layout-align="space-between center" layout-wrap>
		         	<md-button type="button" class="md-raised md-primary" flex-md-lg flex-xs="100" ng-click="gofb()">@lang("rysocin::auth.facebook")</md-button>
		         </div>
		         <div class="text-center md-subhead">@lang("rysocin::auth.or")</div>
		         <md-input-container class="md-block">
		         	<label>@lang("rysocin::auth.email")</label>
		         	<input type="email" name="email" ng-model="userdata.email" required>
		         	<div ng-messages="frm_login.email.$error">
		         		<div ng-message="email">Veuillez renseigner un email valide</div>
		         		<div ng-message="required">Vous devez renseigner un email</div>
		         		@if ($errors->has('email'))
			            <div>{{ $errors->first('email') }}</div>
			            @endif
		         	</div>
		         	
		         </md-input-container>
		         <md-input-container class="md-block">
		         	<label>@lang("rysocin::auth.password")</label>
		         	<input type="password" name="password" ng-model="userdata.password" required minlength="4">
		         	<div ng-messages="frm_login.password.$error">
		         		<div ng-message="required">Vous devez renseigner un mot de passe</div>
		         		<div ng-message="minlength">Saisissez au moins 4 caractères</div>
		         		 @if ($errors->has('password'))
			            <div>{{ $errors->first('password') }}</div>
			            @endif
		         	</div>
		         </md-input-container>
		         <md-input-container class="md-block">
		         	<md-checkbox ng-model="userdata.remember" aria-label="Checkbox 1">
			            @lang("rysocin::auth.remember")
			          </md-checkbox>
		         </md-input-container>
		         <div layout="row" layout-align="space-between center">
		         	<md-button type="submit" class="md-raised md-accent">@lang("rysocin::auth.login")</md-button>
					<a href="#!/reset-password">@lang("rysocin::auth.forgotten")</a>
		         </div>
		    </form>
		</md-content>
	</md-tab>
	<md-tab label="@lang("rymd::auth.register")">
		<md-content class="md-padding">
			<form name="frm_register" novalidate ng-submit="frm_register.$valid && register()">
		         <div class="text-center md-headline">@lang("rymd::auth.register")</div>
		         <md-input-container class="md-block">
		         	<label>@lang("rymd::auth.name")</label>
		         	<input type="text" name="name" ng-model="userdata.name" required>
		         	<div ng-messages="frm_register.name.$error">
		         		<div ng-message="required">Vous devez renseigner votre nom</div>
		         		@if ($errors->has('name'))
		                <div>{{ $errors->first('name') }}</div>
		                @endif
		         	</div>        
		         </md-input-container>
		         <md-input-container class="md-block">
		         	<label>@lang("rymd::auth.email")</label>
		         	<input type="text" name="email" ng-model="userdata.email" required>
		         	<div ng-messages="frm_register.email.$error">
		         		<div ng-message="required">Vous devez renseigner votre email</div>
		         		<div ng-message="email">Vous devez renseigner un email valide</div>
		         		@if ($errors->has('email'))
		                <div>{{ $errors->first('email') }}</div>
		                @endif
		         	</div>        
		         </md-input-container>
		         <md-input-container class="md-block">
		         	<label>@lang("rymd::auth.password")</label>
		         	<input type="password" name="password" ng-model="userdata.password" required minlength="4">
		         	<div ng-messages="frm_register.password.$error">
		         		<div ng-message="required">Vous devez renseigner un mot de passe</div>
		         		<div ng-message="minlength">Votre mot de passe doit contenir au moins 4 caractères</div>
		         		@if ($errors->has('password'))
		         		<div>{{ $errors->first('password') }}</div>
		                @endif
		         	</div>
		         </md-input-container>
		         <md-input-container class="md-block">
		         	<label>@lang("rymd::auth.repassword")</label>
		         	<input id="password-confirm" type="password" ng-model="userdata.password_confirmation" name="password_confirmation" required minlength="4" match-model="userdata.password">
		         	<div ng-messages="frm_register.password_confirmation.$error">
		         		<div ng-message="required">Vous devez répéter le mot de passe</div>
		         		<div ng-message="minlength">Votre mot de passe doit contenir au moins 4 caractères</div>
		         		<div ng-message="matchModel">Vous n'aviez pas pu reproduire votre mot de passe</div>
		         		@if ($errors->has('password_confirmation'))
		         		<div>{{ $errors->first('password_confirmation') }}</div>
		                @endif
		         	</div>
		         </md-input-container>
		         <div layout="column">
		         	<div captcha ng-model="userdata.captcha"></div>
		         	<md-button type="submit" class="md-raised md-accent" flex>@lang("rymd::auth.register")</md-button>
		         </div>
		    </form>
		</md-content>
	</md-tab>
</md-tabs>