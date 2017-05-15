(function(window, angular, $, undefined){
	
	var AppService = function(data, template){
		var injections = ["$scope", "$mdDialog", "$http", "$timeout", "$appSetup", "$routeParams", "$location", "$compile", 
			              "$interval", "$mdSidenav", "$log", "$interpolate", "$localStorage", "$sessionStorage", "$filter", "FileUploader",
			              ];
		this.urls = {
			upload : "/upload.php"
		};
		this.storage = 1; //local 2-session
		this.template = template;
		this.data = data;
		if(this.data.conf.urls && this.data.conf.urls.upload)
			this.urls.upload = this.data.conf.urls.upload;
		this.popup = false;
		this.menuitems = [];
		this.dialogs = [];
		this.queueDialog = function(dialogOptions){
			this.dialogs.push(dialogOptions);
		};
		this.upload = {
			onDone : function(item, response){},
			onQueue : function(item){},
			onCancel : function(item){}
		};
		this.setUploadEndpoint = function(url){
			this.uploader.url = url;
		};
		this.setUploadAuto = function(auto){
			this.uploader.autoUpload = auto;
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
		}
		this.initUploader = function(uploader){
			if(!this.uploader) {
				var app = this;
				this.uploader = new uploader({
					url : this.urls.upload,
					headers : {
						"X-CSRF-TOKEN" : $('meta[name="csrf-token"]').attr('content')
					},
					alias: "file",
					removeAfterUpload: false,
					filters: [{
						name : "allmedias",
						fn : function(item){
							return item.type.startsWith("image/") || item.type.startsWith("video/");
						}
					}]
				});
			}
		};
	};
	
	angular.module("ngApp", ["ngMaterial", "ngRoute", "ngSanitize", "ngMessages", "ngStorage", "angularFileUpload"])
	.provider("$appSetup", ["$mdThemingProvider", "$routeProvider", "$locationProvider", function $appSetupProvider($mdThemingProvider, $routeProvider, $locationProvider){

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

		this.$get = function(){
			var app = new AppService(this.data, this.templates);
			
			$("script[type='application/dialog']").each(function(){
				var isModal = $(this).data("modal");
				var href = $(this).data("href");
				var controller = function($scope, $mdDialog, $http, $timeout, $app, $routeParams, $location, $compile, 
	          		  $interval, $localStorage, $sessionStorage, $filter, FileUploader){
		        	$app.initUploader(FileUploader);
		        	$scope.uploader = $app.uploader;
		        	$http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
		        	$http.defaults.headers.common["X-CSRF-TOKEN"] = $('meta[name="csrf-token"]').attr('content');
		        	try {
		        		if($app.storage==1)
							$scope.$storage = $localStorage;
						else
							$scope.$storage = $sessionStorage;
		        		main.apply(window, $app.remap(arguments, main));
		        	}
		        	catch(e) {
		        		console.log("implement main($scope, $mdDialog, $http, $timeout, $app, $routeParams, $location, $compile, $interval);", e);
		        	}
		        	
		        };
		        controller.$inject = app.reinject(main);
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
						    	template: '<md-dialog ng-view style="overflow: visible; " md-theme="default" class="popupview"></md-dialog>',
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
		
	}]).factory("popupservice", ["$mdDialog", "$appSetup", "$q", function($mdDialog, $app, $q){
		
		var gu = function(){
			
			var dis = this;
			this.displaying = false;
			this.bootstrapped = false;
			
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
		
	}]).directive("body", ["$route", "$templateRequest", "$compile", "$appSetup", "$timeout", "$mdDialog", "popupservice", function($route, $templateRequest, $compile, $app, $timeout, $mdDialog, popupservice){
		var controller = function($scope, $mdDialog, $http, $timeout, $app, $routeParams, $location, $compile, 
      		  $interval, $mdSidenav, $log, $interpolate, $localStorage, $sessionStorage, $filter, FileUploader){
			
			$app.initUploader(FileUploader);
			$scope.uploader = $app.uploader;
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
				main.apply(window, $app.remap(arguments, main));
			}
			catch(e){
				console.log("implement main($scope, $mdDialog, $http, $timeout, $app, $routeParams, $location, $compile, $interval)", e);
			}	
		};
		controller.$inject = $app.reinject(main);
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
        					var item = {
        							name : $(a).html(),
        							title : $(a).prop("title"),
        							href : $(a).prop("href")
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

        				var toplogo = $("header a:first").clone();
        				toplogo.removeClass("hide-xs");
        				$("md-sidenav").prepend(toplogo);
        				
        				for(var k in $app.data) {
        					if(k=="conf")
        						continue;
        					
        					var kscope = k.match(/(\w+)\.?\w*$/)[1];
        					scope2[kscope] = $app.data[k];
        					
        					if($("#"+k).prop("src")!=null) {
        						$templateRequest($("#"+k).prop("src")).then(function (data) {
                                    var template = angular.element(data);
                                    $("#"+k).replaceWith(template);
                                    $compile(template)(scope2);
                                });
        					}
        				}
        				
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
				
			},
			controller : controller
		};
	}]).directive("validateCode", ["$q", "$http", function($q, $http){
		return {
			require : 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				
				ctrl.$validators.validateCode = function(modelValue, viewValue){
					if(viewValue && viewValue.length>4 && viewValue.length<=10)
						return true;

					return false;
				};

			}
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
	}]).directive("confirmed", function(){
		return {
			require : "ngModel",
			restrict : "AC",
			link : function(scope, elm, attrs, ctrl){
				ctrl.$validators.confirmed = function(modelValue, viewValue){
					if(viewValue && scope.user.password != viewValue)
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
	}]).directive('ngThumb', function(){
		return {
			restrict: 'A',
            link: function(scope, element, attributes) {
            	var fileItem = scope.$eval(attributes.ngThumb);
            	
            	var reader = new FileReader();
				
				reader.onloadstart = reader.onprogress = function(){
					$(element).attr("src", "/vendor/rymd/img/ring.svg");			
				};
				
				reader.onload = function(e) {
					$(element).attr("src", e.target.result);
				};
				
				reader.readAsDataURL(fileItem._file);
            }
		};
	}).filter('x', ["$filter", function($filter){
		return function(input, key) {
			return $filter("filter")(input.item.additionalProperty, {name:key})[0].value;
		}
	}]).filter('pagination', ["$appSetup", function($app){
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
			
			for(var i=begin; i<=end; i++) {
				input.push(i);
			}
			return input;
		}
	}]).filter('compact', ["FileItem", function(FileItem){
		return function(input, upload){
			angular.forEach(input, function(v, k){
				angular.forEach(input[k].item.additionalProperty, function(v2, k2){
					input[k].item[v2.name] = v2.value;
				});
				delete input[k].item.additionalProperty;
				if(upload) {
					input[k].item.uploader = {
						formData : [input[k].item]
					};
				}
			});
			return input;
		};
	}]);
	
})(window, window.angular, window.jQuery);

window.appApp={version:{full: "1.0.0"}};