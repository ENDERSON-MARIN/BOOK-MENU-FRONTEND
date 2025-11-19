# Implementation Plan - Relatórios Administrativos

Este plano de implementação detalha as tarefas necessárias para desenvolver o módulo de Relatórios Administrativos no sistema de reservas de almoço corporativo. Cada tarefa é incremental e referencia os requisitos do documento de requirements.

---

## Phase 1: Fundação - Types, Schemas e Infraestrutura

- [x] 1. Criar types TypeScript para relatórios
  - Criar `src/_types/report.ts` com todos os types e interfaces
  - Definir `ReportType`, `ReportPeriod`, `ReportFilters`
  - Definir interfaces para dados de cada relatório: `ReservationReportData`, `PopularMenusReportData`, `ActiveUsersReportData`, `OperationalStatsReportData`, `WasteReportData`
  - _Requirements: 11.7_

- [x] 2. Instalar dependências necessárias
  - Instalar recharts: `npm install recharts`
  - Instalar react-pdf: `npm install @react-pdf/renderer`
  - Instalar file-saver: `npm install file-saver @types/file-saver`
  - Atualizar package.json
  - _Requirements: 7.1, 11.3_

- [x] 3. Criar utilitários para processamento de dados
  - Criar `src/_lib/report-utils.ts` com funções auxiliares
  - Implementar `calculateCancellationRate()`
  - Implementar `calculateAdherenceRate()`
  - Implementar `groupByDay()`, `groupByWeek()`
  - Implementar `maskCPF()` para proteção de dados
  - Implementar `formatReportDate()` usando dayjs
  - _Requirements: 2.4, 3.5, 4.5, 5.4, 6.3, 11.7_

- [x] 4. Criar hook customizado para filtros de período
  - Criar `src/_hooks/use-report-filters.ts`
  - Implementar lógica para períodos pré-definidos (última semana, mês, etc.)
  - Implementar validação de datas (data inicial não pode ser posterior à final)
  - Implementar limite máximo de 1 ano
  - _Requirements: 8.1, 8.2, 9.7_

---

## Phase 2: Services e Data Fetching

- [x] 5. Criar service de relatórios
  - Criar `src/_services/report.service.ts`
  - Implementar `getReservationsReport(filters)` que busca reservas e processa dados
  - Implementar `getPopularMenusReport(filters)` que busca reservas e cardápios
  - Implementar `getActiveUsersReport(filters)` que busca reservas e usuários
  - Implementar `getOperationalStatsReport(filters)` que busca todos os dados necessários
  - Implementar `getWasteReport(filters)` que busca reservas canceladas
  - _Requirements: 2.3, 3.2, 4.2, 5.2, 6.2, 11.6_

- [x] 6. Implementar funções de processamento de dados
  - Criar `src/_services/report-processors.ts`
  - Implementar `processReservationsData()` para agregar dados de reservas
  - Implementar `processPopularMenusData()` para ranking de cardápios
  - Implementar `processActiveUsersData()` para estatísticas de usuários
  - Implementar `processOperationalStatsData()` para métricas consolidadas
  - Implementar `processWasteData()` para análise de cancelamentos
  - _Requirements: 2.4, 3.3, 4.3, 5.3, 6.3_

- [x] 7. Criar hooks Tanstack Query para relatórios
  - Criar `src/_hooks/queries/use-get-reservations-report.ts`
  - Criar `src/_hooks/queries/use-get-popular-menus-report.ts`
  - Criar `src/_hooks/queries/use-get-active-users-report.ts`
  - Criar `src/_hooks/queries/use-get-operational-stats-report.ts`
  - Criar `src/_hooks/queries/use-get-waste-report.ts`
  - Configurar staleTime de 5 minutos e cacheTime de 10 minutos
  - _Requirements: 9.4, 11.5_

---

## Phase 3: Componentes de UI Reutilizáveis

- [x] 8. Criar componentes de gráficos reutilizáveis
  - Criar `src/_components/charts/line-chart.tsx` usando Recharts
  - Criar `src/_components/charts/bar-chart.tsx` com suporte a layout horizontal/vertical
  - Criar `src/_components/charts/pie-chart.tsx` com labels personalizados
  - Garantir responsividade com ResponsiveContainer
  - Aplicar cores da empresa (#1b994b, #e4e30d)
  - _Requirements: 2.5, 3.6, 4.6, 5.6, 6.6, 10.3_

- [x] 9. Criar componentes de cards de estatísticas
  - Criar `src/_components/reports/stat-card.tsx`
  - Suportar ícone, título, valor, tendência e descrição
  - Implementar indicadores visuais de tendência (↑/↓)
  - Aplicar cores apropriadas (verde para positivo, vermelho para negativo)
  - _Requirements: 2.4, 4.4, 5.3, 9.1_

- [x] 10. Criar componente de filtro de período
  - Criar `src/_components/reports/period-filter.tsx`
  - Implementar date pickers para data inicial e final
  - Adicionar botões para períodos pré-definidos
  - Validar datas em tempo real
  - Exibir mensagens de erro inline
  - _Requirements: 8.1, 8.2, 8.7, 9.5_

- [x] 11. Criar componentes de loading e empty states
  - Criar `src/_components/reports/report-stats-skeleton.tsx`
  - Criar `src/_components/reports/report-chart-skeleton.tsx`
  - Criar `src/_components/reports/report-table-skeleton.tsx`
  - Criar `src/_components/reports/empty-state.tsx` com ícone e ação
  - _Requirements: 9.1, 9.2, 9.5_

---

## Phase 4: Dashboard Principal de Relatórios

- [x] 12. Criar layout e rota principal de relatórios
  - Criar `src/app/(dashboard)/relatorios/layout.tsx` com ProtectedRoute para ADMIN
  - Criar `src/app/(dashboard)/relatorios/page.tsx` como dashboard principal
  - Adicionar item "Relatórios" na sidebar para administradores
  - _Requirements: 1.1, 1.2, 1.5, 11.1, 11.2_

- [x] 13. Criar componente de dashboard de relatórios
  - Criar `src/app/(dashboard)/relatorios/_components/reports-dashboard.tsx`
  - Criar `src/app/(dashboard)/relatorios/_components/report-card.tsx`
  - Implementar grid responsivo de cards (2 colunas em desktop, 1 em mobile)
  - Adicionar card para cada tipo de relatório com ícone, título e descrição
  - Implementar navegação para cada relatório
  - _Requirements: 1.1, 1.3, 1.4, 10.1_

---

## Phase 5: Relatório de Reservas por Período

- [x] 14. Criar página de relatório de reservas
  - Criar `src/app/(dashboard)/relatorios/reservas-periodo/page.tsx`
  - Implementar layout com filtros no topo e conteúdo abaixo
  - Adicionar botão "Exportar PDF" no header
  - _Requirements: 2.1, 7.1_

- [x] 15. Criar componente de filtros de reservas
  - Criar `src/app/(dashboard)/relatorios/reservas-periodo/_components/reservations-report-filters.tsx`
  - Reutilizar PeriodFilter
  - Adicionar filtros por status (CONFIRMED, CANCELLED, TODOS)
  - Adicionar filtro por tipo (Manual, Automática, TODAS)
  - Implementar validação com Zod
  - _Requirements: 2.1, 2.2, 8.3, 8.5, 8.6_

- [x] 16. Criar componente de estatísticas de reservas
  - Criar `src/app/(dashboard)/relatorios/reservas-periodo/_components/reservations-report-stats.tsx`
  - Exibir 4 cards: Total, Ativas, Canceladas, Taxa de Cancelamento
  - Usar StatCard component
  - Adicionar ícones apropriados (lucide-react)
  - _Requirements: 2.4_

- [x] 17. Criar componente de gráfico de reservas
  - Criar `src/app/(dashboard)/relatorios/reservas-periodo/_components/reservations-report-chart.tsx`
  - Usar LineChart com 3 linhas: total, confirmadas, canceladas
  - Exibir evolução diária no período
  - Adicionar tooltip com detalhes
  - _Requirements: 2.5_

- [x] 18. Criar componente de tabela de reservas
  - Criar `src/app/(dashboard)/relatorios/reservas-periodo/_components/reservations-report-table.tsx`
  - Implementar colunas: Data, Usuário (nome + CPF mascarado), Cardápio, Variação, Status, Tipo
  - Adicionar badge "Auto" para reservas automáticas
  - Implementar paginação (50 registros por página)
  - Ordenar por data decrescente
  - _Requirements: 2.6, 2.9_

- [x] 19. Criar seção de agrupamento semanal
  - Adicionar card mostrando totais por semana
  - Exibir semana (data início - data fim) e total de reservas
  - _Requirements: 2.7_

---

## Phase 6: Relatório de Cardápios Populares

- [x] 20. Criar página de relatório de cardápios populares
  - Criar `src/app/(dashboard)/relatorios/cardapios-populares/page.tsx`
  - Implementar layout similar ao relatório de reservas
  - _Requirements: 3.1_

- [x] 21. Criar componente de filtros de cardápios
  - Criar `src/app/(dashboard)/relatorios/cardapios-populares/_components/popular-menus-filters.tsx`
  - Reutilizar PeriodFilter
  - _Requirements: 3.1_

- [x] 22. Criar componente de ranking de cardápios
  - Criar `src/app/(dashboard)/relatorios/cardapios-populares/_components/popular-menus-ranking.tsx`
  - Exibir top 10 cardápios em cards expansíveis
  - Mostrar: data, dia da semana, resumo, total de reservas, taxa de adesão
  - Implementar expansão para ver composição completa por categoria
  - Adicionar badge visual para taxa de adesão (alta >70%, média 40-70%, baixa <40%)
  - _Requirements: 3.4, 3.5, 3.7_

- [x] 23. Criar componente de gráfico de cardápios
  - Criar `src/app/(dashboard)/relatorios/cardapios-populares/_components/popular-menus-chart.tsx`
  - Usar BarChart horizontal com top 10
  - Adicionar gráfico de pizza para distribuição de variações
  - _Requirements: 3.6, 3.8_

---

## Phase 7: Relatório de Usuários Ativos

- [x] 24. Criar página de relatório de usuários ativos
  - Criar `src/app/(dashboard)/relatorios/usuarios-ativos/page.tsx`
  - _Requirements: 4.1_

- [x] 25. Criar componente de filtros de usuários
  - Criar `src/app/(dashboard)/relatorios/usuarios-ativos/_components/active-users-filters.tsx`
  - Reutilizar PeriodFilter
  - Adicionar filtro por tipo de usuário (FIXO, NAO_FIXO, TODOS)
  - _Requirements: 4.1, 8.4_

- [x] 26. Criar componente de estatísticas de usuários
  - Criar `src/app/(dashboard)/relatorios/usuarios-ativos/_components/active-users-stats.tsx`
  - Exibir 3 cards: Total Ativos, Total Cadastrados, Taxa de Adesão
  - Adicionar gráfico de pizza para distribuição FIXO vs NAO_FIXO
  - _Requirements: 4.2, 4.3, 4.7_

- [x] 27. Criar componente de tabela de usuários
  - Criar `src/app/(dashboard)/relatorios/usuarios-ativos/_components/active-users-table.tsx`
  - Implementar colunas: Nome, CPF (mascarado), Tipo, Total Reservas, Canceladas, Taxa Cancelamento
  - Destacar em vermelho usuários com taxa >20%
  - Ordenar por total de reservas (decrescente)
  - Implementar paginação
  - _Requirements: 4.4, 4.5, 4.6_

---

## Phase 8: Relatório de Estatísticas Operacionais

- [x] 28. Criar página de relatório de estatísticas operacionais
  - Criar `src/app/(dashboard)/relatorios/estatisticas-operacionais/page.tsx`
  - _Requirements: 5.1_

- [x] 29. Criar componente de filtros operacionais
  - Criar `src/app/(dashboard)/relatorios/estatisticas-operacionais/_components/operational-stats-filters.tsx`
  - Reutilizar PeriodFilter
  - _Requirements: 5.1_

- [x] 30. Criar componente de cards de métricas
  - Criar `src/app/(dashboard)/relatorios/estatisticas-operacionais/_components/operational-stats-cards.tsx`
  - Implementar grid 2x2 com 4 seções: Reservas, Usuários, Cardápios, Cancelamentos
  - Cada seção com múltiplas métricas
  - Adicionar card de tendência de crescimento com indicador visual
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.8_

- [x] 31. Criar componente de gráficos operacionais
  - Criar `src/app/(dashboard)/relatorios/estatisticas-operacionais/_components/operational-stats-charts.tsx`
  - Implementar tabs para diferentes visualizações
  - Gráfico de barras: distribuição por dia da semana
  - Gráfico de pizza: distribuição por variação
  - _Requirements: 5.6, 5.7_

---

## Phase 9: Relatório de Desperdício e Cancelamentos

- [x] 32. Criar página de relatório de desperdício
  - Criar `src/app/(dashboard)/relatorios/desperdicio-cancelamentos/page.tsx`
  - _Requirements: 6.1_

- [x] 33. Criar componente de filtros de desperdício
  - Criar `src/app/(dashboard)/relatorios/desperdicio-cancelamentos/_components/waste-report-filters.tsx`
  - Reutilizar PeriodFilter
  - _Requirements: 6.1_

- [x] 34. Criar componente de estatísticas de desperdício
  - Criar `src/app/(dashboard)/relatorios/desperdicio-cancelamentos/_components/waste-report-stats.tsx`
  - Exibir 3 cards: Total Cancelamentos, Taxa, Custo Estimado
  - Adicionar card com distribuição antes/depois do prazo
  - Destacar em vermelho cancelamentos após prazo
  - _Requirements: 6.2, 6.3, 6.4, 6.8_

- [x] 35. Criar componente de análise de desperdício
  - Criar `src/app/(dashboard)/relatorios/desperdicio-cancelamentos/_components/waste-report-analysis.tsx`
  - Exibir top 10 usuários com mais cancelamentos
  - Adicionar gráfico de linha com evolução temporal
  - Exibir análise de padrões (última hora, recorrentes)
  - _Requirements: 6.5, 6.6, 6.7_

---

## Phase 10: Exportação de Relatórios em PDF

- [x] 36. Criar template base de PDF
  - Criar `src/_lib/pdf/report-pdf-template.tsx`
  - Implementar componente ReportPDF com header, footer e layout
  - Aplicar estilos com cores da empresa
  - Incluir logo, título, período e data de geração
  - Adicionar numeração de páginas
  - _Requirements: 7.3, 7.4, 7.5, 7.6_

- [x] 37. Criar componente PDF para relatório de reservas
  - Criar `src/_lib/pdf/reservations-report-pdf.tsx`
  - Incluir estatísticas em cards
  - Incluir tabela de reservas
  - Formatar datas e valores
  - _Requirements: 7.4_

- [ ] 38. Criar componente PDF para relatório de cardápios
  - Criar `src/_lib/pdf/popular-menus-report-pdf.tsx`
  - Incluir ranking de cardápios
  - Incluir composição de cada cardápio
  - _Requirements: 7.4_

- [x] 39. Criar componente PDF para relatório de usuários
  - Criar `src/_lib/pdf/active-users-report-pdf.tsx`
  - Incluir estatísticas gerais
  - Incluir tabela de usuários
  - Mascarar CPF
  - _Requirements: 7.4_

- [x] 40. Criar componente PDF para relatório operacional
  - Criar `src/_lib/pdf/operational-stats-report-pdf.tsx`
  - Incluir todas as métricas consolidadas
  - Organizar em seções
  - _Requirements: 7.4_

- [x] 41. Criar componente PDF para relatório de desperdício
  - Criar `src/_lib/pdf/waste-report-pdf.tsx`
  - Incluir estatísticas de cancelamento
  - Incluir análise de padrões
  - Destacar cancelamentos críticos
  - _Requirements: 7.4_

- [x] 42. Implementar função de geração e download de PDF
  - Criar `src/_lib/pdf/generate-pdf.ts`
  - Implementar `generateAndDownloadPDF(component, filename)`
  - Adicionar tratamento de erros
  - Exibir modal de loading durante geração
  - Implementar nomenclatura padrão: relatorio-[tipo]-[data-inicio]-[data-fim].pdf
  - _Requirements: 7.1, 7.2, 7.7, 7.8_

- [x] 43. Integrar botão de exportação em todos os relatórios
  - Adicionar botão "Exportar PDF" no header de cada relatório
  - Desabilitar botão durante loading ou sem dados
  - Exibir toast de sucesso/erro
  - _Requirements: 7.1, 7.2_

---

## Phase 11: Melhorias de Performance e UX

- [ ] 44. Implementar code splitting
  - Usar dynamic imports para componentes de gráficos
  - Usar dynamic imports para componentes de PDF
  - Adicionar loading states apropriados
  - _Requirements: 9.6_

- [ ] 45. Implementar memoization
  - Adicionar React.memo em componentes de gráficos
  - Usar useMemo para cálculos pesados de processamento
  - Usar useCallback para funções passadas como props
  - _Requirements: 9.6_

- [ ] 46. Implementar debouncing em filtros
  - Criar hook `use-debounced-value.ts`
  - Aplicar debounce de 500ms em campos de busca
  - _Requirements: 9.6_

- [ ] 47. Adicionar indicadores visuais de filtros ativos
  - Exibir badge com quantidade de filtros aplicados
  - Adicionar botão "Limpar Filtros"
  - Manter estado dos filtros ao navegar entre abas
  - _Requirements: 8.7, 8.8_

- [ ] 48. Implementar retry em caso de erro
  - Adicionar botão "Tentar Novamente" em estados de erro
  - Implementar retry automático (3 tentativas) para erros de rede
  - _Requirements: 9.5, 9.6_

---

## Phase 12: Responsividade e Acessibilidade

- [ ] 49. Otimizar layout para mobile
  - Testar todos os relatórios em viewport 320px+
  - Implementar scroll horizontal em tabelas para mobile
  - Ajustar grid de cards para 1 coluna em mobile
  - Ajustar gráficos para visualização em telas pequenas
  - _Requirements: 10.1, 10.2, 10.3_

- [ ] 50. Garantir funcionalidade de exportação em mobile
  - Testar geração de PDF em dispositivos mobile
  - Ajustar modal de loading para mobile
  - _Requirements: 10.4_

- [ ] 51. Implementar acessibilidade
  - Adicionar ARIA labels em todos os elementos interativos
  - Garantir navegação por teclado (tab order correto)
  - Adicionar focus indicators visíveis
  - Verificar contraste de cores (WCAG 2.1 AA)
  - Testar com screen reader
  - _Requirements: 10.5, 10.6, 10.7, 10.8_

---

## Phase 13: Testes e Documentação

- [ ]\* 52. Escrever testes unitários
  - Testar funções de processamento de dados em `report-processors.ts`
  - Testar utilitários em `report-utils.ts`
  - Testar cálculos de métricas (taxa de cancelamento, adesão, etc.)
  - _Requirements: 9.5_

- [ ]\* 53. Escrever testes de integração
  - Testar fluxo completo de geração de relatório de reservas
  - Testar aplicação de filtros
  - Testar exportação de PDF
  - Testar tratamento de erros
  - _Requirements: 9.4, 9.5_

- [ ]\* 54. Escrever testes de acessibilidade
  - Executar jest-axe em todos os componentes principais
  - Corrigir violações encontradas
  - _Requirements: 10.5_

- [ ] 55. Atualizar documentação do projeto
  - Adicionar seção sobre relatórios no README.md
  - Documentar tipos de relatórios disponíveis
  - Documentar como adicionar novos relatórios
  - Adicionar screenshots dos relatórios
  - _Requirements: 11.8_

---

## Notas de Implementação

### Ordem de Execução

As tasks devem ser executadas na ordem apresentada, pois há dependências entre elas:

- **Phase 1-2**: Fundação necessária (types, utils, services)
- **Phase 3**: Componentes reutilizáveis usados em todas as fases seguintes
- **Phase 4**: Dashboard principal (ponto de entrada)
- **Phase 5-9**: Relatórios individuais (podem ser executados em paralelo após Phase 3)
- **Phase 10**: Exportação PDF (depende de todos os relatórios estarem prontos)
- **Phase 11-13**: Refinamentos finais

### Dependências Externas

```json
{
  "recharts": "^2.10.0",
  "@react-pdf/renderer": "^3.4.0",
  "file-saver": "^2.0.5",
  "@types/file-saver": "^2.0.7"
}
```

### Padrões de Código

- Seguir estrutura de pastas existente do projeto
- Usar kebab-case para arquivos e pastas
- Usar PascalCase para componentes React
- Seguir padrões de Tanstack Query do projeto
- Reutilizar componentes shadcn/ui existentes
- Aplicar cores da empresa: #1b994b (verde), #e4e30d (amarelo)

### Estrutura de Commits

Seguir Conventional Commits:

- `feat(reports):` para novas funcionalidades
- `fix(reports):` para correções
- `refactor(reports):` para refatorações
- `style(reports):` para mudanças de estilo
- `test(reports):` para testes
- `docs(reports):` para documentação

### Priorização

**Must Have (MVP)**:

- Phases 1-9: Todos os relatórios principais
- Phase 10: Exportação PDF
- Phase 12: Responsividade básica

**Should Have**:

- Phase 11: Otimizações de performance
- Phase 12: Acessibilidade completa

**Nice to Have**:

- Phase 13: Testes e documentação detalhada
