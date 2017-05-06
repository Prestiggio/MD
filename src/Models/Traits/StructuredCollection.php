<?php
namespace Ry\Md\Models\Traits;

trait StructuredCollection
{	

	public function jsonSerialize()
	{
		$ar = [
				"@context" => "http://schema.org",
				"@type" => "ItemList",
				"itemListElement" => parent::jsonSerialize(),
				"itemListOrder" => "http://schema.org/ItemListOrderDescending",
				"numberOfItems" => $this->count(),
				"name" => str_replace(":n", $this->count(), $this->name)
				];
		return $ar;
	}
	
}
