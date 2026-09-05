import { useCallback, useEffect, useState } from 'react'
import { fallbackProducts } from '../data/fallbackProducts'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export function useProducts({ includeInactive = false } = {}) {
  const [products, setProducts] = useState(isSupabaseConfigured ? [] : fallbackProducts)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setProducts(includeInactive ? fallbackProducts : fallbackProducts.filter((item) => item.active))
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    let query = supabase.from('products').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true })
    if (!includeInactive) query = query.eq('active', true)
    const { data, error: queryError } = await query

    if (queryError) {
      setError(queryError.message)
      if (!includeInactive) setProducts(fallbackProducts)
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }, [includeInactive])

  useEffect(() => { load() }, [load])
  return { products, loading, error, reload: load, setProducts }
}
