<md-content layout="row" layout-align="center center">
	<form class="md-whiteframe-2dp md-padding" name="frm_register" novalidate flex-lg="33" flex-md="33" ng-submit="register()">
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
         	<md-button type="submit" class="md-raised md-accent" flex>@lang("rymd::auth.register")</md-button>
         </div>
    </form>
</md-content>