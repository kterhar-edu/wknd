import { supabase } from './supabase';

/**
 * Load all weekend rows for the given user.
 * The .eq() filter is defence-in-depth — RLS already enforces this server-side,
 * but an explicit filter means we'd get 0 rows even if RLS were misconfigured.
 */
export async function loadAllWeekends(userId) {
  const { data, error } = await supabase
    .from('weekend_data')
    .select('weekend_id, events, tags, participants')
    .eq('user_id', userId);

  if (error) throw error;

  const result = {};
  (data ?? []).forEach(row => {
    result[row.weekend_id] = {
      events:       row.events       ?? [],
      tags:         row.tags         ?? { travelling: false, holiday: false },
      participants: row.participants ?? [],
    };
  });
  return result;
}

/**
 * Upsert a single weekend's data for the given userId.
 * Safe to call repeatedly — uses (user_id, weekend_id) as the conflict key.
 */
export async function saveWeekend(userId, weekendId, weekendData) {
  const { error } = await supabase
    .from('weekend_data')
    .upsert(
      {
        user_id:      userId,
        weekend_id:   weekendId,
        events:       weekendData.events,
        tags:         weekendData.tags,
        participants: weekendData.participants,
        updated_at:   new Date().toISOString(),
      },
      { onConflict: 'user_id,weekend_id' }
    );

  if (error) throw error;
}
