import { memo } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Doacao } from '../dados/doacoesStorage';
import { formatarData } from '../utilitarios/formatarData';

type Props = {
  doacao: Doacao;
  onPress: (doacao: Doacao) => void;
};

// Só desenha o que recebe por prop. Com React.memo, o item só é redesenhado quando a doação
// ou o onPress mudam: ao digitar no filtro, os itens que continuam na lista não são refeitos.
function DoacaoItemBase({ doacao, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.item} onPress={() => onPress(doacao)}>
      <Text style={styles.titulo}>
        {doacao.quantidade} × {doacao.tipoItem}
      </Text>
      <Text style={styles.destino}>Destino: {doacao.pontoDestino}</Text>
      <Text style={styles.data}>{formatarData(doacao.criadoEm)}</Text>
    </TouchableOpacity>
  );
}

const DoacaoItem = memo(DoacaoItemBase);

export default DoacaoItem;

const styles = StyleSheet.create({
  item: {
    minHeight: 44,
    paddingVertical: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  titulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  destino: {
    fontSize: 14,
    color: '#333333',
    marginTop: 4,
  },
  data: {
    fontSize: 13,
    color: '#757575',
    marginTop: 4,
  },
});
