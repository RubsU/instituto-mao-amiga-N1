import { ScrollView, View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { pontosMock } from '../dados/pontos';
import type { Ponto } from '../dados/pontos';
import type { RootStackParamList } from '../navegacao/tipos';

// DetalhePonto só lê o ponto que recebe por prop — não sabe nada sobre navegação
function DetalhePonto({ ponto }: { ponto: Ponto }) {
  return (
    // ScrollView: em tela pequena ou na horizontal, o texto longo continua alcançável
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.nome}>{ponto.nome}</Text>

      <Text style={styles.rotulo}>Endereço</Text>
      <Text style={styles.valor}>{ponto.endereco}</Text>

      <Text style={styles.rotulo}>Dias e horários</Text>
      <Text style={styles.valor}>{ponto.diasHorarios}</Text>

      <Text style={styles.rotulo}>O que recebe / distribui</Text>
      <Text style={styles.valor}>{ponto.recebeDistribui}</Text>
    </ScrollView>
  );
}

// route.params só chega aqui (componente montado pelo Stack); o DetalhePonto recebe o ponto por prop
export default function TelaDetalhePonto({
  route,
}: NativeStackScreenProps<RootStackParamList, 'DetalhePonto'>) {
  const { pontoId } = route.params;
  const ponto = pontosMock.find((p) => p.id === pontoId);

  if (!ponto) {
    return (
      <View style={[styles.container, styles.conteudo]}>
        <Text style={styles.valor}>Ponto não encontrado.</Text>
      </View>
    );
  }

  return <DetalhePonto ponto={ponto} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  conteudo: {
    padding: 20,
  },
  nome: {
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
});
