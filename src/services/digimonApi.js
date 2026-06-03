// src/services/digimonApi.js


const BASE_URL = "https://digi-api.com/api/v1";


// Helper to build query strings from a params object
const buildQuery = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });
  return query.toString();
};


// Helper to fetch all pages for small reference lists (levels, attributes)
const fetchAllPages = async (endpoint) => {
  let page = 0;
  let allFields = [];
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(`${BASE_URL}/${endpoint}?page=${page}`);
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    const data = await res.json();
    allFields = [...allFields, ...data.content.fields];
    hasMore = data.pageable.nextPage !== "";
    page++;
  }

  return allFields;
};


// Get a paged/filtered list of Digimon
export const getDigimonList = async (params = {}) => {
  const query = buildQuery(params);
  const res = await fetch(`${BASE_URL}/digimon?${query}`);
  if (!res.ok) throw new Error("Failed to fetch Digimon list");
  return res.json();
};


// Get a single Digimon by ID or name
export const getDigimon = async (idOrName) => {
  const res = await fetch(`${BASE_URL}/digimon/${idOrName}`);
  if (!res.ok) throw new Error(`Failed to fetch Digimon: ${idOrName}`);
  return res.json();
};


// Get a random Digimon for the Hero page
export const getRandomDigimon = async () => {
  const randomId = Math.floor(Math.random() * 1488) + 1;
  return getDigimon(randomId);
};


// Get all attributes for FilterBar
export const getAttributeList = async () => {
  return fetchAllPages("attribute");
};


// Get all levels for FilterBar
export const getLevelList = async () => {
  return fetchAllPages("level");
};