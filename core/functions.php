<?php
/**
 * @package   CleverStyle Framework
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2011-2016, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
/**
 * Base system functions, do not edit this file, or make it very carefully
 * otherwise system workability may be broken
 */
use
	cs\Cache,
	cs\Config,
	cs\HTMLPurifier_Filter_iframe_sandbox,
	cs\Language,
	cs\Page;

/**
 * @param string $file
 *
 * @return array
 */
function __classes_get_from_cache ($file) {
	return defined('CACHE') && file_exists(CACHE."/classes/$file") ? file_get_json(CACHE."/classes/$file") : [];
}

/**
 * @param string $file
 * @param array  $content
 */
function __classes_put_into_cache ($file, $content) {
	if (defined('CACHE') && is_dir(CACHE)) {
		/** @noinspection MkdirRaceConditionInspection */
		@mkdir(CACHE.'/classes', 0770);
		file_put_json(CACHE."/classes/$file", $content);
	}
}

/**
 * Clean cache of classes autoload and customization
 */
function __classes_clean_cache () {
	@unlink(CACHE.'/classes/autoload');
	@unlink(CACHE.'/classes/aliases');
	@unlink(CACHE.'/classes/modified');
}

/**
 * Auto Loading of classes
 */
spl_autoload_register(
	function ($class) {
		static $cache, $aliases;
		if (!isset($cache)) {
			$cache   = __classes_get_from_cache('autoload');
			$aliases = __classes_get_from_cache('aliases');
		}
		if (isset($aliases[$class])) {
			spl_autoload_call($aliases[$class]);
			return class_exists($class, false) || (class_exists($aliases[$class], false) && class_alias($aliases[$class], $class));
		}
		if (isset($cache[$class])) {
			if ($cache[$class]) {
				require $cache[$class];
			}
			return (bool)$cache[$class];
		}
		$prepared_class_name = ltrim($class, '\\');
		if (strpos($prepared_class_name, 'cs\\') === 0) {
			$prepared_class_name = substr($prepared_class_name, 3);
		}
		$prepared_class_name = explode('\\', $prepared_class_name);
		$namespace           = count($prepared_class_name) > 1 ? implode('/', array_slice($prepared_class_name, 0, -1)) : '';
		$class_name          = array_pop($prepared_class_name);
		$cache[$class]       = false;
		/**
		 * Try to load classes from different places. If not found in one place - try in another.
		 */
		if (
			file_exists($file = CORE."/classes/$namespace/$class_name.php") ||    //Core classes
			file_exists($file = CORE."/thirdparty/$namespace/$class_name.php") || //Third party classes
			file_exists($file = CORE."/traits/$namespace/$class_name.php") ||     //Core traits
			file_exists($file = CORE."/drivers/$namespace/$class_name.php") ||    //Core drivers
			file_exists($file = MODULES."/../$namespace/$class_name.php")         //Classes in modules
		) {
			$cache[$class] = realpath($file);
			__classes_put_into_cache('autoload', $cache);
			require $file;
			return true;
		}
		__classes_put_into_cache('autoload', $cache);
		// Processing components aliases
		if (strpos($namespace, 'modules') === 0) {
			$Config      = Config::instance();
			$directories = [];
			foreach ($Config->components['modules'] ?: [] as $module_name => $module_data) {
				if ($module_data['active'] == Config\Module_Properties::UNINSTALLED) {
					continue;
				}
				$directories[] = MODULES."/$module_name";
			}
			$class_exploded = explode('\\', $class);
			foreach ($directories as $directory) {
				if (file_exists("$directory/meta.json")) {
					$meta = file_get_json("$directory/meta.json") + ['provide' => []];
					if ($class_exploded[2] != $meta['package'] && in_array($class_exploded[2], (array)$meta['provide'])) {
						$class_exploded[2] = $meta['package'];
						$alias             = implode('\\', $class_exploded);
						$aliases[$class]   = $alias;
						__classes_put_into_cache('aliases', $aliases);
						spl_autoload_call($alias);
						return class_exists($class, false) || (class_exists($alias, false) && class_alias($alias, $class));
					}
				}
			}
		}
		return false;
	}
);

/**
 * Get or set modified classes (used in Singleton trait)
 *
 * @param array|null $updated_modified_classes
 *
 * @return array
 */
function modified_classes ($updated_modified_classes = null) {
	static $modified_classes;
	if (!isset($modified_classes)) {
		$modified_classes = __classes_get_from_cache('modified');
	}
	if ($updated_modified_classes) {
		$modified_classes = $updated_modified_classes;
		__classes_put_into_cache('modified', $modified_classes);
	}
	return $modified_classes;
}

/**
 * Easy getting of translations
 *
 * @param string  $item
 * @param mixed[] $arguments There can be any necessary number of arguments here
 *
 * @return string
 */
function __ ($item, ...$arguments) {
	$L = Language::instance();
	if (func_num_args() > 1) {
		return $L->format($item, ...$arguments);
	} else {
		return $L->$item;
	}
}

/**
 * Public cache cleaning
 *
 * @return bool
 */
function clean_pcache () {
	$ok   = true;
	$list = get_files_list(PUBLIC_CACHE, false, 'fd', true, true, 'name|desc');
	foreach ($list as $item) {
		if (is_writable($item)) {
			is_dir($item) ? @rmdir_recursive($item) : @unlink($item);
		} else {
			$ok = false;
		}
	}
	return $ok;
}

/**
 * Formatting of time in seconds to human-readable form
 *
 * @param int $time Time in seconds
 *
 * @return string
 */
function format_time ($time) {
	if (!is_numeric($time)) {
		return $time;
	}
	$L     = Language::instance();
	$res   = [];
	$units = [
		60 * 60 * 24 * 30 * 365 => 'y',
		60 * 60 * 24 * 30       => 'M',
		60 * 60 * 24            => 'd',
		60 * 60                 => 'h',
		60                      => 'm',
		1                       => 's'
	];
	foreach ($units as $time_frame => $key) {
		if ($time >= $time_frame) {
			$time_full = floor($time / $time_frame);
			$time -= $time_full * $time_frame;
			$res[] = $L->time($time_full, $key);
		}
	}
	return implode(' ', $res);
}

/**
 * Formatting of data size in bytes to human-readable form
 *
 * @param int       $size
 * @param false|int $round
 *
 * @return string
 */
function format_filesize ($size, $round = false) {
	if (!is_numeric($size)) {
		return $size;
	}
	$L     = Language::prefix('system_filesize_');
	$units = [
		1024 * 1024 * 1024 * 1024 => $L->TiB,
		1024 * 1024 * 1024        => $L->GiB,
		1024 * 1024               => $L->MiB,
		1024                      => $L->KiB,
		0                         => $L->Bytes
	];
	foreach ($units as $size_frame => $unit) {
		if ($size >= $size_frame) {
			$size /= $size_frame;
			if ($round) {
				$size = round($size, $round);
			}
			return "$size $unit";
		}
	}
}

/**
 * Get list of timezones
 *
 * @return array
 */
function get_timezones_list () {
	$timezones = [];
	foreach (timezone_identifiers_list() as $timezone) {
		$offset          = (new DateTimeZone($timezone))->getOffset(new DateTime);
		$key             = (39600 + $offset).$timezone;
		$sign            = ($offset < 0 ? '-' : '+');
		$hours           = str_pad(floor(abs($offset / 3600)), 2, 0, STR_PAD_LEFT);
		$minutes         = str_pad(abs(($offset % 3600) / 60), 2, 0, STR_PAD_LEFT);
		$timezones[$key] = [
			'key'   => str_replace('_', ' ', $timezone)." ($sign$hours:$minutes)",
			'value' => $timezone
		];
	}
	ksort($timezones, SORT_NATURAL);
	return array_column($timezones, 'value', 'key');
}

/**
 * String representation of HTTP status code
 *
 * @param int $code
 *
 * @return null|string
 */
function status_code_string ($code) {
	$code_to_string = [
		201 => '201 Created',
		202 => '202 Accepted',
		301 => '301 Moved Permanently',
		302 => '302 Found',
		303 => '303 See Other',
		307 => '307 Temporary Redirect',
		400 => '400 Bad Request',
		403 => '403 Forbidden',
		404 => '404 Not Found',
		405 => '405 Method Not Allowed',
		409 => '409 Conflict',
		429 => '429 Too Many Requests',
		500 => '500 Internal Server Error',
		501 => '501 Not Implemented',
		503 => '503 Service Unavailable'
	];
	return @$code_to_string[$code];
}

/**
 * Pages navigation based on links
 *
 * @param int             $page       Current page
 * @param int             $total      Total pages number
 * @param callable|string $url        if string - it will be formatted with sprintf with one parameter - page number<br>
 *                                    if callable - one parameter will be given, callable should return url string
 * @param bool            $head_links If <b>true</b> - links with rel="prev" and rel="next" will be added
 *
 * @return bool|string <b>false</b> if single page, otherwise string, set of navigation links
 */
function pages ($page, $total, $url, $head_links = false) {
	if ($total == 1) {
		return false;
	}
	$Page             = Page::instance();
	$original_url     = $url;
	$base_url         = Config::instance()->base_url();
	$url              = function ($page) use ($original_url, $base_url) {
		$href = is_callable($original_url) ? $original_url($page) : sprintf($original_url, $page);
		if (is_string($href) && strpos($href, 'http') !== 0) {
			$href = ltrim($href, '/');
			$href = "$base_url/$href";
		}
		return $href;
	};
	$output           = [];
	$render_page_item = function ($i) use ($Page, $page, $url, $head_links, &$output) {
		$href = $url($i);
		if ($head_links) {
			switch ($i) {
				case $page - 1:
					$Page->link(['href' => $href, 'rel' => 'prev']);
					break;
				case $page + 1:
					$Page->link(['href' => $href, 'rel' => 'next']);
					break;
				case $page:
					$Page->canonical_url($href);
					break;
			}
		}
		$output[] = [
			$i,
			[
				'href'    => $i == $page ? false : $href,
				'is'      => 'cs-link-button',
				'primary' => $i == $page
			]
		];
	};
	if ($total <= 11) {
		array_map($render_page_item, range(1, $total));
	} else {
		if ($page <= 6) {
			array_map($render_page_item, range(1, 7));
			$output[] = [
				'...',
				[
					'disabled' => true
				]
			];
			array_map($render_page_item, range($total - 2, $total));
		} elseif ($page >= $total - 5) {
			array_map($render_page_item, range(1, 3));
			$output[] = [
				'...',
				[
					'disabled' => true
				]
			];
			array_map($render_page_item, range($total - 6, $total));
		} else {
			array_map($render_page_item, range(1, 2));
			$output[] = [
				'...',
				[
					'disabled' => true
				]
			];
			array_map($render_page_item, range($page - 2, $page + 2));
			$output[] = [
				'...',
				[
					'disabled' => true
				]
			];
			array_map($render_page_item, range($total - 1, $total));
		}
	}
	return h::{'a[is=cs-link-button]'}($output);
}

/**
 * Pages navigation based on buttons (for search forms, etc.)
 *
 * @param int                  $page  Current page
 * @param int                  $total Total pages number
 * @param bool|callable|string $url   Adds <i>formaction</i> parameter to every button<br>
 *                                    if <b>false</b> - only form parameter <i>page</i> will we added<br>
 *                                    if string - it will be formatted with sprintf with one parameter - page number<br>
 *                                    if callable - one parameter will be given, callable should return url string
 *
 * @return false|string                        <b>false</b> if single page, otherwise string, set of navigation buttons
 */
function pages_buttons ($page, $total, $url = false) {
	if ($total == 1) {
		return false;
	}
	if (!is_callable($url)) {
		$original_url = $url;
		$url          = function ($page) use ($original_url) {
			return sprintf($original_url, $page);
		};
	}
	$output           = [];
	$render_page_item = function ($i) use ($page, $url, &$output) {
		$output[] = [
			$i,
			[
				'formaction' => $i == $page || $url === false ? false : $url($i),
				'value'      => $i == $page ? false : $i,
				'type'       => $i == $page ? 'button' : 'submit',
				'primary'    => $i == $page
			]
		];
	};
	if ($total <= 11) {
		array_map($render_page_item, range(1, $total));
	} else {
		if ($page <= 6) {
			array_map($render_page_item, range(1, 7));
			$output[] = [
				'...',
				[
					'type' => 'button',
					'disabled'
				]
			];
			array_map($render_page_item, range($total - 2, $total));
		} elseif ($page >= $total - 5) {
			array_map($render_page_item, range(1, 3));
			$output[] = [
				'...',
				[
					'type' => 'button',
					'disabled'
				]
			];
			array_map($render_page_item, range($total - 6, $total));
		} else {
			array_map($render_page_item, range(1, 2));
			$output[] = [
				'...',
				[
					'type' => 'button',
					'disabled'
				]
			];
			array_map($render_page_item, range($page - 2, $page + 2));
			$output[] = [
				'...',
				[
					'type' => 'button',
					'disabled'
				]
			];
			array_map($render_page_item, range($total - 1, $total));
		}
	}
	return h::{'button[is=cs-button][name=page]'}($output);
}

/**
 * Checks whether specified functionality available or not
 *
 * @param string|string[] $functionality One functionality or array of them
 *
 * @return bool `true` if all functionality available, `false` otherwise
 */
function functionality ($functionality) {
	if (is_array($functionality)) {
		$result = true;
		foreach ($functionality as $f) {
			$result = $result && functionality($f);
		}
		return $result;
	}
	$all = Cache::instance()->get(
		'functionality',
		function () {
			$functionality = [];
			$Config        = Config::instance();
			foreach (array_keys($Config->components['modules']) as $module) {
				if (!$Config->module($module)->enabled() || !file_exists(MODULES."/$module/meta.json")) {
					continue;
				}
				$functionality[] = [$module];
				$meta            = file_get_json(MODULES."/$module/meta.json");
				if (isset($meta['provide'])) {
					$functionality[] = (array)$meta['provide'];
				}
			}
			return array_merge(...$functionality);
		}
	);
	return in_array($functionality, $all);
}

/**
 * XSS Attack Protection. Returns secure string using several types of filters
 *
 * @param string|string[] $in     HTML code
 * @param bool|string     $html   <b>text</b> - text at output (default)<br>
 *                                <b>true</b> - processed HTML at output<br>
 *                                <b>false</b> - HTML tags will be deleted
 * @param bool            $iframe Whether to allow iframes without inner content (for example, video from youtube)<br>
 *                                Works only if <i>$html === true</i>
 *
 * @return string|string[]
 */
function xap ($in, $html = 'text', $iframe = false) {
	static $purifier, $purifier_iframe, $purifier_no_tags;
	if (is_array($in)) {
		foreach ($in as &$item) {
			$item = xap($item, $html, $iframe);
		}
		return $in;
	}
	/**
	 * Text mode
	 */
	if ($html === 'text') {
		return htmlspecialchars($in, ENT_NOQUOTES | ENT_HTML5 | ENT_DISALLOWED | ENT_SUBSTITUTE | ENT_HTML5);
	}
	if (!isset($purifier)) {
		$config_array = [
			'HTML.Doctype'         => 'HTML 4.01 Transitional',
			'Attr.EnableID'        => true,
			'Attr.ID.HTML5'        => true,
			'Attr.IDPrefix'        => 'content-',
			'CSS.MaxImgLength'     => null,
			'Cache.DefinitionImpl' => null,
			'Output.Newline'       => "\n",
			'URI.Munge'            => 'redirect/%s'
		];

		$config = HTMLPurifier_Config::createDefault();
		$config->loadArray($config_array);
		$purifier = new HTMLPurifier($config_array);

		$config_no_tags = HTMLPurifier_Config::createDefault();
		$config_no_tags->loadArray($config_array);
		$config_no_tags->set('HTML.AllowedElements', []);
		$purifier_no_tags = new HTMLPurifier($config_no_tags);

		$config_iframe = HTMLPurifier_Config::createDefault();
		$config_iframe->loadArray($config_array);
		$config_iframe->set('Filter.Custom', [new HTMLPurifier_Filter_iframe_sandbox]);
		$purifier_iframe = new HTMLPurifier($config_iframe);
	}
	if ($html === false) {
		return $purifier_no_tags->purify($in);
	}
	if ($iframe) {
		return $purifier_iframe->purify($in);
	} else {
		return $purifier->purify($in);
	}
}

/**
 * @param string $class
 *
 * @return bool
 */
function __htmlpurifier_autoload ($class) {
	$class = ltrim($class, '\\');
	if (strpos($class, 'HTMLPurifier_') === 0) {
		spl_autoload_unregister('__htmlpurifier_autoload');
		Phar::loadPhar(__DIR__.'/thirdparty/htmlpurifier.tar.gz', 'htmlpurifier.phar');
		require_once 'phar://htmlpurifier.phar/HTMLPurifier.standalone.php';
		return true;
	}
}

spl_autoload_register('__htmlpurifier_autoload', true, true);
