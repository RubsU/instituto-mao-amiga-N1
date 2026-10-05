import { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { buscarDoacao, excluirDoacao } from '../dados/doacoesStorage';
import type { Doacao } from '../dados/doacoesStorage';
import { formatarData } from '../utilitarios/formatarData';
import type { RootStackParamList } from '../navegacao/tipos';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheDoacao'>;

export default function TelaDetalheDoacao({ navigation, route }: Props) {
  // A doação chega por route.params; vira estado só para poder ser atualizada depois de uma edição
  const [doacao, setDoacao] = useState<Doacao>(route.params.doacao);
  const [erro, setErro] = useState('');
  const idDaDoacao = route.params.doacao.id;

  // Ao voltar da edição, relê a doação do armazenamento para mostrar os valores novos
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      buscarDoacao(idDaDoacao).then((atual) => {
        if (ativo && atual) {
          setDoacao(atual);
        }
      });
      return () => {
        ativo = false;
      };
    }, [idDaDoacao])
  );

  async function excluir() {
    try {
      await excluirDoacao(doacao.id);
      navigation.goBack(); // o histórico relê o armazenamento ao ganhar foco e a doação some da lista
    } catch {
      setErro('Não foi possível excluir a doação. Tente de novo.');
    }
  }

  function confirmarExclusao() {
    setErro('');
    Alert.alert(
      'Excluir doação',
      'Tem certeza que deseja excluir esta doação? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' }, // não faz nada
        { text: 'Excluir', style: 'destructive', onPress: excluir },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>
          {doacao.quantidade} × {doacao.tipoItem}
        </Text>

        <Text style={styles.rotulo}>Tipo do item</Text>
        <Text style={styles.valor}>{doacao.tipoItem}</Text>

        <Text style={styles.rotulo}>Quantidade</Text>
        <Text style={styles.valor}>{doacao.quantidade}</Text>

        <Text style={styles.rotulo}>Ponto de destino</Text>
        <Text style={styles.valor}>{doacao.pontoDestino}</Text>

        <Text style={styles.rotulo}>Registrada em</Text>
        <Text style={styles.valor}>{formatarData(doacao.criadoEm)}</Text>

        <Text style={styles.rotulo}>Código do registro</Text>
        <Text style={styles.codigo}>{doacao.id}</Text>

        {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

        <TouchableOpacity
          style={styles.botaoEditar}
          // push abre uma nova instância do formulário, já preenchida com esta doação
          onPress={() => navigation.push('CadastroDoacao', { doacao })}
        >
          <Text style={styles.botaoTexto}>Editar doação</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
          <Text style={styles.botaoTexto}>Excluir doação</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  conteudo: {
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  rotulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 16,
  },
  valor: {
    fontSize: 16,
    color: '#333333',
    marginTop: 4,
  },
  codigo: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  erro: {
    color: '#C62828',
    fontSize: 13,
    marginTop: 16,
  },
  botaoEditar: {
    backgroundColor: '#2E7D32',
    padding: 14,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  botaoExcluir: {
    backgroundColor: '#C62828',
    padding: 14,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
