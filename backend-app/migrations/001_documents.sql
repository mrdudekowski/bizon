CREATE TABLE documents (
  id text PRIMARY KEY,
  kind text NOT NULL CHECK (
    kind IN (
      'tire_direction',
      'tire_model',
      'wheel_type',
      'wheel_model',
      'shop_category',
      'shop_product',
      'page',
      'article',
      'story',
      'media_asset',
      'sync_probe'
    )
  ),
  slug text NOT NULL,
  draft jsonb NOT NULL,
  published_snapshot jsonb,
  hidden boolean NOT NULL DEFAULT false,
  slug_locked boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, slug)
);

INSERT INTO documents (
  id,
  kind,
  slug,
  draft,
  published_snapshot,
  hidden,
  slug_locked
)
VALUES (
  'dir-long-haul',
  'tire_direction',
  'long-haul',
  '{
    "id": "dir-long-haul",
    "slug": "long-haul",
    "name": "Магистральные",
    "description": "",
    "shortDescription": "",
    "sortOrder": 0,
    "showInMenu": true,
    "imageUrl": null,
    "selectionVehicleTypes": ["long-haul-tractor"],
    "selectionConditions": ["long-haul"]
  }'::jsonb,
  '{
    "id": "dir-long-haul",
    "slug": "long-haul",
    "name": "Магистральные",
    "description": "",
    "shortDescription": "",
    "sortOrder": 0,
    "showInMenu": true,
    "imageUrl": null,
    "selectionVehicleTypes": ["long-haul-tractor"],
    "selectionConditions": ["long-haul"]
  }'::jsonb,
  false,
  true
)
ON CONFLICT (id) DO NOTHING;
