import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const { prompt } = await req.json()
  const text = prompt.toLowerCase()
  
  let keywords: string[] = []
  let advice = ""
  let urgency = "normal" // normal, caution, emergency
  let categorySearch = ""

  // 1. THE INTELLIGENT TRIAGE BRAIN
  if (text.match(/headache|pain|fever|body|migraine|tooth|back/)) {
    keywords = ['paracetamol', 'ibuprofen', 'inbu', 'felvin', 'panadol', 'sudrex', 'alabukun', 'diclofenac', 'lofnac']
    advice = "For pain and fever, these are common analgesics. Take with food if it's Ibuprofen to protect your stomach. Rest and stay hydrated. ⚠️ If the fever exceeds 39°C, or if pain lasts more than 3 days, please visit a doctor."
    categorySearch = 'Painkillers & Analgesics'
  } 
  else if (text.match(/stomach|diarrhea|vomit|poop|belly|gastro|indigestion|ulcer/)) {
    keywords = ['ors', 'loperamide', 'rulox', 'buscopan', 'gastril', 'omeprazole', 'cimetidine']
    advice = "Hydration is critical. Use ORS (Oral Rehydration Salts) to replace lost fluids. Loperamide can help with diarrhea, while Omeprazole helps with acid/ulcers. ⚠️ If you notice blood in your stool or cannot keep fluids down, seek emergency medical care."
    categorySearch = 'Gastro & General'
  } 
  else if (text.match(/malaria|chills|sweat|mosquito/)) {
    keywords = ['lonart', 'coartem', 'amatem', 'pomalade', 'maxiquine', 'artequick', 'maloxen']
    advice = "Malaria is serious. First, take a Rapid Diagnostic Test (RDT) to confirm. These Artemisinin-based combinations (ACTs) are standard. ⚠️ Malaria can be fatal if untreated. If you have severe symptoms (confusion, difficulty breathing), go to a hospital immediately."
    categorySearch = 'Antibiotics & Antimalarials'
  } 
  else if (text.match(/cough|cold|catarrh|throat|flu|chest/)) {
    keywords = ['cof', 'emzolyn', 'tixolyn', 'benylin', 'mix-ban', 'piscof', 'badexen']
    advice = "For coughs and colds, stay warm and drink plenty of fluids. Mix-Ban and Emzolyn are good for symptom relief. ⚠️ If you are coughing up blood, have chest pain, or have difficulty breathing, go to a hospital immediately."
    categorySearch = 'Syrups & Tonics'
  }
  else if (text.match(/infection|bacteria|wound|antibiotic|uti|urine/)) {
    keywords = ['amoxil', 'flagyl', 'ciprofloxacin', 'ampiclox', 'erythromycin', 'levoflox']
    advice = "⚠️ ANTIBIOTICS REQUIRED. Please note that antibiotics should only be taken if prescribed by a doctor. Misuse can cause resistance. If you have a bacterial infection (e.g., UTI, severe wound), consult our on-site expert immediately."
    urgency = "caution"
    categorySearch = 'Antibiotics & Antimalarials'
  }
  else if (text.match(/tired|weak|blood|anemia|vitamin|energy|pregnan/)) {
    keywords = ['vitamin', 'folic', 'astfer', 'b-complex', 'nutri c', 'calcium', 'daravil', 'pregnatone']
    advice = "For fatigue and overall wellness, these vitamins and blood tonics are excellent. Pregnant women should prioritize Folic Acid and Iron (Astfer). ⚠️ If you feel constantly weak despite taking vitamins, consult a doctor for a blood test."
    categorySearch = 'Vitamins & Supplements'
  }
  else {
    // Fallback: Search by name if no symptoms match
    keywords = text.split(' ').filter((w: string) => w.length > 2)
    advice = "Here are the products that match your search. Always read the label. If you need help choosing the right medication, please consult our on-site pharmacist."
  }

  // 2. FETCH MATCHING PRODUCTS
  const orFilter = keywords.map(k => `name.ilike.%${k}%`).join(',')
  let query = supabase.from('products').select('*, categories(name)').limit(6)
  
  if (orFilter) {
    query = query.or(orFilter)
  } else if (categorySearch) {
    query = query.eq('categories.name', categorySearch)
  }

  const { data: products } = await query

  return NextResponse.json({
    products: products || [],
    advice,
    urgency,
    category: categorySearch
  })
}
