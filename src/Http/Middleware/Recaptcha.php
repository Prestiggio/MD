<?php namespace Ry\Md\Http\Middleware;

use Closure, Session, Hash;

class Recaptcha {

	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @return mixed
	 */
	public function handle($request, Closure $next)
	{
		if(Session::has("captcha") && Hash::check($request->header("captcha", "nada"), Session::get("captcha"))) {
			return $next($request);
		}
		
		if($captcha = $request->header("captcha", false)) {
			$ch = curl_init("https://www.google.com/recaptcha/api/siteverify");
			curl_setopt($ch, CURLOPT_POST, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, [
					"secret" => env("captcha_server"),
					"response" => $captcha,
					"remoteip" => $request->getClientIp()
			]);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			$response = curl_exec($ch);
			if(!$response)
				return $next($request);
				
			curl_close($ch);
			$json = json_decode($response);
			if(isset($json->success) && $json->success==true) {
				Session::put("captcha", bcrypt($captcha));
				return $next($request);
			}
		}
		
		return redirect()->back();
	}

}
