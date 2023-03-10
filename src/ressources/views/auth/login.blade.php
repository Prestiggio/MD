<script type="application/dialog" data-href="/reset-password">
@include("rymd::auth.email")
</script>
<md-content layout="row" layout-align="center center" ng-controller="AuthController">
	<form class="md-whiteframe-2dp md-padding" name="frm_login" novalidate flex-gt-md="33" ng-submit="login()">
         <div class="text-center md-headline">@lang("rymd::auth.login")</div>
         <md-input-container class="md-block">
         	<label>@lang("rymd::auth.email")</label>
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
         	<label>@lang("rymd::auth.password")</label>
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
	            @lang("rymd::auth.remember")
	          </md-checkbox>
         </md-input-container>
         <div layout="column">
         	<md-button type="submit" class="md-raised md-primary md-block">@lang("rymd::auth.login")</md-button>
			<md-button href="#!/reset-password" class="md-raised md-accent md-block">@lang("rymd::auth.forgotten")</md-button>
         </div>
         <div layout="column">
			<md-button href="/register">@lang("rymd::auth.not_yet")</md-button>
         </div>
    </form>
</md-content>