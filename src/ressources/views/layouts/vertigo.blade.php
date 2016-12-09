<!DOCTYPE html>
@section("head")
<html lang="{{App::getLocale()}}" ng-app="ngRyMd" ng-strict-di>
    <head>
        @show
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1, user-scalable=yes">
        @section("seo")
        <title>{{ $title or 'Welcome' }}</title>
        <meta name="keywords" content="{{$keywords or 'KeyWords'}}">
        <meta name="description" content="{{ $description or 'Description' }}">   
        <link rel="shortcut icon" href="{{ url("/vendor/rymd/img/favicon.ico")}}" type="image/x-icon">

        <link rel="apple-touch-icon" sizes="57x57" href="{{ url("/vendor/rymd/img/apple-icon-57x57.png") }}">
        <link rel="apple-touch-icon" sizes="60x60" href="{{ url("/vendor/rymd/img/apple-icon-60x60.png") }}">
        <link rel="apple-touch-icon" sizes="72x72" href="{{ url("/vendor/rymd/img/apple-icon-72x72.png") }}">
        <link rel="apple-touch-icon" sizes="76x76" href="{{ url("/vendor/rymd/img/apple-icon-76x76.png") }}">
        <link rel="apple-touch-icon" sizes="114x114" href="{{ url("/vendor/rymd/img/apple-icon-114x114.png") }}">
        <link rel="apple-touch-icon" sizes="120x120" href="{{ url("/vendor/rymd/img/apple-icon-120x120.png") }}">
        <link rel="apple-touch-icon" sizes="144x144" href="{{ url("/vendor/rymd/img/apple-icon-144x144.png") }}">
        <link rel="apple-touch-icon" sizes="152x152" href="{{ url("/vendor/rymd/img/apple-icon-152x152.png") }}">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ url("/vendor/rymd/img/apple-icon-180x180.png") }}">
        <link rel="icon" type="image/png" sizes="192x192"  href="{{ url("/vendor/rymd/img/android-icon-192x192.png") }}">
        <link rel="icon" type="image/png" sizes="32x32" href="{{ url("/vendor/rymd/img/favicon-32x32.png") }}">
        <link rel="icon" type="image/png" sizes="96x96" href="{{ url("/vendor/rymd/img/favicon-96x96.png") }}">
        <link rel="icon" type="image/png" sizes="16x16" href="{{ url("/vendor/rymd/img/favicon-16x16.png") }}">
        <link rel="manifest" href="{{ url("/vendor/rymd/img/manifest.json") }}">
        <meta name="msapplication-TileColor" content="#ffffff">
        <meta name="msapplication-TileImage" content="{{ url("/vendor/rymd/img/ms-icon-144x144.png") }}">
        <meta name="theme-color" content="#ffffff">

        <link rel="icon" href="{{ url("/vendor/rymd/img/favicon.ico")}}" type="image/x-icon">     
        @show
        <link rel="stylesheet" href="{{ url("/vendor/rymd/css/style.min.css") }}">
        <script type="text/javascript" src="{{ url("/vendor/rymd/js/script.min.js") }}"></script>        
        <script type="text/javascript" src="{{ url("/vendor/rymd/js/ngRyRoute.js") }}"></script>
		<script type="text/javascript" src="{{ url("/vendor/rymd/js/ngRySchema.js") }}"></script>
		<script type="text/javascript" src="{{ url("/vendor/rymd/js/ngRyMd.js") }}"></script>
        <script type="text/javascript" src="{{ url("/hotspot/mtaftsart/js/script.js") }}"></script>
        @yield("angular")
        <meta name="generator" content="{{url("")}}" />
        <link rel='canonical' href="{{url("")}}" />
        <link rel='shortlink' href="{{url("")}}" />
        <style type="text/css">
            .ng-cloak {
                display : none !important;
            }
        </style>
    </head>
    <body>
    @yield("content")	
    @yield("scripts")
    </body>
</html>
