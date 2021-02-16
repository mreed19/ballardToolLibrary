<?php

/*
Plugin Name: Vue Hot Reload Plugin
Description: Vue Hot Reloading inside of WordPress.
Version: 1.0.0
*/

class VuePlugin {
  public function __construct() {
    $this->register_hooks();
  }

  private function register_hooks() {
    add_action('wp_enqueue_scripts', [$this, 'load_vue_scripts']);
    add_shortcode('vue-plugin', [$this, 'load_vue_plugin_page']);
  }

  public function load_vue_scripts() {
    $vueDirectory = join( DIRECTORY_SEPARATOR, [ plugin_dir_url(__FILE__), 'vue', 'dist' ]);
    wp_register_style( 'backend-vue-style', $vueDirectory . '/app.css' );
    wp_register_script( 'backend-vue-script', $vueDirectory . '/app.js', [], '1.0.0', true );
  }

  public function load_vue_plugin_page() {
    wp_enqueue_style( 'backend-vue-style' );
    wp_enqueue_script( 'backend-vue-script' );

    $template = '<div class="wrap"><div id="app"></div></div>';
    return $template;
  }
}

new VuePlugin();

?>
