<?php
/**
 * Plugin Name: Custom TinyMCE Editor
 * Description: Custom tinymce editor feature. Example: Bootstrap carousel,Custom post block...
 * Version: 1.0
 * Author: paku
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once( plugin_dir_path( __FILE__ ) . 'includes/plugin.php' );



new Plugin();
