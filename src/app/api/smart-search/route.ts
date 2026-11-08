import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { prompt } = await req.json()
  const text = prompt.toLowerCase()
  
  let keywords: string[] = []
  let advice = ""
  let categoryName = ""

  // 1. The "Smart Brain" Logic (Symptom Mapping)
  if (text.includes('headache') || text.includes('pain') || text.includes('fever') || text.includes('body')) {
    keywords = ['paracetamol', 'ibuprofen', 'inbu', 'felvin', 'panadol', 'sudrex', 'diclofenac']
    categoryName = 'Painkillers & Analgesics'
    advice = "For pain and fever, these are common remedies. Ensure you rest and stay hydrated. If the fever exceeds 39°C or lasts more than 3 days, please visit a doctor immediately."
  } else if (text.includes('stomach') || text.includes('diarrhea') || text.includes('vomit') || text.includes('poop')) {
    keywords = ['ors', 'loperamide', 'rulox', 'buscopan', 'flagyl']
    categoryName = 'Gastro & General'
    advice = "Hydration is critical. Use ORS to replace lost fluids. If you notice blood in your stool or cannot keep fluids down, seek emergency medical care."
  } else if (text.includes('malaria') || text.includes('chills') || text.includes('sweat')) {
    keywords = ['lonart', 'coartem', 'amatem', 'pomalade', 'maxiquine']
    categoryName = 'Antibiotics & Antimalarials'
    advice = "Malaria requires a proper test. If you suspect malaria, take an RDT test. These antimalarials are available, but you should consult a pharmacist for the correct dosage."
  } else if (text.includes('cough') || text.includes('cold') || text.includes('catarrh')) {
    keywords = ['cof', 'emzolyn', 'tixolyn', 'benylin', 'mix-ban']
    categoryName = 'Syrups & Tonics'
    advice = "For coughs and colds, stay warm and drink plenty of fluids. If you are coughing up blood or have difficulty breathing, go to a hospital immediately."
  } else {
    // Fallback: Search by name if no symptoms match
    keywords = text.split(' ').filter((w: string) => w.length > 2)
    advice = "Here are the products that match your search. If you need help choosing, please consult our on-site pharmacist."
  }

  // 2. Fetch matching products from Supabase
  // We construct an OR filter to find any product matching the keywords
  const orFilter = keywords.map(k => `name.ilike.%${k}%`).join(',')
  
  let query = supabase.from('products').select('*, categories(name)').limit(5)
  
  if (orFilter) {
    query = query.or(orFilter)
  } else {
     // If no specific keywords, just grab top items from the category
     query = query.eq('categories.name', categoryName)
  }

  const { data: products } = await query

  return NextResponse.json({
    products: products || [],
    advice,
    category: categoryName
  })
}
