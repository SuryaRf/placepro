export function validateBiodata(values) {
  const errors = {}

  const name = String(values.name ?? '').trim()
  if (!name) {
    errors.name = 'Nama wajib diisi.'
  } else if (name.length < 3) {
    errors.name = 'Nama minimal 3 karakter.'
  }

  const email = String(values.email ?? '').trim()
  if (!email) {
    errors.email = 'Email wajib diisi.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'Format email tidak valid (contoh: nama@email.com).'
  }

  const phone = String(values.phone ?? '').replace(/\D/g, '')
  if (!phone) {
    errors.phone = 'Nomor WhatsApp wajib diisi.'
  } else if (phone.length < 9 || phone.length > 15) {
    errors.phone = 'Nomor WhatsApp tidak valid (9–15 digit).'
  }

  const domisili = String(values.domisili ?? '').trim()
  if (!domisili) {
    errors.domisili = 'Domisili wajib diisi.'
  } else if (domisili.length < 3) {
    errors.domisili = 'Domisili minimal 3 karakter.'
  }

  const target = String(values.target ?? '').trim()
  if (!target) {
    errors.target = 'Pilih program target terlebih dahulu.'
  }

  if (!values.agree) {
    errors.agree = 'Mohon beri persetujuan untuk melanjutkan.'
  }

  return errors
}
