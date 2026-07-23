// Catálogo padrão de alimentos comuns do dia a dia, com valores por 100g.
// Somente leitura (isLibrary: true) — o usuário pode complementar com alimentos
// próprios (ver AppDataContext). Valores aproximados de tabelas nutricionais
// (TACO/USDA); para preparos "cozido/grelhado" quando aplicável.

export const FOOD_CATEGORIES = [
  { key: 'proteina', label: 'Proteínas' },
  { key: 'carboidrato', label: 'Carboidratos' },
  { key: 'fruta', label: 'Frutas' },
  { key: 'laticinio', label: 'Laticínios' },
  { key: 'gordura', label: 'Gorduras e oleaginosas' },
  { key: 'legume', label: 'Legumes e verduras' },
];

// p100 = por 100g | portion = porção padrão sugerida em gramas
function f(id, name, category, cal, protein, carbs, fat, portion) {
  return {
    id: `food-lib-${id}`,
    name,
    category,
    caloriesPer100: cal,
    proteinPer100: protein,
    carbsPer100: carbs,
    fatPer100: fat,
    defaultPortionGrams: portion,
    isLibrary: true,
  };
}

export const FOOD_LIBRARY = [
  // Proteínas
  f('frango-grelhado', 'Peito de frango grelhado', 'proteina', 165, 31, 0, 3.6, 120),
  f('coxa-frango', 'Coxa de frango (sem pele)', 'proteina', 209, 26, 0, 11, 120),
  f('patinho-cozido', 'Patinho (carne magra) cozido', 'proteina', 187, 30, 0, 7, 120),
  f('carne-moida', 'Carne moída (patinho)', 'proteina', 212, 26, 0, 12, 120),
  f('file-mignon', 'Filé mignon grelhado', 'proteina', 200, 29, 0, 9, 120),
  f('lombo-porco', 'Lombo de porco assado', 'proteina', 143, 26, 0, 3.5, 120),
  f('tilapia', 'Tilápia grelhada', 'proteina', 128, 26, 0, 2.7, 120),
  f('salmao', 'Salmão grelhado', 'proteina', 208, 20, 0, 13, 120),
  f('atum-agua', 'Atum em água (lata)', 'proteina', 116, 26, 0, 1, 100),
  f('sardinha', 'Sardinha', 'proteina', 208, 25, 0, 11, 100),
  f('ovo-cozido', 'Ovo cozido', 'proteina', 155, 13, 1.1, 11, 50),
  f('clara-ovo', 'Clara de ovo', 'proteina', 52, 11, 0.7, 0.2, 35),
  f('whey', 'Whey protein (pó)', 'proteina', 400, 80, 8, 6, 30),

  // Carboidratos
  f('arroz-branco', 'Arroz branco cozido', 'carboidrato', 130, 2.4, 28, 0.3, 150),
  f('arroz-integral', 'Arroz integral cozido', 'carboidrato', 112, 2.6, 24, 0.9, 150),
  f('feijao-carioca', 'Feijão carioca cozido', 'carboidrato', 76, 4.8, 13.6, 0.5, 100),
  f('feijao-preto', 'Feijão preto cozido', 'carboidrato', 77, 4.5, 14, 0.5, 100),
  f('batata', 'Batata cozida', 'carboidrato', 86, 1.7, 20, 0.1, 150),
  f('batata-doce', 'Batata doce cozida', 'carboidrato', 90, 1.6, 21, 0.1, 150),
  f('mandioca', 'Mandioca cozida', 'carboidrato', 125, 0.6, 30, 0.3, 150),
  f('macarrao', 'Macarrão cozido', 'carboidrato', 158, 5.8, 31, 0.9, 150),
  f('pao-frances', 'Pão francês', 'carboidrato', 300, 8, 58, 3.1, 50),
  f('pao-integral', 'Pão de forma integral', 'carboidrato', 250, 9, 43, 4, 50),
  f('aveia', 'Aveia em flocos', 'carboidrato', 389, 17, 66, 7, 40),
  f('tapioca', 'Tapioca (goma)', 'carboidrato', 240, 0.5, 60, 0.2, 50),
  f('cuscuz', 'Cuscuz de milho cozido', 'carboidrato', 112, 3.6, 23, 0.6, 150),
  f('granola', 'Granola', 'carboidrato', 471, 10, 64, 20, 40),

  // Frutas
  f('banana', 'Banana', 'fruta', 89, 1.1, 23, 0.3, 100),
  f('maca', 'Maçã', 'fruta', 52, 0.3, 14, 0.2, 130),
  f('laranja', 'Laranja', 'fruta', 47, 0.9, 12, 0.1, 130),
  f('mamao', 'Mamão', 'fruta', 43, 0.5, 11, 0.3, 150),
  f('manga', 'Manga', 'fruta', 60, 0.8, 15, 0.4, 120),
  f('morango', 'Morango', 'fruta', 32, 0.7, 7.7, 0.3, 100),
  f('abacate', 'Abacate', 'fruta', 160, 2, 9, 15, 100),
  f('uva', 'Uva', 'fruta', 69, 0.7, 18, 0.2, 100),
  f('melancia', 'Melancia', 'fruta', 30, 0.6, 8, 0.2, 150),
  f('abacaxi', 'Abacaxi', 'fruta', 50, 0.5, 13, 0.1, 120),

  // Laticínios
  f('leite-integral', 'Leite integral', 'laticinio', 61, 3.2, 4.8, 3.3, 200),
  f('leite-desnatado', 'Leite desnatado', 'laticinio', 35, 3.4, 5, 0.1, 200),
  f('iogurte-natural', 'Iogurte natural integral', 'laticinio', 61, 3.5, 4.7, 3.3, 170),
  f('iogurte-desnatado', 'Iogurte natural desnatado', 'laticinio', 41, 4.1, 5.9, 0.2, 170),
  f('queijo-minas', 'Queijo minas frescal', 'laticinio', 264, 17, 3, 20, 30),
  f('queijo-mussarela', 'Queijo mussarela', 'laticinio', 300, 22, 2.2, 22, 30),
  f('requeijao', 'Requeijão cremoso', 'laticinio', 257, 10, 4, 23, 30),
  f('cottage', 'Queijo cottage', 'laticinio', 98, 11, 3.4, 4.3, 50),

  // Gorduras e oleaginosas
  f('azeite', 'Azeite de oliva', 'gordura', 884, 0, 0, 100, 10),
  f('amendoim', 'Amendoim', 'gordura', 567, 26, 16, 49, 30),
  f('pasta-amendoim', 'Pasta de amendoim', 'gordura', 588, 25, 20, 50, 20),
  f('castanha-caju', 'Castanha de caju', 'gordura', 553, 18, 30, 44, 30),
  f('castanha-para', 'Castanha do Pará', 'gordura', 656, 14, 12, 66, 20),
  f('amendoas', 'Amêndoas', 'gordura', 579, 21, 22, 50, 30),

  // Legumes e verduras
  f('brocolis', 'Brócolis cozido', 'legume', 35, 2.4, 7, 0.4, 100),
  f('cenoura', 'Cenoura crua', 'legume', 41, 0.9, 10, 0.2, 100),
  f('tomate', 'Tomate', 'legume', 18, 0.9, 3.9, 0.2, 100),
  f('alface', 'Alface', 'legume', 15, 1.4, 2.9, 0.2, 50),
  f('abobrinha', 'Abobrinha cozida', 'legume', 17, 1.2, 3.1, 0.3, 100),
  f('espinafre', 'Espinafre cozido', 'legume', 23, 2.9, 3.8, 0.4, 100),
];

export function getFoodCategoryLabel(key) {
  return FOOD_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}
