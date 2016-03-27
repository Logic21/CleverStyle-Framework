<?php
/**
 * @package   HybridAuth
 * @category  modules
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2012-2016, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
namespace cs\modules\HybridAuth;
use
	cs\Config,
	cs\DB,
	cs\Event,
	cs\Language\Prefix,
	cs\Request,
	cs\Response,
	cs\Page;

Event::instance()
	->on(
		'System/Page/render/before',
		function () {
			$Config        = Config::instance();
			$L             = new Prefix('hybridauth_');
			$icons_mapping = function ($provider) {
				switch ($provider) {
					case 'Google':
						return 'google-plus';
					case 'Vkontakte':
						return 'vk';
					default:
						return strtolower($provider);
				}
			};
			$providers     = [];
			foreach ($Config->module('HybridAuth')->providers as $provider => $provider_settings) {
				if ($provider_settings['enabled']) {
					$providers[$provider] = [
						'name' => $L->$provider,
						'icon' => $icons_mapping($provider)
					];
				}
			}
			if ($providers) {
				Page::instance()->config($providers, 'cs.hybridauth.providers');
			}
		}
	)
	->on(
		'System/User/registration/confirmation/after',
		function () {
			$redirect_to = Request::instance()->cookie('HybridAuth_referer');
			if ($redirect_to) {
				$Response = Response::instance();
				$Response->header('refresh', "5; url=$redirect_to");
				$Response->cookie('HybridAuth_referer', '');
			}
		}
	)
	->on(
		'System/User/del/after',
		function ($data) {
			/**
			 * @var \cs\DB\_Abstract $cdb
			 */
			$cdb = DB::instance()->{Config::instance()->module('HybridAuth')->db('integration')}();
			$cdb->q(
				[
					"DELETE FROM `[prefix]users_social_integration`
					WHERE `id` = '%s'",
					"DELETE FROM `[prefix]users_social_integration_contacts`
					WHERE `id` = '%s'"
				],
				$data['id']
			);
		}
	)->on(
		'System/User/get_contacts',
		function ($data) {
			$data['contacts'] = array_unique(
				array_merge(
					$data['contacts'],
					Social_integration::instance()->get_contacts($data['id'])
				)
			);
		}
	);
