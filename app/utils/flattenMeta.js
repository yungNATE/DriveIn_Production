/**
 * Remonte les propriétés meta d'un niveau dans chaque item
 * @param {Array} items - Tableau d'items avec propriété meta
 * @returns {Array} - Tableau d'items avec meta aplaties
 */
export function flattenMeta(items) {
  if (!items || !Array.isArray(items)) {
    console.warn("flattenMeta: items should be an array", items);
    return [];
  }

  return items.map((item) => {
    if (!item) return item;

    // Destructure pour éviter les conflits de propriétés
    const { meta, ...rest } = item;

    return {
      ...rest,
      ...(meta || {}), // Remonte les meta seulement si elles existent
    };
  });
}
