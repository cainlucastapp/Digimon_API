// src/services/digimonApi.js

const BASE_URL = "https://digi-api.com/api/v1"

// Build Query
const buildQuery = (params) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value)
    }
  })
  return query.toString()
}

// Safe Fetch
const safeFetch = async (url) => {
    let res
    try {
        res = await fetch(url)
    } catch (err) {
        throw new Error("Network error — please check your connection and try again", { cause: err })
    }
    return res
}

// Fetch All Pages
const fetchAllPages = async (endpoint) => {
  let page = 0
  let allFields = []
  let hasMore = true
  const MAX_PAGES = 10

  while (hasMore && page < MAX_PAGES) {
    const res = await safeFetch(`${BASE_URL}/${endpoint}?page=${page}`)
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint} page ${page}`)

    const data = await res.json()

    if (!data.content || !Array.isArray(data.content.fields)) {
      throw new Error(`Unexpected response shape from ${endpoint}`)
    }

    allFields = [...allFields, ...data.content.fields]
    hasMore = !!data.pageable?.nextPage
    page++
  }

  return allFields
}

// Get Digimon List
export const getDigimonList = async (params = {}) => {
  const query = buildQuery(params)
  const res = await safeFetch(`${BASE_URL}/digimon?${query}`)
  if (!res.ok) throw new Error("Failed to fetch Digimon list")

  const data = await res.json()

  if (!data.content && data.pageable?.totalElements === 0) {
    return { content: [], pageable: data.pageable }
  }

  // Handle out of range page
  if (!data.content && data.pageable?.totalPages > 0) {
    return { content: [], pageable: data.pageable }
  }

  if (!Array.isArray(data.content)) {
    throw new Error("Unexpected response: Digimon list missing content array")
  }

  return data
}

// Get Single Digimon
export const getDigimon = async (idOrName) => {
  if (!idOrName) throw new Error("Digimon ID or name is required")

  const res = await safeFetch(`${BASE_URL}/digimon/${idOrName}`)

  if (res.status === 404 || res.status === 400) throw new Error(`Digimon "${idOrName}" not found`)
  if (!res.ok) throw new Error(`Failed to fetch Digimon: ${idOrName} (status ${res.status})`)

  const data = await res.json()

  if (!data.id || !data.name) {
    throw new Error(`Invalid Digimon data received for: ${idOrName}`)
  }

  return data
}

// Get Random Digimon
export const getRandomDigimon = async () => {
    const randomId = Math.floor(Math.random() * 1488) + 1
    try {
        return await getDigimon(randomId)
    } catch (err) {
        throw new Error(`Failed to fetch random Digimon (tried ID ${randomId}): ${err.message}`, { cause: err })
    }
}

// Get Attribute List
export const getAttributeList = async () => {
  return fetchAllPages("attribute")
}

// Get Level List
export const getLevelList = async () => {
  return fetchAllPages("level")
}