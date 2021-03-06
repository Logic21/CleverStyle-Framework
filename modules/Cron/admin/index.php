<?php
/**
 * @package  Cron
 * @category modules
 * @author   Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @license  0BSD
 */
namespace cs;
use
	h,
	cs\Language\Prefix;

$L    = new Prefix('system_admin_');
$Page = Page::instance();
if (isset($_POST['tasks'])) {
	$filename = TEMP.'/'.uniqid('cron', true);
	$tasks    = _trim(explode("\n", trim($_POST['tasks'])));
	$tasks    = implode("\n", $tasks);
	file_put_contents($filename, "$tasks\n");
	exec("crontab $filename", $result, $result);
	unlink($filename);
	if ($result === 0) {
		$Page->success($L->changes_saved);
	} else {
		$Page->warning($L->changes_save_error);
	}
}

$Page->content(
	h::{'cs-form form'}(
		h::{'p.cs-text-center'}(Language::instance()->crontab_content).
		h::{'cs-textarea[autosize][full-width] textarea[name=tasks][rows=10]'}(
			isset($_POST['tasks']) ? $_POST['tasks'] : shell_exec('crontab -l')
		).
		h::{'p cs-button'}(
			h::{'button[type=submit]'}($L->save),
			[
				'tooltip' => $L->save_info
			]
		)
	)
);
