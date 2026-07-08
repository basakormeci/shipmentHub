/**
 * Zustand persist keys and schema versions.
 *
 * | Store     | Storage key           | Version | Notes                                      |
 * |-----------|-----------------------|---------|--------------------------------------------|
 * | auth      | shipment-hub:auth     | 1       | sessionStorage — loggedIn, userId          |
 * | ui        | shipment-hub:ui       | 5       | sessionStorage — lang, filters, wizard     |
 * | data      | shipment-hub:v1       | 4       | localStorage — entity seed + mutations     |
 *
 * Bump `version` in the matching store when persisted shape changes; add a
 * `migrate` handler in dataStore (and ui/auth if needed). Stale keys can be
 * cleared manually in devtools when testing migrations.
 */
export const PERSIST_KEYS = {
  auth: 'shipment-hub:auth',
  ui: 'shipment-hub:ui',
  data: 'shipment-hub:v1',
} as const

export const PERSIST_VERSIONS = {
  auth: 1,
  ui: 5,
  data: 4,
} as const
