<?php
/**
 * @package		Disqus
 * @category	modules
 * @author		Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright	Copyright (c) 2011-2014, Nazar Mokrynskyi
 * @license		MIT License, see license.txt
 */
namespace	cs;
if (isset($_POST['shortname'])) {
	Config::instance()->module('Disqus')->shortname	= $_POST['shortname'];
	Index::instance()->save(true);
}
