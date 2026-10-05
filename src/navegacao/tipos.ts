import type { Doacao } from '../dados/doacoesStorage';

// Mapa das telas do Stack e dos parâmetros que cada uma recebe.
export type RootStackParamList = {
  ListaPontos: undefined;
  DetalhePonto: { pontoId: string };
  // Sem parâmetro = cadastro novo; com `doacao` = edição da doação recebida
  CadastroDoacao: { doacao?: Doacao } | undefined;
  HistoricoDoacoes: undefined;
  DetalheDoacao: { doacao: Doacao };
};
