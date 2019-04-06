TravellerDB
=======

# Very quick guide on how to install a local copy

This guide assumes you know how to use the command-line and that your machine has php and mysql installed.

- install composer: https://getcomposer.org/download/
- clone the repo somewhere
- cd to it
- run `composer install` (at the end it will ask for the database configuration parameters)
- run `php app/console doctrine:database:create`
- run `php app/console doctrine:schema:create`
- run `php app/console app:import:std ../travellerdb-json-data` or whatever the path to your TravellerDB JSON data repository is
- run `php app/console app:import:trans ../travellerdb-json-data` if you want to import the translations
- run `php app/console server:run`

## Setup an admin account

- register
- make sure your account is enabled (or run `php app/console fos:user:activate <username>`)
- run `php app/console fos:user:promote --super <username>`
