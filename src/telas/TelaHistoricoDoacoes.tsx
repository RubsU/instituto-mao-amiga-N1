import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { listarDoacoes } from '../dados/doacoesStorage';
import type { Doacao } from '../dados/doacoesStorage';
import DoacaoItem from '../componentes/DoacaoItem';
import ResumoDoacoes from '../componentes/ResumoDoacoes';
import type { RootStackParamList } from '../navegacao/tipos';

type Props = NativeStackScreenProps<RootStackParamList, 'HistoricoDoacoes'>;

export default function TelaHistoricoDoacoes({ navigation }: Props) {
  // Lista completa vinda do armazenamento + texto do filtro: os dois únicos estados da tela
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');

  // Sempre que a tela ganha foco (inclusive ao voltar do cadastro, da edição ou da exclusão),
  // relê o histórico do armazenamento: assim as mudanças aparecem sem fechar o app
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      listarDoacoes().then((lista) => {
        if (ativo) {
          setDoacoes(lista);
          setCarregando(false);
        }
      });
      return () => {
        ativo = false;
      };
    }, [])
  );

  // A lista filtrada é CALCULADA a partir do array completo e do texto digitado,
  // sem guardar uma segunda cópia da lista em outro estado. Mais recentes primeiro.
  const doacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const ordenadas = [...doacoes].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
    if (termo === '') {
      return ordenadas;
    }
    return ordenadas.filter((doacao) => doacao.tipoItem.toLowerCase().includes(termo));
  }, [doacoes, busca]);

  // Função estável (useCallback) para o React.memo do item funcionar de verdade
  const abrirDetalhe = useCallback(
    (doacao: Doacao) => navigation.push('DetalheDoacao', { doacao }),
    [navigation]
  );

  function renderizarVazio() {
    if (carregando) {
      return <Text style={styles.mensagem}>Carregando doações...</Text>;
    }
    if (doacoes.length === 0) {
      return (
        <View style={styles.vazio}>
          <Text style={styles.mensagem}>Você ainda não registrou nenhuma doação.</Text>
          <TouchableOpacity
            style={styles.botao}
            onPress={() => navigation.navigate('CadastroDoacao')}
          >
            <Text style={styles.botaoTexto}>Registrar primeira doação</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <Text style={styles.mensagem}>
        Nenhuma doação encontrada para "{busca.trim()}".
      </Text>
    );
  }

  return (
    // SafeAreaView sem 'top': o cabeçalho de navegação já cobre essa área
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* O teclado aberto empurra campo e lista para cima, sem cobrir nenhum dos dois */}
      <KeyboardAvoidingView
        style={styles.teclado}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.busca}>
          <TextInput
            style={styles.input}
            placeholder="Filtrar por tipo de item (ex.: roupa)"
            value={busca}
            onChangeText={setBusca}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>

        <FlatList
          style={styles.lista}
          contentContainerStyle={styles.conteudo}
          data={doacoesFiltradas}
          keyExtractor={(doacao) => doacao.id}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            carregando ? null : <ResumoDoacoes doacoes={doacoes} />
          }
          ListEmptyComponent={renderizarVazio()}
          renderItem={({ item }) => <DoacaoItem doacao={item} onPress={abrirDetalhe} />}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  teclado: {
    flex: 1,
  },
  busca: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  lista: {
    flex: 1,
  },
  conteudo: {
    padding: 20,
  },
  vazio: {
    gap: 16,
  },
  mensagem: {
    fontSize: 15,
    color: '#555555',
  },
  botao: {
    backgroundColor: '#2E7D32',
    padding: 14,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
