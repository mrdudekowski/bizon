import * as migration_20260719_144734_add_tire_selection_fields from './20260719_144734_add_tire_selection_fields';
import * as migration_20260719_155015_add_request_selection_context from './20260719_155015_add_request_selection_context';
import * as migration_20260726_041541_add_cart_sessions from './20260726_041541_add_cart_sessions';
import * as migration_20260726_094343_add_tbr_catalog_schema from './20260726_094343_add_tbr_catalog_schema';
import * as migration_20260726_105520_bizon_refactor_baseline from './20260726_105520_bizon_refactor_baseline';
import * as migration_20260727_015500_tire_catalog_manager_ux from './20260727_015500_tire_catalog_manager_ux';
import * as migration_20260727_072000_add_site_pages from './20260727_072000_add_site_pages';
import * as migration_20260811_140000_menu_curation_fields from './20260811_140000_menu_curation_fields';
import * as migration_20260820_120000_tire_iq_taxonomy from './20260820_120000_tire_iq_taxonomy';
import * as migration_20260820_140000_wheel_spec_source_fields from './20260820_140000_wheel_spec_source_fields';
import * as migration_20260820_230000_fix_tire_iq_taxonomy_parent_column from './20260820_230000_fix_tire_iq_taxonomy_parent_column';
import * as migration_20260821_000000_fix_tire_iq_taxonomy_order_column from './20260821_000000_fix_tire_iq_taxonomy_order_column';

export const migrations = [
  {
    up: migration_20260719_144734_add_tire_selection_fields.up,
    down: migration_20260719_144734_add_tire_selection_fields.down,
    name: '20260719_144734_add_tire_selection_fields',
  },
  {
    up: migration_20260719_155015_add_request_selection_context.up,
    down: migration_20260719_155015_add_request_selection_context.down,
    name: '20260719_155015_add_request_selection_context',
  },
  {
    up: migration_20260726_041541_add_cart_sessions.up,
    down: migration_20260726_041541_add_cart_sessions.down,
    name: '20260726_041541_add_cart_sessions',
  },
  {
    up: migration_20260726_094343_add_tbr_catalog_schema.up,
    down: migration_20260726_094343_add_tbr_catalog_schema.down,
    name: '20260726_094343_add_tbr_catalog_schema',
  },
  {
    up: migration_20260726_105520_bizon_refactor_baseline.up,
    down: migration_20260726_105520_bizon_refactor_baseline.down,
    name: '20260726_105520_bizon_refactor_baseline'
  },
  {
    up: migration_20260727_015500_tire_catalog_manager_ux.up,
    down: migration_20260727_015500_tire_catalog_manager_ux.down,
    name: '20260727_015500_tire_catalog_manager_ux'
  },
  {
    up: migration_20260727_072000_add_site_pages.up,
    down: migration_20260727_072000_add_site_pages.down,
    name: '20260727_072000_add_site_pages'
  },
  {
    up: migration_20260811_140000_menu_curation_fields.up,
    down: migration_20260811_140000_menu_curation_fields.down,
    name: '20260811_140000_menu_curation_fields'
  },
  {
    up: migration_20260820_120000_tire_iq_taxonomy.up,
    down: migration_20260820_120000_tire_iq_taxonomy.down,
    name: '20260820_120000_tire_iq_taxonomy'
  },
  {
    up: migration_20260820_140000_wheel_spec_source_fields.up,
    down: migration_20260820_140000_wheel_spec_source_fields.down,
    name: '20260820_140000_wheel_spec_source_fields'
  },
  {
    up: migration_20260820_230000_fix_tire_iq_taxonomy_parent_column.up,
    down: migration_20260820_230000_fix_tire_iq_taxonomy_parent_column.down,
    name: '20260820_230000_fix_tire_iq_taxonomy_parent_column'
  },
  {
    up: migration_20260821_000000_fix_tire_iq_taxonomy_order_column.up,
    down: migration_20260821_000000_fix_tire_iq_taxonomy_order_column.down,
    name: '20260821_000000_fix_tire_iq_taxonomy_order_column'
  },
];
