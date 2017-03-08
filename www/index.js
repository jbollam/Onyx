var app = angular.module("app", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        // login view definition
        .when("/login", {
            controller: "loginController",
            controllerAs: "vm",
            templateUrl: "login.html"
        })
        // main app view definition
        .when("/main", {
             controller: "POSController",
            // controllerAs: "vm",
            templateUrl: "main.html"
        })
        // many other routes could be defined here
        // and redirect the user to the main view if no routes match
        .otherwise({
            redirectTo: "/main"
        });
});

// execute this function when the main module finishes loading
app.run(function ($rootScope, $location) {
    // attach to the event that fires before the router changes routes
    $rootScope.$on("$routeChangeStart", function (event, next) {
        // check current login status and filter out if navigating to login
        if (!$rootScope.loggedIn && next.originalPath !== "/login") {
            // remember the original url
            $location.url("/login?back=" + $location.url());
        }
    });
});

app.service("loginService", function ($http) {
    return {
        checkLogin: function () {
            return $http.get("/me").then(function (response) {
                return response.data;
            });
        },
        login: function (user, pass) {
            return $http.post("/login", {
                user: user,
                pass: pass
            }).then(function (response) {
                return response.data;
            }, function (response) {
                var err = new Error(response.statusText);
                err.code = response.status;
                throw err;
            });
        }
    };
});

app.controller("loginController", function ($rootScope, $location, loginService) {
    var vm = this;

    function success() {
        $rootScope.loggedIn = true;

        var back = $location.search().back || "";
        $location.url(back !== "/login" ? back : "");
    }

    function failure() {
        $rootScope.loggedIn = false;
    }

    loginService.checkLogin().then(success);

    vm.login = function () {
        loginService.login(vm.user, vm.pass).then(success, failure);
    };
});

app.controller('POSController', function ($scope) {
    $scope.food = {
      pizza       : {count: 1, id:2, detail: "Brick Oven Pizza", price: 500},
      donut       : {count: 3, id:3, detail: "Glazed Donut",price: 80},
      tortilla    : {count: 1, id:4, detail: "Tortilla Chips",price: 65},
      burger      : {count: 1, id:5, detail: "Burger",price: 300},
      samosa      : {count: 1, id:6, detail: "Delicious Samosas",price: 30},
      coldcoffee  : {count: 1, id:7, detail: "Cold Coffee",price: 150},
      hotcoffee   : {count: 1, id:8, detail: "Hot Coffee",price: 200},
      coke        : {count: 1, id:9, detail: "Coke",price: 50},
      dietcoke    : {count: 1, id:10, detail: "Diet Coke",price: 50},
      pepsi       : {count: 1, id:11, detail: "Pepsi",price: 50},
      vegcombo    : {count: 1, id:12, detail: "Veg Combo (rice, chapati, dal)",price: 500},
      nonvegcombo : {count: 1, id:13, detail: "Non Veg Combo (rice, chicken)",price: 750}
    };
    
    
    $scope.itemsCnt = 1;
    $scope.order = [];
    $scope.isDisabled = true;

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

    $scope.add = function(item) {

      $scope.orderedItemCnt = 1;
      var foodItem = {
        orderedItemCnt : 1,
        totalPrice : item.price,
        itemId : item.id, 
        id : $scope.itemsCnt,
        item : item
      };

        // Find if the item is already in Cart
        //var cartItems = $.grep($scope.order, function(e){ return e.itemId == item.id; });
        var cartItems = $scope.order.filter(function (value) {
                                        return value.itemId == item.id;
                         });

         if(cartItems.length > 0  && !isEmpty($scope.order)){
            cartItems[0].orderedItemCnt = ++ cartItems[0].orderedItemCnt; 
            cartItems[0].totalPrice = item.price * cartItems[0].orderedItemCnt;
         }
         else{
            $scope.order.push(foodItem);
            $scope.itemsCnt = $scope.order.length; 
         }
    };
    
    $scope.getSum = function() {
      var i = 0,
        sum = 0;

      for(; i < $scope.order.length; i++) {
        sum += parseInt($scope.order[i].totalPrice, 10);
      }
      return sum;
    };

    $scope.addItem = function(item, index) {         
          item.orderedItemCnt = ++ item.orderedItemCnt; 
          item.totalPrice = item.item.price * item.orderedItemCnt;
    };


    $scope.subtractItem = function(item, $index)
    {
      if (item.orderedItemCnt > 1) {
          item.orderedItemCnt = -- item.orderedItemCnt; 
          item.totalPrice = item.item.price * item.orderedItemCnt;
      }
      else{
          $scope.isDisabled = true;
          // isDisabled = false;    
         // $("#SubstractItemBtn").prop("disabled", true);
      }
    }

    $scope.deleteItem = function(index) {
      $scope.order.splice(index, 1);
    };
    
    $scope.checkout = function(index) {
      alert("Order total: $" + $scope.getSum() + "\n\nPayment received. Thanks.");
    };
    
    $scope.clearOrder = function() {
      $scope.order = [];
    };

    $scope.selectType = function(type){
     $scope.type = type;
    };

    $scope.scan = function(){
        $scope.isscanned = true;
    }

    $scope.recharge = function(amount){
        $scope.rechargeAmountinRs = amount;
    }
});

