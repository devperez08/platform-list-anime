'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const identifier = formData.get('identifier') as string
  const password = formData.get('password') as string
  
  let email = identifier

  // Si el identificador no parece un correo, buscamos el email asociado al username en profiles
  if (!identifier.includes('@')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('username', identifier)
      .maybeSingle()
    
    if (profile?.email) {
      email = profile.email
    } else {
      // Si no encontramos el perfil, probablemente el login fallará, pero dejamos que Supabase lo maneje
    }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error.message)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  
  // Usar el nombre de usuario del formulario o extraer uno por defecto del email
  const finalUsername = username || email.split('@')[0]

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: finalUsername,
        username: finalUsername,
      }
    }
  })

  if (error) {
    console.error('Signup error:', error.message)
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function loginWithGoogle() {
  const supabase = await createClient()

  // Determinar la URL base del sitio de forma robusta
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/api/auth/callback`,
    },
  })

  if (error) {
    console.error('Google login error:', error.message)
    redirect('/error')
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
