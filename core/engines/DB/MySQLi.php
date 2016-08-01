<?php
/**
 * @package   CleverStyle Framework
 * @author    Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright Copyright (c) 2011-2016, Nazar Mokrynskyi
 * @license   MIT License, see license.txt
 */
namespace cs\DB;
use
	mysqli_result;

class MySQLi extends _Abstract {
	/**
	 * @var \MySQLi Instance of DB connection
	 */
	protected $instance;
	/**
	 * @inheritdoc
	 */
	public function __construct ($database, $user = '', $password = '', $host = 'localhost', $prefix = '') {
		$start = microtime(true);
		/**
		 * Parsing of $host variable, detecting port and persistent connection
		 */
		list($host, $port) = $this->get_host_and_port($host);
		$this->instance = new \MySQLi($host, $user, $password, $database, $port);
		if (!is_object($this->instance) || $this->instance->connect_errno) {
			return;
		}
		$this->database = $database;
		/**
		 * Changing DB charset if necessary
		 */
		if ($this->instance->character_set_name() != 'utf8mb4') {
			$this->instance->set_charset('utf8mb4');
		}
		$this->connected       = true;
		$this->connecting_time = microtime(true) - $start;
		$this->db_type         = 'mysql';
		$this->prefix          = $prefix;
	}
	/**
	 * Parse host string into host and port separately
	 *
	 * Understands `p:` prefix for persistent connections
	 *
	 * @param string $host_string
	 *
	 * @return array
	 */
	protected function get_host_and_port ($host_string) {
		$host = explode(':', $host_string);
		$port = ini_get('mysqli.default_port') ?: 3306;
		switch (count($host)) {
			case 1:
				$host = $host[0];
				break;
			case 2:
				if ($host[0] == 'p') {
					$host = "$host[0]:$host[1]";
				} else {
					list($host, $port) = $host;
				}
				break;
			case 3:
				$port = $host[2];
				$host = "$host[0]:$host[1]";
		}
		return [$host, $port];
	}
	/**
	 * @inheritdoc
	 *
	 * @return false|mysqli_result
	 */
	protected function q_internal ($query, $parameters = []) {
		if (!$query) {
			return false;
		}
		for ($i = 0; $i < 2; ++$i) {
			if ($parameters) {
				$stmt = $this->instance->prepare($query);
				$stmt->bind_param(
					str_repeat('s', count($parameters)),
					...$parameters
				);
				$stmt->execute();
				$result = $stmt->get_result();
			} else {
				$result = $this->instance->query($query);
			}
			// In case of MySQL Client error - try to fix everything, but only once
			if (
				$result ||
				$this->instance->errno < 2000 ||
				!$this->instance->ping()
			) {
				break;
			}
		}
		/** @noinspection PhpUndefinedVariableInspection */
		return $result;
	}
	/**
	 * @inheritdoc
	 *
	 * @param false|mysqli_result $query_result
	 */
	public function f ($query_result, $single_column = false, $array = false, $indexed = false) {
		if (!($query_result instanceof mysqli_result)) {
			return false;
		}
		$result_type = $single_column || $indexed ? MYSQLI_NUM : MYSQLI_ASSOC;
		if ($array) {
			$result = [];
			while ($current = $query_result->fetch_array($result_type)) {
				$result[] = $single_column ? $current[0] : $current;
			}
			$this->free($query_result);
			return $result;
		}
		$result = $query_result->fetch_array($result_type);
		if ($result === null) {
			$result = false;
		}
		return $single_column && $result ? $result[0] : $result;
	}
	/**
	 * @inheritdoc
	 */
	public function id () {
		return $this->instance->insert_id;
	}
	/**
	 * @inheritdoc
	 */
	public function affected () {
		return $this->instance->affected_rows;
	}
	/**
	 * @inheritdoc
	 *
	 * @param false|mysqli_result $query_result
	 */
	public function free ($query_result) {
		if ($query_result instanceof mysqli_result) {
			$query_result->free();
		}
		return true;
	}
	/**
	 * @inheritdoc
	 */
	public function columns ($table, $like = false) {
		if (!$table) {
			return false;
		}
		if ($like) {
			$like    = $this->s($like);
			$columns = $this->qfas("SHOW COLUMNS FROM `$table` LIKE $like") ?: [];
		} else {
			$columns = $this->qfas("SHOW COLUMNS FROM `$table`") ?: [];
		}
		return $columns;
	}
	/**
	 * @inheritdoc
	 */
	public function tables ($like = false) {
		if ($like) {
			$like = $this->s($like);
			return $this->qfas("SHOW TABLES FROM `$this->database` LIKE $like") ?: [];
		} else {
			return $this->qfas("SHOW TABLES FROM `$this->database`") ?: [];
		}
	}
	/**
	 * @inheritdoc
	 */
	protected function s_internal ($string, $single_quotes_around) {
		$return = $this->instance->real_escape_string($string);
		return $single_quotes_around ? "'$return'" : $return;
	}
	/**
	 * @inheritdoc
	 */
	public function server () {
		return $this->instance->server_info;
	}
	/**
	 * @inheritdoc
	 */
	public function __destruct () {
		if ($this->connected && is_object($this->instance)) {
			$this->instance->close();
			$this->connected = false;
		}
	}
}
