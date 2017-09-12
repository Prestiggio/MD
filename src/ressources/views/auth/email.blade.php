<form ng-submit="frm_reset.$valid && reset()" name="frm_reset" class="md-padding" novalidate>
	<md-dialog-content>
		<div class="md-headline">@lang("rymd::auth.reset")</div>
		<md-input-container class="md-block">
			<label>@lang("rymd::auth.email")</label>
			<input type="email" name="email" ng-model="userdatareset.email" required>
			<div ng-messages="frm_reset.email.$error">
				<div ng-message="required">Veuillez renseigner un email</div>
				<div ng-message="email">Veuillez renseigner un email valide</div>
				@if ($errors->has('email'))
                <div>{{ $errors->first('email') }}</div>
                @endif
			</div>
		</md-input-container>
		<div class="text-center">
			<md-button class="md-raised md-primary" type="submit">@lang("rymd::auth.reset_link")</md-button>
		</div>
	</md-dialog-content>
</form>
