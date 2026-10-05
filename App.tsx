import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import TelaListaPontos from './src/telas/TelaListaPontos';
import TelaDetalhePonto from './src/telas/TelaDetalhePonto';
import TelaCadastroDoacao from './src/telas/TelaCadastroDoacao';
import TelaHistoricoDoacoes from './src/telas/TelaHistoricoDoacoes';
import TelaDetalheDoacao from './src/telas/TelaDetalheDoacao';
import type { RootStackParamList } from './src/navegacao/tipos';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="ListaPontos">
        <Stack.Screen
          name="ListaPontos"
          component={TelaListaPontos}
          options={{ title: 'Pontos de coleta' }}
        />
        <Stack.Screen
          name="DetalhePonto"
          component={TelaDetalhePonto}
          options={{ title: 'Detalhe do ponto' }}
        />
        <Stack.Screen
          name="CadastroDoacao"
          component={TelaCadastroDoacao}
          // O mesmo formulário serve para cadastrar e para editar: o título deixa claro qual dos dois é
          options={({ route }) => ({
            title: route.params?.doacao ? 'Editar doação' : 'Registrar doação',
          })}
        />
        <Stack.Screen
          name="HistoricoDoacoes"
          component={TelaHistoricoDoacoes}
          options={{ title: 'Minhas doações' }}
        />
        <Stack.Screen
          name="DetalheDoacao"
          component={TelaDetalheDoacao}
          options={{ title: 'Detalhe da doação' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
