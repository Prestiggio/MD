<?php
namespace Ry\Md\Models\Traits;

use Ry\Md\Models\StructuredCollection;

trait StructuredData
{
	private $collectionName;
	
	public $position = 0;
	
	public $inCollection = false;
	
	public $structured = false;
	
	private $initialized = false;
	
	public function showAdditionals() {
		return false;
	}
	
	private $map = [			
			"name" => "name", //string
			"url" => "url",
			"image" => "image", //string
			"award" => "award", //string
			"brand" => "brand", //structured brand
	];
	
	private function getStructuredData($key) {
		return $this->map[$key];
	}
	
	public function structuredType() {
		return "Product";
	}
	
	public function structuredSchema() {
		return [];
	}
	
	public function isDefaultStructured() {
		return true;
	}
	
	public function init() {
		if(!$this->initialized) {
			$this->structured = $this->isDefaultStructured();
			$this->initialized = true;
		}
	}
	
	public function listItemFormattable() {
		return true;
	}
	
	public function toArray() {
		$this->init();
		
		if(!$this->structured)
			return parent::toArray();
		
		$ar = [];
		$item = [];
		if(!$this->inCollection)
			$item["@context"] = "http://schema.org";
		$item["@type"] = $this->structuredType();
		
		$schema = $this->structuredSchema();
		if(empty($schema)) {
			$item["productID"] = $this->getAttribute($this->primaryKey);
			foreach($this->map as $k => $v) {
				$attr = $this->getAttribute($v);
				if($attr!=null)
					$item[$k] = $attr;
			}
		}
		else {
			$item = array_merge($item, $schema);
		}
		
		if($this->showAdditionals()) {
			$ps = parent::toArray();
			$item["additionalProperty"] = [];
			foreach($ps as $k => $v) {
				$item["additionalProperty"][] = [
						"@type" => "PropertyValue",
						"name" => $k,
						"value" => $v
				];
			}
		}
		
		if($this->inCollection && $this->listItemFormattable()) {
			$ar = [
				"@type" => "ListItem",
				"position" => $this->position,
				"item" => $item
			];
		}
		else {
			$ar = $item;
		}
		return $ar;
	}
	
	public function newCollection(array $models = array())
	{
		$this->init();
		
		if($this->collectionName=="")
			$this->collectionName = ":n " . $this->table;
		
		if(!$this->structured)
			return parent::newCollection($models);
		
		return new StructuredCollection($models, $this->collectionName, $this->structured);
	}
	
	public function setCollectionName($title) {
		$this->init();
		
		$this->collectionName = $title;
	}
	

	public function setStructured($structured=true) {
		$this->init();
	
		$this->structured = $structured;
	}
	
	
}