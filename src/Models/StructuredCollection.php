<?php
namespace Ry\Md\Models;

use Illuminate\Support\Collection;
use Ry\Md\Models\Traits\StructuredCollection as StructuredCollectionTrait;
class StructuredCollection extends Collection
{
	use StructuredCollectionTrait;
	
	private $name;
	
	public function __construct($items = array(), $name=":n products", $structured = false) {
		parent::__construct($items);
		$this->name = $name;
		$i = 1;
		foreach($this->items as $item) {
			$item->init();
			$item->position = $i;
			$item->inCollection = true;
			$item->structured = $structured;
			$i++;
		}
	}
}