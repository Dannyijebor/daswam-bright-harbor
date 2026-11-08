'use server'

import { supabase } from '@/lib/supabase'

export async function placeOrder(formData: FormData, cart: any[], total: number) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const paymentMethod = formData.get('payment') as string

  if (!name || !phone || !address) {
    return { success: false, error: 'Please fill in all delivery details.' }
  }

  // 1. Create the Order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: name,
      customer_phone: phone,
      delivery_address: address,
      payment_method: paymentMethod,
      total_amount: total,
      status: 'pending'
    })
    .select()
    .single()

  if (orderError) {
    console.error(orderError)
    return { success: false, error: 'Failed to create order. Please try again.' }
  }

  // 2. Create the Order Items
  const orderItems = cart.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    unit_price: item.price
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error(itemsError)
    // Even if items fail, the order was created, but let's log it.
    return { success: false, error: 'Order created but items failed to save.' }
  }

  return { success: true, orderId: order.id }
}
