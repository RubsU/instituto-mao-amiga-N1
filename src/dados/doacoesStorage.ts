import AsyncStorage from '@react-native-async-storage/async-storage';

// Formato de cada doação do histórico
export type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string; // nome do ponto de coleta/distribuição
  criadoEm: string; // data e hora do registro, em formato ISO
};

// O que o formulário informa; o id e o criadoEm são gerados aqui, no momento de salvar
export type DadosDoacao = Omit<Doacao, 'id' | 'criadoEm'>;

// Chave própria do projeto no AsyncStorage (guarda o array com TODAS as doações)
const CHAVE_DOACOES = '@instituto_mao_amiga:doacoes';

// Todo o acesso ao AsyncStorage para doações fica concentrado neste arquivo:
// nenhuma tela chama o AsyncStorage diretamente.

async function gravarLista(lista: Doacao[]): Promise<void> {
  // O AsyncStorage só guarda texto, por isso o JSON.stringify
  await AsyncStorage.setItem(CHAVE_DOACOES, JSON.stringify(lista));
}

function gerarId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Lê o histórico completo; devolve [] se nunca foi salva nenhuma doação (ou se o dado estiver corrompido)
export async function listarDoacoes(): Promise<Doacao[]> {
  const salvo = await AsyncStorage.getItem(CHAVE_DOACOES);
  if (salvo === null) {
    return [];
  }
  try {
    const lista: unknown = JSON.parse(salvo);
    return Array.isArray(lista) ? (lista as Doacao[]) : [];
  } catch {
    return [];
  }
}

// Acrescenta uma doação nova ao array, sem sobrescrever as anteriores
export async function salvarDoacao(dados: DadosDoacao): Promise<Doacao> {
  const lista = await listarDoacoes();
  const nova: Doacao = {
    id: gerarId(),
    criadoEm: new Date().toISOString(),
    ...dados,
  };
  await gravarLista([...lista, nova]);
  return nova;
}

export async function buscarDoacao(id: string): Promise<Doacao | undefined> {
  const lista = await listarDoacoes();
  return lista.find((doacao) => doacao.id === id);
}

// Substitui a doação que tem o mesmo id (não duplica)
export async function atualizarDoacao(doacao: Doacao): Promise<void> {
  const lista = await listarDoacoes();
  await gravarLista(lista.map((item) => (item.id === doacao.id ? doacao : item)));
}

export async function excluirDoacao(id: string): Promise<void> {
  const lista = await listarDoacoes();
  await gravarLista(lista.filter((doacao) => doacao.id !== id));
}
