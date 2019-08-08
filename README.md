# Installation

1) Since the bundle is not on packagist yet, you have to add the repository manually to your `composer.json` file:
```json
    "repositories": [
        { "type": "composer", "url": "https://updates.ez.no/ttl" },
        { "type": "vcs", "url": "https://github.com/kmadejski/csm-poc.git" }
    ],
```

2) Install the bundle:
```bash
composer require kmadejski/csm-poc:dev-master
```

3) Enable the bundle in your `app/AppKernel.php` file:
```php
    $bundles = [
        ...
        new EzSystems\CSMBundle\EzSystemsCSMBundle(),
    ];
```

4) Define your `verse` ContentType identifier by configuring the following parameter in your `parameters.yml` file:
```json
csm_poc.verse.content_type_identifier
```

5) Add the following entry to your `app/config/routing.yml` file:
```yaml
csm_poc:
    resource: "@EzSystemsCSMBundle/Resources/config/routing.yml"
```

6) *Optional*: Run the migration to get the test data (requires EzMigrationBundle (https://github.com/kaliop-uk/ezmigrationbundle):
```bash
php bin/console kaliop:migration:migrate --path vendor/kmadejski/csm-poc/src/bundle/MigrationVersions
```
