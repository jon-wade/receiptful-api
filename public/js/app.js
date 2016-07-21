var app = angular.module('app', ['ngRoute']);


app.controller('home', ['$scope', '$http', function($scope, $http) {

    $scope.response = false;
    $scope.reject = false;

    $scope.submit = function() {

        $http({
            method: 'POST',
            url: '/send',
            data: {
                toEmail: $scope.toEmail,
                fromEmail: $scope.fromEmail,
                message: $scope.message
            }
        }).then(function(res) {
            console.log('res=', res);
            $scope.response = true;
            $scope.status = res.status;
            $scope.from = res.data.from;
            $scope.to = res.data.to;
        }, function(rej) {
            console.log('rej=', rej);
            $scope.reject = true;
            $scope.status = res.status;
            $scope.from = res.data.from;
            $scope.to = res.data.to;
        });
    };

}]);