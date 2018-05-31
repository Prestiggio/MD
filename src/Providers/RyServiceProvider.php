<?php

namespace Ry\Md\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;
use Ry\Md\Console\Commands\Colon;
use Illuminate\Support\Facades\View;
use Ry\Md\Models\Search;

class RyServiceProvider extends ServiceProvider
{
	/**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
    	/*
    	$this->publishes([    			
    			__DIR__.'/../config/rymd.php' => config_path('rymd.php')
    	], "config");  
    	$this->mergeConfigFrom(
	        	__DIR__.'/../config/rymd.php', 'rymd'
	    );
	    */
    	$this->publishes([
    			__DIR__.'/../assets/templates' => public_path('vendor/rymd'),
    	], "templates");
    	//ressources
    	$this->loadViewsFrom(__DIR__.'/../ressources/views', 'rymd');
    	$this->loadTranslationsFrom(__DIR__.'/../ressources/lang', 'rymd');
    	/*
    	$this->publishes([
    			__DIR__.'/../ressources/views' => resource_path('views/vendor/rymd'),
    			__DIR__.'/../ressources/lang' => resource_path('lang/vendor/rymd'),
    	], "ressources");
    	*/
    	$this->publishes([
    			__DIR__.'/../database/factories/' => database_path('factories'),
	        	__DIR__.'/../database/migrations/' => database_path('migrations')
	    ], 'migrations');
    	$this->map();
    	//$kernel = $this->app['Illuminate\Contracts\Http\Kernel'];
    	//$kernel->pushMiddleware('Ry\Facebook\Http\Middleware\Facebook');
    	
    	$this->app['router']->middleware('recaptcha', '\Ry\Md\Http\Middleware\Recaptcha');
    	
		View::share("js", json_encode(["app" => "blank", "captcha" => env("captcha")]));
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
    	$this->app->singleton("rymd:colonize", function(){
    		return new Colon();
    	});
    	$this->app->singleton("rymd.search", function(){
    		return new Search();
    	});
    	$this->commands(["rymd:colonize"]);
    }
    public function map()
    {    	
    	if (! $this->app->routesAreCached()) {
    		$this->app['router']->group(['namespace' => 'Ry\Md\Http\Controllers'], function(){
    			require __DIR__.'/../Http/routes.php';
    		});
    	}
    }
}