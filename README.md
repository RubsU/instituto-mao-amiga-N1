# Instituto Mão Amiga

App mobile (React Native + Expo + TypeScript) para o Instituto Mão Amiga, uma ONG de banco de alimentos comunitário: mostra os pontos de coleta/distribuição e guarda o histórico de doações registradas, para o Instituto parar de depender de planilha e papel.

## Como rodar

```
npm install
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage
npx expo start
```

Abra no celular pelo Expo Go.

## O que o app faz

- Lista de pontos de coleta/distribuição (`FlatList`) e detalhe de cada ponto.
- Cadastro de doação (tipo do item, quantidade, ponto de destino) com validação.
- Histórico "Minhas doações": ver, filtrar por tipo, editar e excluir, com resumo de totais por tipo.
- Tudo fica salvo no aparelho (AsyncStorage) e continua lá ao fechar e reabrir o app.

## Roteiro de demonstração (até 3 minutos)

1. **Tela inicial (0:00):** mostrar a lista de pontos e abrir o detalhe de um ponto.
2. **Registrar (0:25):** tocar em "Registrar doação". Digitar `abc` na quantidade e registrar para mostrar o erro. Corrigir, escolher o ponto e registrar. Registrar mais duas doações (por exemplo, duas de "Roupa") para ter dados.
3. **Ver o histórico (1:00):** abrir "Minhas doações". Mostrar o resumo com os totais por tipo e os itens com data.
4. **Filtrar (1:25):** digitar `rou` e mostrar só as roupas. Digitar um texto sem resultado e mostrar a mensagem. Apagar o texto para voltar a lista completa.
5. **Editar (1:45):** abrir uma doação, tocar em "Editar doação", mudar a quantidade e salvar. Mostrar o novo valor no detalhe, no histórico e no resumo.
6. **Excluir (2:15):** tocar em "Excluir doação", escolher "Cancelar" (nada acontece) e depois "Excluir" e confirmar. A doação some da lista e do resumo.
7. **Fechar e reabrir (2:40):** fechar o app de verdade, reabrir e mostrar que o histórico continua lá.

## Decisões técnicas da semana

- **Acesso ao armazenamento em um arquivo só** (`src/dados/doacoesStorage.ts`): nenhuma tela chama o AsyncStorage. Se o Instituto trocar o armazenamento local por um servidor, só esse arquivo muda.
- **Totais calculados, não salvos:** o resumo é recalculado a partir do array de doações a cada renderização. Assim ele nunca fica diferente do que está registrado, mesmo depois de editar ou excluir.
- **Filtro derivado, sem segunda lista:** o único estado do filtro é o texto digitado. A lista filtrada é calculada a partir dele e do array completo.
- **`React.memo` no item do histórico:** ao digitar no filtro, os itens que continuam na lista não são redesenhados. O `onPress` passado ao item usa `useCallback` para a memoização funcionar.
- **Telas releem o armazenamento ao ganhar foco** (`useFocusEffect`): o histórico e o detalhe mostram registros novos, valores editados e exclusões sem precisar fechar o app.
- **Um formulário para cadastrar e editar:** o mesmo componente recebe a doação por `route.params` quando é edição, então as validações são idênticas.
