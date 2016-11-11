<form id="frmGrant" action="" layout="column">
{{ csrf_field() }}
<?php foreach($permissions as $permission): ?>
	<md-button class="ryfbgrant" data-perm="{{$permission->permission}}" data-status="{{$permission->status}}">{{$permission->permission}} {{$permission->status}}</md-button>
<?php endforeach; ?>
</form>
