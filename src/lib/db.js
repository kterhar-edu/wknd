import { supabase } from './supabase';

/**
 * Load all weekend rows for the currently authenticated user.
 * Returns an object keyed by weekend_id matching the existing state shape.
 */
export async function loadAllWeekends() {
  const { data, error } = await supabase
    .from('weekend_data')
    .select('weekend_id, events, tags, participants');

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
