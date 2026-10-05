import { View, Text, StyleSheet } from 'react-native';
import type { Doacao } from '../dados/doacoesStorage';

type TotalPorTipo = {
  chave: string;
  rotulo: string;
  quantidade: number;
  doacoes: number;
};

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function plural(quantidade: number, singular: string, pluralDaPalavra: string): string {
  return quantidade === 1 ? singular : pluralDaPalavra;
}

// Agrupa por tipo (sem diferenciar maiúsculas de minúsculas), soma as quantidades
// e ordena do tipo com maior quantidade para o menor
function calcularTotais(doacoes: Doacao[]): TotalPorTipo[] {
  const porTipo = new Map<string, TotalPorTipo>();

  for (const doacao of doacoes) {
    const chave = doacao.tipoItem.trim().toLowerCase();
    const atual = porTipo.get(chave);
    if (atual) {
      atual.quantidade += doacao.quantidade;
      atual.doacoes += 1;
    } else {
      porTipo.set(chave, {
        chave,
        rotulo: capitalizar(doacao.tipoItem.trim()),
        quantidade: doacao.quantidade,
        doacoes: 1,
      });
    }
  }

  return Array.from(porTipo.values()).sort((a, b) => b.quantidade - a.quantidade);
}

// Os totais NÃO são salvos: são recalculados a partir do array de doações a cada renderização,
// então sempre acompanham o que foi registrado, editado ou excluído.
export default function ResumoDoacoes({ doacoes }: { doacoes: Doacao[] }) {
  const totais = calcularTotais(doacoes);

  return (
    <View style={styles.cartao}>
      <Text style={styles.titulo}>Resumo das doações</Text>

      {doacoes.length === 0 ? (
        <Text style={styles.vazio}>Ainda não há doações registradas para resumir.</Text>
      ) : (
        <>
          <Text style={styles.total}>
            Total: {doacoes.length} {plural(doacoes.length, 'doação', 'doações')}
          </Text>
          {totais.map((total) => (
            <Text key={total.chave} style={styles.linha}>
              {total.rotulo}: {total.quantidade}{' '}
              {plural(total.quantidade, 'unidade', 'unidades')} em {total.doacoes}{' '}
              {plural(total.doacoes, 'doação', 'doações')}
            </Text>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    gap: 4,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  total: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginTop: 4,
  },
  linha: {
    fontSize: 15,
    color: '#333333',
  },
  vazio: {
    fontSize: 14,
    color: '#555555',
  },
});
