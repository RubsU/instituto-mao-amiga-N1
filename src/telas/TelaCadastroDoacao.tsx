import { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pontosMock } from '../dados/pontos';
import { atualizarDoacao, salvarDoacao } from '../dados/doacoesStorage';
import type { RootStackParamList } from '../navegacao/tipos';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroDoacao'>;

// Um campo de erro por campo do formulário (undefined = sem erro)
type Erros = {
  tipoItem?: string;
  quantidade?: string;
  pontoDestino?: string;
};

// O mesmo formulário serve para cadastrar (sem parâmetro) e para editar (com `doacao` em route.params)
export default function TelaCadastroDoacao({ navigation, route }: Props) {
  const doacaoEmEdicao = route.params?.doacao;

  // Campos controlados: o valor mostrado vem do estado (já preenchido quando é edição)
  const [tipoItem, setTipoItem] = useState(doacaoEmEdicao?.tipoItem ?? '');
  const [quantidade, setQuantidade] = useState(
    doacaoEmEdicao ? String(doacaoEmEdicao.quantidade) : ''
  );
  const [pontoDestino, setPontoDestino] = useState<string | null>(
    doacaoEmEdicao?.pontoDestino ?? null
  );
  const [erros, setErros] = useState<Erros>({});
  const [erroSalvar, setErroSalvar] = useState('');
  const [sucesso, setSucesso] = useState('');
  const inputQuantidadeRef = useRef<TextInput>(null);

  async function validarESalvar() {
    const novosErros: Erros = {};

    if (tipoItem.trim() === '') {
      novosErros.tipoItem = 'Informe o tipo do item (ex.: arroz, agasalho).';
    }

    // Só aceita dígitos (rejeita letras, vírgula, sinal) e valor maior que zero
    const qtd = quantidade.trim();
    if (!/^\d+$/.test(qtd) || Number(qtd) <= 0) {
      novosErros.quantidade =
        'A quantidade precisa ser um número maior que zero (ex.: 5).';
    }

    if (pontoDestino === null) {
      novosErros.pontoDestino = 'Escolha o ponto de destino.';
    }

    setErroSalvar('');
    setSucesso('');

    // Se houve erro, mostra as mensagens e para, sem apagar o que já foi digitado
    if (Object.keys(novosErros).length > 0 || pontoDestino === null) {
      setErros(novosErros);
      return;
    }
    setErros({});

    const dados = {
      tipoItem: tipoItem.trim(),
      quantidade: Number(qtd),
      pontoDestino,
    };

    try {
      if (doacaoEmEdicao) {
        // Edição: mesmo id, sem duplicar; depois volta para o detalhe
        await atualizarDoacao({ ...doacaoEmEdicao, ...dados });
        navigation.goBack();
        return;
      }

      // Cadastro novo: acrescenta ao histórico
      const nova = await salvarDoacao(dados);
      setSucesso(
        `Doação registrada: ${nova.quantidade} × ${nova.tipoItem} para ${nova.pontoDestino}.`
      );
      setTipoItem('');
      setQuantidade('');
      setPontoDestino(null);
      Keyboard.dismiss();
    } catch {
      // Se o salvamento falhar, avisa e mantém o formulário preenchido
      setErroSalvar('Não foi possível salvar a doação. Tente de novo.');
    }
  }

  return (
    // SafeAreaView sem 'top': o cabeçalho de navegação já cobre essa área
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      {/* KeyboardAvoidingView empurra o conteúdo para cima quando o teclado abre */}
      <KeyboardAvoidingView
        style={styles.teclado}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.rolagem}
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.rotulo}>Tipo do item</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: arroz, agasalho, cobertor"
            value={tipoItem}
            onChangeText={setTipoItem}
            returnKeyType="next"
            onSubmitEditing={() => inputQuantidadeRef.current?.focus()}
          />
          {erros.tipoItem !== undefined && (
            <Text style={styles.erro}>{erros.tipoItem}</Text>
          )}

          <Text style={styles.rotulo}>Quantidade</Text>
          <TextInput
            ref={inputQuantidadeRef}
            style={styles.input}
            placeholder="Ex.: 5"
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="number-pad"
            returnKeyType="done"
          />
          {erros.quantidade !== undefined && (
            <Text style={styles.erro}>{erros.quantidade}</Text>
          )}

          <Text style={styles.rotulo}>Ponto de destino</Text>
          {pontosMock.map((ponto) => (
            <TouchableOpacity
              key={ponto.id}
              style={[
                styles.opcao,
                pontoDestino === ponto.nome && styles.opcaoSelecionada,
              ]}
              onPress={() => setPontoDestino(ponto.nome)}
            >
              <Text
                style={[
                  styles.opcaoTexto,
                  pontoDestino === ponto.nome && styles.opcaoTextoSelecionado,
                ]}
              >
                {ponto.nome}
              </Text>
            </TouchableOpacity>
          ))}
          {erros.pontoDestino !== undefined && (
            <Text style={styles.erro}>{erros.pontoDestino}</Text>
          )}

          <TouchableOpacity style={styles.botao} onPress={validarESalvar}>
            <Text style={styles.botaoTexto}>
              {doacaoEmEdicao ? 'Salvar alterações' : 'Registrar doação'}
            </Text>
          </TouchableOpacity>

          {doacaoEmEdicao && (
            // Cancelar volta sem alterar nada
            <TouchableOpacity
              style={styles.botaoSecundario}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.botaoSecundarioTexto}>Cancelar</Text>
            </TouchableOpacity>
          )}

          {erroSalvar !== '' && <Text style={styles.erro}>{erroSalvar}</Text>}

          {sucesso !== '' && (
            <>
              <Text style={styles.sucesso}>{sucesso}</Text>
              <TouchableOpacity
                style={styles.botaoSecundario}
                onPress={() => navigation.navigate('HistoricoDoacoes')}
              >
                <Text style={styles.botaoSecundarioTexto}>Ver minhas doações</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
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
  rolagem: {
    flex: 1,
  },
  conteudo: {
    padding: 20,
    gap: 8,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginTop: 8,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  opcao: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  opcaoSelecionada: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  opcaoTexto: {
    fontSize: 15,
    color: '#333333',
  },
  opcaoTextoSelecionado: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  erro: {
    color: '#C62828',
    fontSize: 13,
  },
  botao: {
    backgroundColor: '#2E7D32',
    padding: 14,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
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
  sucesso: {
    color: '#2E7D32',
    fontSize: 14,
    marginTop: 8,
  },
});
