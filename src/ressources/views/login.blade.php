<div flex layout="row" layout-align="center center">
	<form id="frmSignIn" method="POST" action="{{ url('/login') }}" layout="column">
		{{ csrf_field() }}
		<md-button class="ryfblogin" data-redirect="{{ $redirect }}">login</md-button>
		<br/>
		<md-button class="ryfbpagetab" data-redirect="{{ $redirect }}"></md-button>
	</form>
</div>
