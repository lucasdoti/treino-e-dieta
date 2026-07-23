// Remove acentos e caixa para buscas "sem frescura".
export function normalizeText(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}
