<?php

namespace Ry\Md\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;
use Ry\Md\Console\Commands\Colon;

class RyServiceProvider extends ServiceProvider
{
	/**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
    	parent::boot();
    	/*
    	$this->publishes([    			
    			__DIR__.'/../config/rymd.php' => config_path('rymd.php')
    	], "config");  
    	$this->mergeConfigFrom(
	        	__DIR__.'/../config/rymd.php', 'rymd'
	    );
    	$this->publishes([
    			__DIR__.'/../assets' => public_path('vendor/rymd'),
    	], "public");    	
    	*/
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