
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

/**
 * Wrapper pour queryCollection avec auto-flatten des meta
 * @param {string} contentType - Type de contenu à récupérer
 * @param {Function} queryBuilder - Fonction pour construire la requête (optionnel)
 * @returns {Promise<Array>} - Promesse retournant les items avec meta aplaties
 */
export async function queryCollectionFlat(contentType, queryBuilder = null) {
  try {
    // Construction de la requête de base
    let query = queryCollection(contentType);

    // Application du builder si fourni
    if (queryBuilder && typeof queryBuilder === "function") {
      query = queryBuilder(query);
    }

    // Exécution de la requête
    const data = await query.all();

    // Auto-flatten des meta
    return flattenMeta(data);
  } catch (error) {
    console.error(Erreur lors de la récupération de ${contentType}:, error);
    throw error;
  }
}