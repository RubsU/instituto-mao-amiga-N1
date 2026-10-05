// Tipo do ponto de coleta/distribuição (formato do dado que as telas recebem por prop)
export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  diasHorarios: string;
  recebeDistribui: string;
};

// Dados mockados (fixos no código por enquanto — persistência fica para outras sprints)
export const pontosMock: Ponto[] = [
  {
    id: '1',
    nome: 'Ponto Central',
    endereco: 'Rua das Palmeiras, 120 — Centro, Vale Verde/SP, CEP 12000-100',
    diasHorarios: 'Segunda a sexta, das 8h às 17h',
    recebeDistribui:
      'Recebe alimentos não perecíveis e roupas; distribui cestas básicas.',
  },
  {
    id: '2',
    nome: 'Ponto Vila Nova',
    endereco: 'Rua Cinco, 48 — Vila Nova, Vale Verde/SP, CEP 12000-220',
    diasHorarios: 'Terças e quintas, das 14h às 18h',
    recebeDistribui:
      'Recebe roupas e agasalhos; distribui roupas para famílias atendidas.',
  },
  {
    id: '3',
    nome: 'Ponto Feira do Produtor',
    endereco: 'Avenida Brasil, 900 — Jardim América, Vale Verde/SP, CEP 12000-340',
    diasHorarios: 'Sábados, das 7h às 12h',
    recebeDistribui:
      'Recebe frutas, verduras e legumes de feirantes; distribui hortifrúti fresco.',
  },
  {
    id: '4',
    nome: 'Ponto Comunitário São José',
    endereco: 'Travessa da Paz, 15 — Bairro São José, Vale Verde/SP, CEP 12000-450',
    diasHorarios: 'Quartas e sextas, das 9h às 16h',
    recebeDistribui:
      'Recebe doações de mercados e feiras; distribui alimentos e itens de higiene.',
  },
  {
    id: '5',
    nome: 'Ponto Escola Esperança',
    endereco: 'Rua dos Ipês, 305 — Jardim Esperança, Vale Verde/SP, CEP 12000-560',
    diasHorarios: 'Segundas e quartas, das 13h às 17h',
    recebeDistribui:
      'Recebe material escolar e roupas infantis; distribui kits escolares e roupas para crianças.',
  },
  {
    id: '6',
    nome: 'Ponto Mercado do Bairro',
    endereco: 'Avenida das Acácias, 1.250 — Parque Industrial, Vale Verde/SP, CEP 12000-670',
    diasHorarios: 'Terças a sábados, das 10h às 19h',
    recebeDistribui:
      'Recebe alimentos perto do vencimento doados pelo mercado; distribui cestas e refeições prontas.',
  },
  {
    id: '7',
    nome: 'Ponto Igreja Nossa Senhora',
    endereco: 'Praça da Matriz, 3 — Centro Histórico, Vale Verde/SP, CEP 12000-780',
    diasHorarios: 'Domingos, das 8h às 11h30',
    recebeDistribui:
      'Recebe cobertores e agasalhos; distribui cobertores e sopa para pessoas em situação de rua.',
  },
];
