import { useState, useEffect, useCallback } from 'react'

/**
 * Generic fetch hook.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi(getSessionSummary)
 *   const { data, loading, error, refetch } = useApi(() => getQuestionById(id), [id])
 */
export function useApi(fetcher, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      setData(result)
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error   ||
        err.message                  ||
        'An error occurred.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { run() }, [run])

  return { data, loading, error, refetch: run }
}

/**
 * Mutation hook — call imperatively (form submit, button click).
 *
 * Usage:
 *   const { execute, loading, error } = useMutation(submitAnswer)
 *   await execute(questionId, answer)
 */
export function useMutation(mutator) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [data, setData]       = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await mutator(...args)
      setData(result)
      return result
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message                  ||
        'Request failed.'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [mutator])

  return { execute, loading, error, data }
}

