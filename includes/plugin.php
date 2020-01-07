<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Plugin {

	public function __construct() {
		require_once( plugin_dir_path( __FILE__ ) . 'shortcodes.php' );
		$this->register_action();
		$this->register_shortcodes();
	}

	public function register_action() {
		add_action( 'admin_head', array( $this, 'wdm_add_mce_button' ) );
		add_filter( 'tiny_mce_before_init', array( $this, 'am_tiny_mce_font_size' ) );

	}
	// hooks your functions into the correct filters
	public function wdm_add_mce_button() {
		// check user permissions
		if ( ! current_user_can( 'edit_posts' ) && ! current_user_can( 'edit_pages' ) ) {
			return;
		}
	   // check if WYSIWYG is enabled
	   if ( 'true' === get_user_option( 'rich_editing' ) ) {
			add_filter( 'mce_external_plugins', array( $this, 'my_add_tinymce_plugin' ) );
			add_filter( 'mce_buttons_2', array( $this, 'register_mce_button_2' ) );
			add_filter( 'mce_buttons_3', array( $this, 'register_custom_mce_button_3' ) );
		}
	}
	// register new button in the editor
	public function register_mce_button_2( $buttons ) {
		array_push( $buttons, 'fontsizeselect' );
		array_push( $buttons, 'lineheight' );
		return $buttons;
	}
	public function register_custom_mce_button_3( $buttons ) {
		array_push( $buttons, 'ads' );
		array_push( $buttons, 'blockquote2' );
		array_push( $buttons, 'item2' );
		array_push( $buttons, 'num2' );
		array_push( $buttons, 'carousel' );
		array_push( $buttons, 'related_articles' );
		array_push( $buttons, 'external_related_articles' );
		return $buttons;
	}
		// declare a script for the new button
		// the script will insert the shortcode on the click event
	public function my_add_tinymce_plugin( $plugin_array ) {
		$plugin_array['custom_btn'] = get_stylesheet_directory_uri() .'/scripts/admin/js/tinymce-custom.js';
		$plugin_array['lineheight'] = get_stylesheet_directory_uri().'/scripts/admin/js/tinymce-custom.js';
		return $plugin_array;
	}

	// Customize Tiny mce editor font sizes for WordPress
	public function am_tiny_mce_font_size( $initArray ){
		$initArray['fontsize_formats'] = "9px 10px 12px 13px 14px 16px 17px 18px 19px 20px 21px 24px 28px 30px 36px";
		// Add as needed
		return $initArray;
	}

	public function register_shortcodes() {

		$shortcodes = new Shortcodes();
		add_shortcode( 'bs_carousel', array( $shortcodes, 'bootstrap_carousel' ) );

		add_shortcode( 'bs_carousel_item', array( $shortcodes, 'bootstrap_carusel_item' ) );

		add_shortcode( 'related_articles', array( $shortcodes, 'related_articles_func' ) );

		add_shortcode( 'embed', array( $shortcodes, 'my_embed_callback' ) );
	}
}
