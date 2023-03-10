(function(window, angular, $, undefined){
	
	var AppService = function(data, template, $routeProvider){
		var injections = ["$scope", "$mdDialog", "$http", "$timeout", "$appSetup", "$routeParams", "$location", "$compile", 
			              "$interval", "$mdSidenav", "$log", "$interpolate", "$localStorage", "$sessionStorage", "$filter",
			             ];
		this.loaded = [];
		this.storage = 1; //local 2-session
		this.template = template;
		this.data = data;
		this.lock = false;
		this.popup = false;
		this.menuitems = [];
		this.dialogs = [];
		this.actions = {};
		this.queueDialog = function(dialogOptions){
			this.dialogs.push(dialogOptions);
		};
		this.remap = function(arg, func){
			var newarg = arg;
			if(func && func.$inject) {
				newarg = [];
				angular.forEach(func.$inject, function(v, k){
					var i = injections.indexOf(v);
					newarg.push(arg[i]);
				});
			}			
			return newarg;
		};
		this.reinject = function(func){
			if(func && func.$inject) {
				angular.forEach(func.$inject, function(v, k){
					if(injections.indexOf(v)<0) {
						injections.push(v);
					}
				});
			}
			return injections;
		};
		this.when = function(url, fn){
			this.actions[url] = fn;
		};
		this.trigger = function(action){
			for(var i in this.actions) {
				if(this.urlMatch(i, action)) {
					this.actions[i].apply(window, arguments);
				}
			}
		};
		this.urlMatch = function(pattern, action){
			var pattern = pattern.replace(/:\w+/g, '[^\/]+');
			var regexp = new RegExp(pattern);
			return regexp.test(action);
		};
	};
	
	angular.module("ngApp", ["ngMaterial", "ngRoute", "ngSanitize", "ngMessages", "ngStorage", "jlareau.bowser"])
	.factory("httpInterceptor", ["$q", "$rootScope", "$window", function($q, $rootScope, $window){
		var loadingCount = 0;
		
		return {
			request : function(config){
				if(config.method && config.method.toLowerCase()=="post") {
					$window.onbeforeunload = function(){
						return 'Modifications non sauvegardées. Voulez-vous vraiment quitter cette page ?';
					};
					$rootScope.loading = true;
				}
				if(config.data && config.data.error)
					alert(config.data.error);
				if(++loadingCount === 1) $rootScope.$broadcast('loading:progress');
                return config || $q.when(config);
			},
			
			response : function(response){
				if(response.config.method && response.config.method.toLowerCase()=="post") {
					$window.onbeforeunload = null;
					$rootScope.loading = false;
				}
				if(response.data && response.data.error)
					alert(response.data.error);
				if(--loadingCount === 0) $rootScope.$broadcast('loading:finish');
                return response || $q.when(response);
			},
			
			responseError: function (response) {
				if(response.config.method && response.config.method.toLowerCase()=="post") {
					$window.onbeforeunload = null;
					$rootScope.loading = false;
				}
				if(response.data && response.data.error)
					alert(response.data.error);
				if(response.data.redirect) {
					document.location.href = response.data.redirect;
				}
                if(--loadingCount === 0) $rootScope.$broadcast('loading:finish');
                return $q.reject(response);
            }
		};
	}])
	.provider("$appSetup", ["$mdThemingProvider", "$routeProvider", "$locationProvider", "$httpProvider", function $appSetupProvider($mdThemingProvider, $routeProvider, $locationProvider, $httpProvider){

		$httpProvider.interceptors.push('httpInterceptor');
		
		this.data = {};
		
		this.templates = {
				body : "/vendor/rymd/sidenav.html",
				'header nav': "/vendor/rymd/nav.html"
			};
		
		var dis = this;
		
		$("script[type='application/ld+json']").each(function(){
            var str = $(this).text();
            var json = JSON.parse(str);
            var key = $(this).prop("id");
            dis.data[key] = json;
        });
		
		this.alert = function(message){
			if(message)
				dis.data.conf.message = message;
		};
		
		this.setupTemplate = function(templates) {
			this.templates = templates;
		};
		
		this.setupTheme = function(params){
			for(var p in this.data.conf.palettes) {
				$mdThemingProvider.definePalette(p, this.data.conf.palettes[p]);
			}
			$mdThemingProvider.theme('default')
        	.primaryPalette(params.primary ? params.primary : 'blue')
        	.accentPalette(params.accent ? params.accent : "blue")
        	.backgroundPalette(params.background ? params.background : "grey");
			$mdThemingProvider.enableBrowserColor({
			    theme: 'default',
			    palette: params.browser ? params.browser : "blue"
			});
		};
		
		if(this.data.conf.theme) {
			this.setupTheme(this.data.conf.theme);
		}

		this.$get = function(){
			var app = new AppService(this.data, this.templates);
			app.lock = this.modalAjax;
			
			$("script[type='application/dialog']").each(function(){
				var isModal = $(this).data("modal");
				var href = $(this).data("href");
				var controller = function($scope, $mdDialog, $http, $timeout, $app, $routeParams, $location, $compile, 
	          		  $interval, $localStorage, $sessionStorage, $filter){
		        	$http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
		        	$http.defaults.headers.common["X-CSRF-TOKEN"] = $('meta[name="csrf-token"]').attr('content');
		        	try {
		        		if($app.storage==1)
							$scope.$storage = $localStorage;
						else
							$scope.$storage = $sessionStorage;
		        		$scope.$on('$locationChangeStart', function() {
		        			$app.trigger($location.path());
		        		});
		        		if(window.main)
		        			window.main.apply(window, $app.remap(arguments, window.main));
		        	}
		        	catch(e) {
		        		console.log("implement main($scope, $mdDialog, $http, $timeout, $app, $routeParams, $location, $compile, $interval);", e);
		        	}
		        	
		        };
		        controller.$inject = app.reinject(window.main);
				$routeProvider.when(href, {
			        template : $(this).text(),
			        controller : controller,
			        resolve : {
			        	popup : ["popupservice", "$appSetup", function(popupservice, $app){
			        		$app.queueDialog({
						    	controller: ["$scope", "$mdDialog", function($scope, $mdDialog){
						    		
						    		$scope.cancel = function(){
						    			$mdDialog.hide();
						    		};
						    		
						    	}],
						    	template: '<md-dialog ng-view></md-dialog>',
						    	clickOutsideToClose:!isModal,
						    	href: href
						    });
			        		popupservice.show();
			        		return $app.popup;
			        	}]
			        }
			    });
			});
			
			return app;
		};
		
	}]).service("$ga", ["$appSetup", function($app){
		if($app.data.conf.ga) {
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
				  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
				  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

				  ga('create', $app.data.conf.ga, 'auto');
				  ga('send', 'pageview');
				  if($app.data.auth)
					  ga('set', 'userId', $app.data.auth.id);
		}
	}]).factory("$ry", ["$appSetup", "$templateRequest", "$q", "$compile", "$ga", function($app, $templateRequest, $q, $compile, $ga){
		
		return {
			layout : function(scope){
				var deferred = $q.defer();
				
				var appdata = angular.copy($app.data);
				
				var dis = this;
				
				var ldjsonize = function(){
					var k = false;
					for(k in appdata) {
						if($app.loaded.indexOf(k)>=0)
							continue;
						break;
					}
					
					if(!k) {
						deferred.resolve();
						return;
					}
					
					if(k=="conf" || k=="auth"){
						delete appdata[k];
						ldjsonize();
						return;
					}
					
					var kscope = k.match(/(\w+)\.?\w*$/)[1];
					scope[kscope] = appdata[k];
					
					if($("#"+k).prop("src")!=null) {
						$templateRequest($("#"+k).prop("src")).then(function (data) {
		                    var template = angular.element(data);
		                    $("#"+k).replaceWith(template);
		                    $compile(template)(scope);
		                    $app.loaded.push(k);
		                    delete appdata[k];
		                    ldjsonize();
		                });
					}
					else {
						$app.loaded.push(k);
						delete appdata[k];
						ldjsonize();
					}
				};
				
				ldjsonize();
				
				return deferred.promise;
			}
		};	
		
	}]).factory("popupservice", ["$mdDialog", "$appSetup", "$q", "$rootScope", function($mdDialog, $app, $q, $rootScope){
		
		var gu = function(){
			
			var dis = this;
			this.displaying = false;
			this.bootstrapped = false;
			
			if($app.lock) {
				$rootScope.$on('loading:progress', function (){
				    $app.queueDialog({
				    	template: '<md-dialog style="box-shadow:none; overflow:visible; border:none; background-color:transparent; text-align:center;" layout="column"><md-icon md-font-icon="fa-refresh" class="fa rotate md-primary md-hue-1" style="font-size:48px;"></md-icon><span style="padding-top:15px; font-size: 0.6em;">chargement</span></md-dialog>',
	        	    	clickOutsideToClose:false,
				    });
				    dis.show();
				});

				$rootScope.$on('loading:finish', function (){
				    $mdDialog.hide();
				});
			}
			
			this.show = function(){
				if(!this.bootstrapped)
					return;
				
				if(this.displaying)
					return;
				
				var dialogOptions = $app.dialogs.shift();
				
				if(dialogOptions) {
					if(dialogOptions.templateContainer) {
						dialogOptions.template = $(dialogOptions.templateContainer).text();
						delete dialogOptions.templateContainer;
					}
					
					if(!$app.popup)
						$app.popup = $q.defer();
					
					var href = dialogOptions.href;
					delete dialogOptions.href;
					
					dialogOptions.onRemoving = function(){
						if($app.onDialogRemove)
							$app.onDialogRemove(href);
					};
					
					this.displaying = true;
					
					$mdDialog.show(dialogOptions).then(function() {
						$app.popup = null;
						dis.displaying = false;
						if($app.dialogs.length>0)
							dis.show();
				    }, function() {
				    	$app.popup = null;
				    	dis.displaying = false;
				    	if($app.dialogs.length>0)
							dis.show();
				    });
				}
			};
			
		};
		
		return new gu();
		
	}]).directive("rytree", ["$compile", "$appSetup", function($compile, $app){

		if($app.rytreeTempId==null)
			$app.rytreeTempId = 9999999;
		
		return {
			restrict : 'A',
			scope : {
				children : "=children"
			},
			link : function(scope, elem, attr, ctrl){
				var ul = $($("#"+attr.src).text());
				$(elem).append(ul);
				$compile(ul)(scope);
			},
			controller : ["$scope", "$appSetup", function($scope, $app){
				$scope.addChild = function(parent){
					$app.rytreeTempId++;
					parent.children.push({tempid:$app.rytreeTempId,children:[]});
				};
				$scope.hasChild = function(value){
					return angular.isObject(value) || angular.isArray(value);
				};
				$scope.isLink = function(value){
					if(value==undefined)
						return false;
					
					return value.toString().startsWith("http://") || value.toString().startsWith("https://");
				};
			}]
		};
	}]).directive("treeCheck", function(){
		return {
			restrict : "CA",
			controller : ["$scope", function($scope){
				$scope.toggle = function(data){
					angular.forEach(data.children, function(item){
						item.selected = data.selected;
						$scope.toggle(item);
					});
				};
			}]
		};
	}).directive("affix", function(){
		return {
			restrict : "C",
			link : function(scope, elem){
				$("body").on("scroll", function(){
					$(elem).toggleClass("affixed", $(elem).parent().offset().top <= 0);
				});
			}
		};
	}).filter('pagination', ["$appSetup", function($app){
		$app.currentPage = 1;
		return function(input, lastpage) {
			lastpage = parseInt(lastpage);
			var ecart = 3;
			var begin = $app.currentPage - ecart;
			if(begin<=0)
				begin = 1;
			var end = $app.currentPage + ecart;
			if(end>lastpage)
				end = lastpage;
			if(end<=begin)
				return [];
			
			for(var i=begin; i<end; i++) {
				input.push(i);
			}
			return input;
		}
	}]).directive("paginate", ["$compile", "$templateRequest", function($compile, $templateRequest){
		return {
			restrict : "E",
			require : 'ngModel',
			scope : {
				data : "=ngModel",
				ngPaginate : "=ngPaginate"
			},
			link : function(scope, elem, attr, ngModel){
				scope.first = attr.first;
				scope.last = attr.last;
				$templateRequest(attr.src).then(function(data){
					var template = angular.element(data);
                    $(elem).replaceWith(template);
            		$compile(template)(scope);
				});
			}
		};
	}]).directive("ryEdit", ["$compile", "$templateRequest", function($compile, $templateRequest){
		return {
			restrict : "E",
			require : 'ngModel',
			scope : {
				main : "=main",
				data : "=ngModel"
			},
			link : function(scope, elem, attr, ngModel){
				$templateRequest(attr.src).then(function(data){
					var template = angular.element(data);
                    $(elem).replaceWith(template);
            		$compile(template)(scope);
				});
			}
		};
	}]).directive("popuptarget", ["$templateRequest", "$compile", "$appSetup", function($templateRequest, $compile, $app){
		
		return {
			link : function(scope, element, attrs){
				var target = $(element).parents("md-dialog-content");
				$(element).on("click", function(e){
					e.preventDefault();
					$app.popup = null;
					target.html('<div style="text-align: center; width: 100%;"><img src="/medias/console/images/chargement.gif" class="img-responsive"/></div>');
					if($(element).attr("href")!=null) {
						$templateRequest($(element).attr("href")).then(function(data){
							var template = angular.element(data);
							target.html(template);
							$compile(template)(scope);
						});
					}
				});
			}
		};
		
	}]).directive("body", ["$route", "$templateRequest", "$compile", "$appSetup", "$timeout", "$mdDialog", "popupservice", "$ry",
	                       function($route, $templateRequest, $compile, $app, $timeout, $mdDialog, popupservice, $ry){
		var controller = function($scope, $mdDialog, $http, $timeout, $app, $routeParams, $location, $compile, 
      		  $interval, $mdSidenav, $log, $interpolate, $localStorage, $sessionStorage, $filter){
			if($app.data.conf.message) {
				alert($app.data.conf.message);
			}
			
			$scope.open = function(){
				$mdSidenav('left').open().then(function(){
					
				});
			};
			
			$scope.close = function () {
			   $mdSidenav('left').close()
			   .then(function () {
			       
			   });
			};
			
			for(var k in $app.data) {	
				$scope[k] = $app.data[k];
			}
			
			$http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
			$http.defaults.headers.common["X-CSRF-TOKEN"] = $('meta[name="csrf-token"]').attr('content');
			try {
				if($app.storage==1)
					$scope.$storage = $localStorage;
				else
					$scope.$storage = $sessionStorage;
				$scope.$on('$locationChangeStart', function() {
        			$app.trigger($location.path());
        		});
				if(window.main)
					window.main.apply(window, $app.remap(arguments, window.main));
			}
			catch(e){
				console.log("implement main($scope, $mdDialog, $http, $timeout, $app, $routeParams, $location, $compile, $interval)", e);
			}	
		};
		controller.$inject = $app.reinject(window.main);
		return {
			restrict : 'E',
			transclude : true,
			link : function(scope, element, attrs, ctrl, transclude){
				if(!$app.template.body)
					return;
				
				$templateRequest($app.template.body).then(function (data) {
                	var template = angular.element(data);
                	transclude(function(clone, scope2){
                		$compile(template)(scope2);
                		$(element).append(template);
                		
                		var cl = angular.element(clone);
                		$(".wrapper", template.parent()).append(cl);
                		scope2.menuitems = $app.menuitems;
                		
                		scope2.h1 = $("h1").html();

        				$("header nav ul li a", element).each(function(k, a){
							var title = $(a).data("mobtitle");
        					var item = {
        							name : title ? title : $(a).html(),
        							title : $(a).prop("title"),
        							href : $(a).prop("href")
        						};
        					if(!scope2.firstitem)
        						scope2.firstitem = item;
        					scope2.menuitems.push(item);
        				});
        				
        				$("a[role='nav']", element).each(function(k, a){
							var title = $(a).data("mobtitle");
        					var item = {
        							name : title ? title : $(a).html(),
        							title : $(a).prop("title"),
									href : $(a).prop("href"),
									side : true
        						};
        					if(!scope2.firstitem)
        						scope2.firstitem = item;
        					scope2.menuitems.push(item);
        				});
        				
        				if($app.template["header nav"]) {
        					$templateRequest($app.template["header nav"]).then(function (data) {
                                var template = angular.element(data);
                                $("body").prepend(template);
                                $("header nav").remove();
                                $compile(template)(scope2);
                            });
        				}

        				angular.forEach($app.template, function(v, k){
        					if(k!="body" && k!="header nav" && v!=null && $app.template[k]!=null) {
        						$templateRequest($app.template[k]).then(function (data) {
                                    var template = angular.element(data);
                                    $(k).replaceWith(template);
                            		$compile(template)(scope2);
                                });
        					}
        				});

        				if($("header a:first img").length>0) {
        					var toplogo = $("header a:first").clone();
            				toplogo.removeClass("hide-xs");
            				$("md-sidenav").prepend(toplogo);
        				}
        				
        				$ry.layout(scope2).then(function(){
        					$("script[type='application/popup']").each(function(){
            					var text = $(this).text();
            					var isModal = $(this).attr("modal") ? true : false;
            					var controller = $(this).attr("id");
            					if(!controller)
            						controller = $(this).attr("controller");
            					var delay = $(this).attr("delay");
            					scope2[controller] = function(){
            						$app.queueDialog({
            		        	    	controller: ["$scope", "$mdDialog", "$http", "$timeout", "$appSetup", "$location", "data", function($scope, $mdDialog, $http, $timeout, $app, $location, data){
            		        	    		
            		        	    		$scope.cancel = function(){
            		        	    			$mdDialog.hide();
            		        	    		};
            		        	    		
            		        	    		window[controller]($scope, $mdDialog, $http, $timeout, $app, $location, data);
            		        	    		
            		        	    	}],
            		        	    	template: text,
            		        	    	clickOutsideToClose:!isModal,
            		        	    	locals:{
            		        	    		data : arguments.length > 0 ? arguments[0] : null
            		        	    	}
            		        	    });
            						popupservice.show();
        						};
            					if(delay) {
            						$timeout(function(){
            							scope2[controller]();
                		    		}, delay);
            					}
            		        });
            				
            				popupservice.bootstrapped = true;
    						popupservice.show();
        				});
                    });
                });
				
			},
			controller : controller
		};
	}]).directive("emailcheck", ["$q", "$http", function($q, $http){
		return {
			require : "ngModel",
			restrict : "A",
			link : function(scope, elm, attrs, ctrl){
				
				scope.valid = false;
				
				var http;
				
				ctrl.$asyncValidators.emailcheck = function(modelValue, viewValue) {
					scope.valid = false;
					
					if(http!=null)
						http.resolve("cancelled");
					
					var def = $q.defer();
					http = $q.defer();
					
					if(modelValue && modelValue.length>5) {
						$http.post("/check-mail", {email:modelValue}, {timeout: http.promise}).then(function(response){
							if(response.data.valid && response.data.valid==true) {
								scope.valid = true;
								def.resolve("valid");
							}
							else
								def.reject("invalid");
						}, function(){
							def.reject("wrong response");
						});
					}
					
					return def.promise;
				};
				
			}
		};
	}]).directive("matchModel", function(){
		return {
			require : "ngModel",
			restrict : "AC",
			scope : {
				matchModel : "=matchModel"
			},
			link : function(scope, elm, attrs, ctrl){
				ctrl.$validators.matchModel = function(modelValue, viewValue){
					if(viewValue && scope.matchModel != viewValue)
						return false;
					
					return true;
				};
			}
		};
	}).service('recaptcha', ["$http", "$q", "$window", function($http, $q, $window){
		
		var def = $q.defer();
		
		$.getScript("//www.google.com/recaptcha/api.js?onload=recaptchaLoaded&render=explicit");
		
		$window.recaptchaLoaded = function(){
			def.resolve();
		};
		
		return def.promise;
		
	}]).directive('captcha', ["$appSetup", "recaptcha", "$q", "$http", function($app, recaptcha, $q, $http){
		return {
			require : "ngModel",
			link : function(scope, elem, attr, ctrl) {
				
				ctrl.$asyncValidators.captcha = function(){
					var def = $q.defer();
					
					recaptcha.then(function(){
						grecaptcha.render($(elem)[0], {
							sitekey:$app.data.conf.captcha,
							callback:function(response){
								$app.captcha = response;
								$http.defaults.headers.common.captcha = $app.captcha;
								def.resolve("valid");
							},
							'expired-callback':function(){
								document.location.reload();
							}
						});
					}, function(){
						def.resolve("valid");
					});
					
					return def.promise;
				};				
			}
		};
	}]).filter('x', ["$filter", function($filter){
		return function(input, key) {
			return $filter("filter")(input.additionalProperty, {name:key})[0].value;
		}
	}]).filter('compact', function(){
		return function(input){
			if(input==null)
				return [];
			
			if(!input["@context"]) {
				angular.forEach(input, function(v, k){
					angular.forEach(input[k].item.additionalProperty, function(v2, k2){
						input[k].item[v2.name] = v2.value;
					});
					delete input[k].item.additionalProperty;
				});
			}
			else {
				angular.forEach(input.additionalProperty, function(v2, k2){
					input[v2.name] = v2.value;
				});
				delete input.additionalProperty;
			}
			return input;
		};
	});
	
})(window, window.angular, window.jQuery);

window.appApp={version:{full: "1.0.0"}};