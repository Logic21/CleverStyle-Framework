<?php
/**
 * @package   Fotorama
 * @category  plugins
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2016, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
namespace cs;
use
	h;

Page::instance()->Head .= h::{'link[rel=stylesheet][shim-shadowdom]'}(['href' => 'components/plugins/Fotorama/includes/css/style.css']);
