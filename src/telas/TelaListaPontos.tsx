import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { pontosMock } from '../dados/pontos';
import type { Ponto } from '../dados/pontos';
import type { RootStackParamList } from '../navegacao/tipos';

// PontoItem só desenha o que recebe por prop e avisa quando é tocado (onPress)
function PontoItem({ ponto, onPress }: { ponto: Ponto; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View>
        <Text style={styles.nome}>{ponto.nome}</Text>
        <Text style={styles.endereco}>{ponto.endereco}</Text>
        <Text style={styles.horario}>{ponto.diasHorarios}</Text>
      </View>
    </TouchableOpacity>
  );
}

// "navigation" chega como prop porque o Stack.Navigator montou esta tela
export default function TelaListaPontos({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'ListaPontos'>) {
  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      data={pontosMock}
      keyExtractor={(ponto) => ponto.id}
      ListHeaderComponent={
        <View style={styles.acoes}>
          <TouchableOpacity
            style={styles.botao}
            onPress={() => navigation.navigate('CadastroDoacao')}
          >
            <Text style={styles.botaoTexto}>Registrar doação</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.botaoSecundario}
            onPress={() => navigation.navigate('HistoricoDoacoes')}
          >
            <Text style={styles.botaoSecundarioTexto}>Minhas doações</Text>
          </TouchableOpacity>
        </View>
      }
      renderItem={({ item }) => (
        <PontoItem
          ponto={item}
          onPress={() => navigation.navigate('DetalhePonto', { pontoId: item.id })}
        />
      )}
    />
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
  acoes: {
    gap: 12,
    marginBottom: 20,
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
  botaoSecundario: {
    borderWidth: 1,
    borderColor: '#2E7D32',
    padding: 14,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoSecundarioTexto: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    minHeight: 44,
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  endereco: {
    fontSize: 14,
    color: '#555555',
    marginTop: 4,
  },
  horario: {
    fontSize: 13,
    color: '#2E7D32',
    marginTop: 4,
  },
});
