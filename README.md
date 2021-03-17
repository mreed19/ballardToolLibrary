# Ballard Tool Library Site

## Running Locally
1. Start Wordpress and MySQL database with `docker-compose up`
2. Go to `http://localhost:8001` to access Wordpress site
3. Enter basic site name and username information to setup your blank wordpress site
  - Wordpress files will be stored in the `wordpress/` directory. Remove this if you would like to start from scratch
4. Build or serve Vue content by navigating to `custom/plugins/btl_volunteer_plugin/btl-volunteers-wp-shortcode` and running `npm run serve` or `npm run build`
  - `serve` will enable hot reloading while `build` will generate the production build version.
5. Find the `BTL Volunteer DB Plugin` plugin under the wordpress admin dashboard under `Plugins` and click `Activate`.
  - Clicking `Activate` will create the DB tables. Clicking `Deactivate` will remove the DB tables.
6. To render the Vue SPA, add the `[btl-volunteers]` shortcode to any wordpress page or post.

## DB Access
To acces the DB, navigate to `http://localhost:8000` and use the user `root` with the `MYSQL_ROOT_PASSWORD` value set in the `docker-compose.yml` file. DB files are stored in the `db_data/` directory.

## Quick Explanation
The Plugin code is all handled in the `btl_volunteer_plugin.php` file. This handles creating the DB tables, initializing the Wordpress REST API and the associated routes for interacting with the tables, and creating the shortcode to render the content from the `dist/` folder of the `btl-volunteers-wp-shoprtcode` folder that holds the Vue application. This plugin assumes a MySQL database to be set up with Wordpress.
