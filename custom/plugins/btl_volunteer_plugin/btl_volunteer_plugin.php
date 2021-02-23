<?php

/*
Plugin Name: BTL Volunteer DB Plugin
Description: Creates MySQL Database table to track Volunteer hours
Version: 1.0.0
*/

class BTLVolunteerPlugin {

  protected $wpdb;
  protected $volunteers_table_name;
  protected $volunteer_hours_table_name;

  public function __construct() {
    global $wpdb;
    $this->wpdb =& $wpdb;
    $this->volunteers_table_name = $this->wpdb->prefix . 'volunteers';
    $this->volunteer_hours_table_name = $this->wpdb->prefix . 'volunteer_hours';
    $this->register_hooks();
  }

  private function register_hooks() {
    // Setup DB
    register_activation_hook(__FILE__, [$this, 'volunteer_db_install']);

    // Clear DB on uninstall/delete
    register_deactivation_hook(__FILE__, [ $this, 'volunteer_db_uninstall']);

    // Register REST API routes
    add_action('rest_api_init', [$this, 'register_routes']);

    // Load Vue and create shortcode
    add_action('wp_enqueue_scripts', [$this, 'load_vue_scripts']);
    add_shortcode('btl-volunteers', [$this, 'load_vue_plugin_page']);
  }

  public function load_vue_scripts() {
    $vueDirectory = join(DIRECTORY_SEPARATOR, [plugin_dir_url(__FILE__), 'btl-volunteers-wp-shortcode', 'dist']);
    wp_register_style('backend-vue-style', $vueDirectory . '/app.css');
    wp_register_script('backend-vue-script', $vueDirectory . '/app.js', [], '1.0.0', true);
  }

  public function load_vue_plugin_page() {
    wp_enqueue_style('backend-vue-style');
    wp_enqueue_script('backend-vue-script');

    $template = '<div class="wrap"><div id="app"></div></div>';
    return $template;
  }

  public function register_routes() {

    register_rest_route('btl_volunteers/v1', '/volunteers', array(
      'methods' => 'GET',
      'callback' => array($this, 'get_all_volunteers')
    ));

    register_rest_route('btl_volunteers/v1', '/volunteers', array(
      'methods' => 'POST',
      'callback' => array($this, 'create_volunteer')
    ));

    register_rest_route('btl_volunteers/v1', '/volunteer_hours', array(
      'methods' => 'POST',
      'callback' => array($this, 'insert_volunteer_hours')
    ));

    register_rest_route('btl_volunteers/v1', '/volunteer_hours', array(
      'methods' => 'GET',
      'callback' => array($this, 'get_volunteer_hours_by_date_range'),
      'args' => array(
        'start_date' => array(
          'required' => true,
          'validate_callback' => function($param) {
            return $this->validateDate($param);
          }
        ),
        'end_date' => array(
          'required' => true,
          'validate_callback' => function($param) {
            return $this->validateDate($param);
          }
        )
      )
    ));
  }

  public function validateDate($date, $format = 'Y-m-d') {
    $d = DateTime::CreateFromFormat($format, $date);

    return $d && $d->format($format) === $date;
  }

  public function volunteer_db_install() {
    $charset_collate = $this->wpdb->get_charset_collate();

    $volunteer_sql = "CREATE TABLE $this->volunteers_table_name (
      id smallint(5) NOT NULL AUTO_INCREMENT,
      first_name varchar(255) NOT NULL,
      last_name varchar(255) NOT NULL,
      email_address varchar(255) NOT NULL,
      date_created datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
      PRIMARY KEY  (id)
    ) $charset_collate;";

    $volunteer_hours_sql = "CREATE TABLE $this->volunteer_hours_table_name (
      id mediumint(9) NOT NULL AUTO_INCREMENT,
      volunteer_id smallint(5) NOT NULL,
      hours_recorded tinyint(4) NOT NULL,
      date_recorded date DEFAULT '0000-00-00',
      date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      PRIMARY KEY  (id),
      FOREIGN KEY (volunteer_id) REFERENCES $this->volunteers_table_name (id)
    ) $charset_collate;";

    $this->wpdb->query($volunteer_sql);
    $this->wpdb->query($volunteer_hours_sql);
  }

  public function get_all_volunteers() {
    $results = $this->wpdb->get_results("SELECT * FROM $this->volunteers_table_name;");

    if (!empty($this->wpdb->last_error)) {
      return new WP_Error('db_query_error', "ERROR: Unable to get all volunteers: {$this->wpdb->last_error}", array('status' => 500));
    }

    return $results;
  }

  public function create_volunteer(WP_REST_Request $request) {
    $volunteer = json_decode($request->get_body(), true);

    $this->wpdb->insert($this->volunteers_table_name, $volunteer);

    if (!empty($this->wpdb->last_error)) {
      return new WP_Error('db_insert_error', "ERROR: Unable to insert volunteer: {$this->wpdb->last_error}", array('status' => 500));
    }

    return "Successfully inserted volunteer: $volunteer[first_name] $volunteer[last_name]";
  }

  public function insert_volunteer_hours(WP_REST_Request $request) {
    $volunteer_hours = json_decode($request->get_body(), true);

    $this->wpdb->insert($this->volunteer_hours_table_name, $volunteer_hours);

    if (!empty($this->wpdb->last_error)) {
      return new WP_Error('db_insert_error', "ERROR Unable to insert volunteer hours: {$this->wpdb->last_error}", array('status' => 500));
    }

    return "Successfully inserted volunteers hours: $volunteer_hours[hours_recorded] on $volunteer_hours[date_recorded]";
  }

  public function get_volunteer_hours_by_date_range(WP_REST_Request $request) {
    $params = $request->get_query_params();
    $start_date = $params['start_date'];
    $end_date = $params['end_date'];

    $results = $this->wpdb->get_results("SELECT * FROM $this->volunteer_hours_table_name WHERE date_recorded BETWEEN '$start_date' AND '$end_date' ORDER BY date_recorded DESC");

    return $results;
  }

  public function volunteer_db_uninstall() {
    $this->wpdb->query("DROP TABLE IF EXISTS $this->volunteer_hours_table_name;");
    $this->wpdb->query("DROP TABLE IF EXISTS $this->volunteers_table_name;");
  }
}

new BTLVolunteerPlugin();
?>
