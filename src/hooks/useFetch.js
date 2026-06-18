// src/hooks/useFetch.js

import { useState, useEffect } from "react"

const useFetch = (fetchFn, deps = []) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false

        const run = async () => {
            if (typeof fetchFn !== "function") {
                setError("No fetch function provided")
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const result = await fetchFn()
                if (!cancelled) {
                    setData(result)
                    setLoading(false)
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "An unexpected error occurred")
                    setLoading(false)
                }
            }
        }

        run()

        return () => { cancelled = true }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    return { data, loading, error }
}

export default useFetch