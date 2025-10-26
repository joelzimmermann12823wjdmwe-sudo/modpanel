import { useState, useEffect } from 'react'
import { getModActions, createModAction } from '@/lib/api'

export function useModActions() {
  const [actions, setActions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadActions = async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getModActions(filters)
      setActions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addAction = async (actionData) => {
    setLoading(true)
    setError(null)
    try {
      const newAction = await createModAction(actionData)
      setActions(prev => [newAction, ...prev])
      return newAction
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActions()
  }, [])

  return {
    actions,
    loading,
    error,
    loadActions,
    addAction
  }
}
