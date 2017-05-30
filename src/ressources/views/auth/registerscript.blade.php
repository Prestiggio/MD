<script type="text/javascript">
function main($scope, $http, $mdDialog, $timeout) {
	$scope.loading = false;

	$scope.userdata = {};

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
}
main.$inject = ["$scope", "$http", "$mdDialog", "$timeout"];
</script>