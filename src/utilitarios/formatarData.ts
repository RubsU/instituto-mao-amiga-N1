// Transforma a data ISO guardada (ex.: 2026-10-04T17:30:00.000Z) em texto legível: 04/10/2026 às 14:30
export function formatarData(iso: string): string {
  const data = new Date(iso);
  if (isNaN(data.getTime())) {
    return 'Data indisponível';
  }
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
}
