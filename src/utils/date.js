export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDateBR(isoDate) {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function daysAgoISO(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function addDaysISO(isoDate, days) {
  const d = new Date(`${isoDate}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ISO (AAAA-MM-DD) -> BR (DD/MM/AAAA) para exibição.
export function isoToBR(isoDate) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return '';
  return `${day}/${month}/${year}`;
}

// BR (DD/MM/AAAA) -> ISO (AAAA-MM-DD). Retorna null se a data for inválida.
export function brToISO(brDate) {
  if (!brDate) return null;
  const match = brDate.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const iso = `${year}-${month}-${day}`;
  // Valida uma data real (rejeita 31/02, 00/00 etc.)
  const parsed = new Date(`${iso}T00:00:00`);
  if (
    parsed.getFullYear() !== Number(year) ||
    parsed.getMonth() + 1 !== Number(month) ||
    parsed.getDate() !== Number(day)
  ) {
    return null;
  }
  return iso;
}

// Máscara progressiva: usuário digita só números e as barras entram sozinhas.
export function maskDateBR(text) {
  const digits = String(text).replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 2)];
  if (digits.length > 2) parts.push(digits.slice(2, 4));
  if (digits.length > 4) parts.push(digits.slice(4, 8));
  return parts.join('/');
}

export function ageFromBirthDate(isoBirthDate) {
  if (!isoBirthDate) return null;
  const birth = new Date(`${isoBirthDate}T00:00:00`);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}
