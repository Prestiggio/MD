<?php
namespace Ry\Md\Models;

use Illuminate\Support\Facades\Log;

class Search
{
	private $pools = [];
	
	public function setup($domain, $entities) {
		$this->pools[$domain] = $entities;
	}
	
	public function search($pool, $q, $selections=["id"]) {
		if(!isset($this->pools[$pool])) {
			return [];
		}
		
		if(strlen($q)<2)
			return [];
		
		$results = [];
		$entities = $this->pools[$pool];
		$q = preg_replace(["/n[\s\n\t]*'[\s\n\t]*ny?/i", "/[\s\t'-\.,:\/]/i"], " ", trim($q));
		$ar = preg_split("/[\t\s]+/i", $q);
		$ar = array_filter($ar, function($item){
			return strlen($item)>2;
		});
		foreach($entities as $c => $fields) {
			if(count($fields)>0) {
				$results[] = call_user_func([$c, "where"], function($query) use ($ar, $fields){
					foreach ($ar as $a) {
						foreach($fields as $f) {
							$query->orWhereRaw("soundex_match_all(?, ".$f.", ' ') > 0", [strtoupper($a)]);
							$query->orWhereRaw("soundex_match_all(?, ".$f.", '-') > 0", [strtoupper($a)]);
							$query->orWhereRaw("soundex_match_all(?, ".$f.", ',') > 0", [strtoupper($a)]);
							$query->orWhereRaw("soundex_match_all(?, ".$f.", '\'') > 0", [strtoupper($a)]);
							$query->orWhereRaw("soundex_match_all(?, ".$f.", '\"') > 0", [strtoupper($a)]);
							$query->orWhereRaw("soundex_match_all(?, ".$f.", '.') > 0", [strtoupper($a)]);
							$query->orWhereRaw("soundex_match_all(?, ".$f.", ';') > 0", [strtoupper($a)]);
							$query->orWhereRaw("soundex_match_all(?, ".$f.", '+') > 0", [strtoupper($a)]);
							$query->orWhereRaw("soundex_match_all(?, ".$f.", ':') > 0", [strtoupper($a)]);
							$query->orWhereRaw("soundex_match_all(?, ".$f.", '/') > 0", [strtoupper($a)]);
						}
					}
				})->orderBy("id", "DESC")->select($selections)->get();
				/*
				Log::info(call_user_func([$c, "where"], function($query) use ($ar, $fields){
					foreach ($ar as $a) {
						foreach($fields as $f)
							$query->orWhereRaw("soundex_match_all(?, ".$f.", ' ') > 0", [$a]);
					}
				})->orderBy("id", "DESC")->toSql());
				*/
			}
		}
		return $results;
	}
}