import Papa from 'papaparse';

// Charge un CSV depuis /data et retourne un objet indexé par id de nœud
export async function loadTree(csvPath) {
  const response = await fetch(csvPath);
  if (!response.ok) {
    throw new Error(`Impossible de charger le CSV : ${csvPath}`);
  }
  const csvText = await response.text();

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length) {
    console.warn('Erreurs de parsing CSV :', parsed.errors);
  }

  const tree = {};
  for (const row of parsed.data) {
    const boutons = [];
    for (let i = 1; i <= 4; i++) {
      const label = row[`bouton${i}_label`];
      const suivant = row[`bouton${i}_suivant`];
      if (label && label.trim() !== '' && suivant && suivant.trim() !== '') {
        boutons.push({ label: label.trim(), suivant: suivant.trim() });
      }
    }
    tree[row.id] = {
      id: row.id,
      type: row.type,
      texte: row.texte,
      categorie: row.categorie || null,
      boutons,
    };
  }
  return tree;
}
