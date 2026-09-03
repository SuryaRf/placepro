/**
 * Derive a placement level from a percentage score (0–100).
 * 0–40% Beginner · 41–75% Intermediate · 76–100% Advanced
 */
export function getLevel(percent) {
  if (percent <= 40) return 'beginner'
  if (percent <= 75) return 'intermediate'
  return 'advanced'
}

export const LEVEL_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

/**
 * Build a dynamic WhatsApp message for the CTA button.
 */
export function buildWhatsAppLink({ phone, name, level, score, total, programTitle }) {
  const levelLabel = LEVEL_LABELS[level] ?? level
  const message = [
    `Halo PlacePro! 👋`,
    ``,
    `Saya *${name}* baru saja menyelesaikan *Placement Test* dan ingin mendaftar program belajar.`,
    ``,
    `— *Hasil Tes* —`,
    `🪜 Level: *${levelLabel}*`,
    `✅ Skor: *${score}/${total}* (${Math.round((score / total) * 100)}%)`,
    `🎓 Program yang direkomendasikan: *${programTitle}*`,
    ``,
    `Boleh saya dibantu untuk proses registrasi dan info biayanya? Terima kasih! 🙏`,
  ].join('\n')

  const cleanPhone = String(phone ?? '').replace(/[^0-9]/g, '')
  // Normalize Indonesian-style numbers: leading 0 -> country code 62.
  let waPhone = cleanPhone
  if (/^0/.test(cleanPhone)) waPhone = `62${cleanPhone.slice(1)}`
  else if (!/^62/.test(cleanPhone) && cleanPhone.length >= 10) waPhone = `62${cleanPhone}`
  const waBase = waPhone.length >= 10 ? `https://wa.me/${waPhone}` : 'https://wa.me'
  const encoded = encodeURIComponent(message)
  return `${waBase}?text=${encoded}`
}

/** Round-scaled helper for percentage. */
export function toPercent(score, total) {
  if (!total) return 0
  return Math.round((score / total) * 100)
}
