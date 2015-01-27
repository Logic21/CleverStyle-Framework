CREATE TABLE IF NOT EXISTS `[prefix]config` (
  `domain` varchar(255) NOT NULL,
  `core` mediumtext NOT NULL,
  `db` mediumtext NOT NULL,
  `storage` mediumtext NOT NULL,
  `components` mediumtext NOT NULL,
  `replace` mediumtext NOT NULL,
  `routing` mediumtext NOT NULL,
  PRIMARY KEY (`domain`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Settings';

CREATE TABLE IF NOT EXISTS `[prefix]groups` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT 'WARNING: Never delete first 3 groups!',
  `title` varchar(1024) NOT NULL,
  `description` text NOT NULL,
  `data` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO `[prefix]groups` (`title`, `description`) VALUES ('Administrators', 'Administrators'), ('Users', 'Users'), ('Bots', 'Bots');

CREATE TABLE IF NOT EXISTS `[prefix]groups_permissions` (
  `id` smallint(5) unsigned NOT NULL COMMENT 'Group id',
  `permission` smallint(5) unsigned NOT NULL COMMENT 'Permission id',
  `value` tinyint(1) unsigned NOT NULL,
  KEY `id` (`id`),
  KEY `permission` (`permission`,`value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `[prefix]groups_permissions` (`id`, `permission`, `value`) VALUES (1, 2, 1), (2, 2, 0), (3, 2, 0);

CREATE TABLE IF NOT EXISTS `[prefix]keys` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `key` varbinary(56) NOT NULL COMMENT 'Key may be generated by sha224 algorithm',
  `expire` bigint(20) unsigned NOT NULL DEFAULT '0',
  `data` mediumtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `key` (`key`(32)),
  KEY `expire` (`expire`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='Temporary keys';

CREATE TABLE IF NOT EXISTS `[prefix]sign_ins` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `expire` bigint(20) NOT NULL,
  `login_hash` varchar(56) NOT NULL,
  `ip` varchar(32) NOT NULL,
  PRIMARY KEY (`expire`,`login_hash`,`ip`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `[prefix]permissions` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `label` varchar(1024) NOT NULL,
  `group` varchar(1024) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `label` (`label`(255)),
  KEY `group` (`group`(255))
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO `[prefix]permissions` (`label`, `group`) VALUES ('index', 'admin/System'), ('index', 'api/System');

CREATE TABLE IF NOT EXISTS `[prefix]sessions` (
  `id` varchar(32) NOT NULL,
  `user` int(11) unsigned NOT NULL COMMENT 'User id',
  `created` bigint(20) unsigned NOT NULL,
  `expire` bigint(20) unsigned NOT NULL,
  `user_agent` varchar(255) NOT NULL,
  `remote_addr` varchar(32) COLLATE utf8_unicode_ci NOT NULL COMMENT 'hex value, obtained by function ip2hex()',
  `ip` varchar(32) COLLATE utf8_unicode_ci NOT NULL COMMENT 'hex value, obtained by function ip2hex()',
  `data` mediumtext NOT NULL,
  PRIMARY KEY (`id`,`expire`,`user_agent`,`remote_addr`,`ip`),
  KEY `user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `[prefix]texts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `label` varchar(1024) NOT NULL,
  `group` varchar(1024) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `label` (`label`(255),`group`(255))
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `[prefix]texts_data` (
  `id` bigint(20) NOT NULL COMMENT 'id from texts table',
  `id_` varchar(25) NOT NULL,
  `lang` varchar(2) NOT NULL,
  `text` mediumtext NOT NULL,
  `text_md5` varchar(32) NOT NULL,
  PRIMARY KEY (`id`,`lang`),
  KEY `id_` (`id_`),
  KEY `text_md5` (`text_md5`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `[prefix]users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'WARNING: Never delete first 2 users!',
  `login` varchar(1024) NOT NULL,
  `login_hash` varchar(56) NOT NULL COMMENT 'hash method - sha224',
  `username` varchar(1024) NOT NULL,
  `password_hash` varchar(128) NOT NULL COMMENT 'hash method - sha512',
  `email` varchar(1024) NOT NULL,
  `email_hash` varchar(56) NOT NULL COMMENT 'hash method - sha224',
  `language` varchar(255) NOT NULL,
  `timezone` varchar(255) NOT NULL,
  `reg_date` bigint(20) unsigned NOT NULL DEFAULT '0',
  `reg_ip` varchar(32) NOT NULL COMMENT 'hex value, obtained by function ip2hex()',
  `reg_key` varchar(32) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '-1' COMMENT '''-1'' - not activated (for example after registration), 0 - inactive, 1 - active',
  `block_until` bigint(20) unsigned NOT NULL DEFAULT '0',
  `last_sign_in` bigint(20) unsigned NOT NULL DEFAULT '0',
  `last_ip` varchar(32) NOT NULL COMMENT 'hex value, obtained by function ip2hex()',
  `last_online` bigint(20) unsigned NOT NULL DEFAULT '0',
  `avatar` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `login` (`login`(5),`username`(5),`email`(5)),
  KEY `login_hash` (`login_hash`(5)),
  KEY `password_hash` (`password_hash`(5)),
  KEY `email_hash` (`email_hash`(5)),
  KEY `language` (`language`(3)),
  KEY `status` (`status`),
  KEY `last_sign_in` (`last_sign_in`),
  KEY `last_online` (`last_online`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

INSERT INTO `[prefix]users` (`login`, `login_hash`, `status`) VALUES ('guest', '5cf371cef0648f2656ddc13b773aa642251267dbd150597506e96c3a', '1');

CREATE TABLE IF NOT EXISTS `[prefix]users_data` (
  `id` int(10) unsigned NOT NULL COMMENT 'User id',
  `item` varchar(1024) NOT NULL,
  `value` mediumtext NOT NULL,
  PRIMARY KEY (`id`,`item`(255)),
  KEY `item` (`item`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `[prefix]users_groups` (
  `id` int(10) unsigned NOT NULL COMMENT 'User id',
  `group` smallint(5) unsigned NOT NULL COMMENT 'Group id',
  `priority` smallint(5) unsigned NOT NULL COMMENT 'Lower priority is more important',
  KEY `id` (`id`),
  KEY `group` (`group`),
  KEY `priority` (`priority`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `[prefix]users_groups` (`id`, `group`, `priority`) VALUES (2, 1, 0), (2, 2, 1);

CREATE TABLE IF NOT EXISTS `[prefix]users_permissions` (
  `id` int(10) unsigned NOT NULL COMMENT 'User id',
  `permission` smallint(5) unsigned NOT NULL COMMENT 'Permission id',
  `value` tinyint(1) unsigned NOT NULL,
  KEY `id` (`id`),
  KEY `permission` (`permission`,`value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
