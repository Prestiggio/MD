<?php
namespace Ry\Md;

use Illuminate\Http\Request;
use Session, Hash;

class Recaptcha
{
	public static function check(Request $request) {
		if(Session::has("captcha") && Hash::check($request->header("captcha", "nada"), Session::get("captcha"))) {
			return true;
		}
		
		$captcha = $request->header("captcha", false);
		
		if($captcha) {
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
				return true;
		
			curl_close($ch);
			$json = json_decode($response);
			if(isset($json->success) && $json->success==true) {
				Session::put("captcha", bcrypt($captcha));
				return true;
			}
		}
		
		abort(403);
	}
}