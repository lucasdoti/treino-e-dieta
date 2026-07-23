import { supabase } from '../config/supabase';

// Sincronização por "blob": todos os dados do usuário ficam numa única linha
// JSONB (tabela user_data), protegida por RLS. Simples e robusto para um app
// pessoal offline-first.
const TABLE = 'user_data';

export async function fetchCloudData(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data?.data ?? null;
}

export async function saveCloudData(userId, payload) {
  const { error } = await supabase
    .from(TABLE)
    .upsert(
      { user_id: userId, data: payload, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
  if (error) throw error;
}
