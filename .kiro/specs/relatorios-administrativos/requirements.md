# Requirements Document - Relatórios Administrativos

## Introduction

Este documento define os requisitos para o módulo de Relatórios Administrativos do Sistema de Reservas de Almoço Corporativo. O módulo permitirá que administradores gerem, visualizem e exportem relatórios analíticos sobre reservas, cardápios, usuários e estatísticas operacionais em formato PDF.

## Glossary

- **Sistema**: Sistema de Reservas de Almoço Corporativo (BookMenu)
- **Administrador**: Usuário com role ADMIN que tem acesso aos relatórios
- **Relatório**: Documento gerado contendo dados analíticos e estatísticos
- **Período**: Intervalo de datas usado para filtrar dados dos relatórios
- **Exportação PDF**: Processo de gerar arquivo PDF do relatório para download
- **Dashboard de Relatórios**: Página principal onde administradores acessam e geram relatórios
- **Reserva Ativa**: Reserva com status CONFIRMED
- **Reserva Cancelada**: Reserva com status CANCELLED
- **Reserva Automática**: Reserva gerada automaticamente pelo sistema (campo isAutomatic = true)
- **Taxa de Cancelamento**: Percentual de reservas canceladas em relação ao total
- **Taxa de Adesão**: Percentual de usuários que fizeram pelo menos uma reserva no período

## Requirements

### Requirement 1: Dashboard de Relatórios

**User Story:** Como administrador, quero acessar um dashboard centralizado de relatórios, para que eu possa visualizar e gerar diferentes tipos de relatórios do sistema.

#### Acceptance Criteria

1. WHEN THE Administrador acessa a rota /relatorios, THE Sistema SHALL exibir o dashboard de relatórios com cards para cada tipo de relatório disponível
2. THE Sistema SHALL restringir o acesso ao dashboard apenas para usuários com role ADMIN
3. THE Sistema SHALL exibir um card para cada tipo de relatório contendo título, descrição e botão de acesso
4. THE Sistema SHALL organizar os cards de relatórios em uma grid responsiva
5. THE Sistema SHALL incluir o dashboard de relatórios no menu de navegação da sidebar para administradores

### Requirement 2: Relatório de Reservas por Período

**User Story:** Como administrador, quero gerar um relatório de reservas por período, para que eu possa analisar o volume e padrões de reservas ao longo do tempo.

#### Acceptance Criteria

1. WHEN THE Administrador seleciona o relatório de reservas por período, THE Sistema SHALL exibir um formulário com campos de data inicial e data final
2. THE Sistema SHALL validar que a data inicial não seja posterior à data final
3. WHEN THE Administrador submete o formulário com período válido, THE Sistema SHALL buscar todas as reservas criadas dentro do período especificado
4. THE Sistema SHALL exibir estatísticas gerais contendo total de reservas, reservas ativas, reservas canceladas e taxa de cancelamento
5. THE Sistema SHALL exibir gráfico de linha mostrando evolução diária de reservas no período
6. THE Sistema SHALL exibir tabela detalhada com colunas: data, usuário, cardápio, variação, status e tipo (manual/automática)
7. THE Sistema SHALL agrupar dados por semana mostrando totais semanais
8. THE Sistema SHALL incluir filtros adicionais por status e tipo de reserva
9. THE Sistema SHALL ordenar dados por data decrescente (mais recentes primeiro)

### Requirement 3: Relatório de Cardápios Mais Reservados

**User Story:** Como administrador, quero visualizar quais cardápios tiveram mais reservas, para que eu possa identificar preferências alimentares e planejar cardápios futuros.

#### Acceptance Criteria

1. WHEN THE Administrador seleciona o relatório de cardápios mais reservados, THE Sistema SHALL exibir formulário com seleção de período
2. THE Sistema SHALL buscar todos os cardápios que tiveram reservas no período especificado
3. THE Sistema SHALL calcular o total de reservas ativas para cada cardápio
4. THE Sistema SHALL exibir ranking dos 10 cardápios mais reservados
5. THE Sistema SHALL exibir para cada cardápio: data, dia da semana, composição resumida, total de reservas e taxa de adesão
6. THE Sistema SHALL exibir gráfico de barras horizontais com os top 10 cardápios
7. THE Sistema SHALL permitir expandir cada cardápio para ver composição completa por categoria
8. THE Sistema SHALL exibir análise de variações mostrando distribuição entre "Padrão" e "Com Ovo"

### Requirement 4: Relatório de Usuários Ativos

**User Story:** Como administrador, quero visualizar estatísticas sobre usuários ativos, para que eu possa entender o engajamento dos colaboradores com o sistema.

#### Acceptance Criteria

1. WHEN THE Administrador seleciona o relatório de usuários ativos, THE Sistema SHALL exibir formulário com seleção de período
2. THE Sistema SHALL buscar todos os usuários que fizeram pelo menos uma reserva no período
3. THE Sistema SHALL calcular total de usuários ativos, total de usuários cadastrados e taxa de adesão
4. THE Sistema SHALL exibir lista de usuários ordenada por quantidade de reservas (decrescente)
5. THE Sistema SHALL exibir para cada usuário: nome, CPF, tipo (FIXO/NAO_FIXO), total de reservas, reservas canceladas e taxa de cancelamento individual
6. THE Sistema SHALL destacar usuários com taxa de cancelamento acima de 20%
7. THE Sistema SHALL exibir gráfico de pizza mostrando distribuição entre usuários FIXO e NAO_FIXO
8. THE Sistema SHALL incluir filtro por tipo de usuário (FIXO, NAO_FIXO, TODOS)

### Requirement 5: Relatório de Estatísticas Operacionais

**User Story:** Como administrador, quero visualizar estatísticas operacionais consolidadas, para que eu possa ter uma visão geral do funcionamento do sistema.

#### Acceptance Criteria

1. WHEN THE Administrador seleciona o relatório de estatísticas operacionais, THE Sistema SHALL exibir formulário com seleção de período
2. THE Sistema SHALL calcular e exibir métricas gerais: total de reservas, média diária, dia com mais reservas, dia com menos reservas
3. THE Sistema SHALL calcular e exibir métricas de usuários: total de usuários ativos, taxa de adesão, usuários novos no período
4. THE Sistema SHALL calcular e exibir métricas de cardápios: total de cardápios criados, média de reservas por cardápio, cardápio mais popular
5. THE Sistema SHALL calcular e exibir métricas de cancelamento: total de cancelamentos, taxa de cancelamento, horário médio de cancelamento
6. THE Sistema SHALL exibir gráfico de distribuição de reservas por dia da semana
7. THE Sistema SHALL exibir gráfico de distribuição de reservas por variação
8. THE Sistema SHALL exibir tendência de crescimento comparando com período anterior

### Requirement 6: Relatório de Desperdício e Cancelamentos

**User Story:** Como administrador, quero analisar padrões de cancelamento, para que eu possa identificar problemas e reduzir desperdício de alimentos.

#### Acceptance Criteria

1. WHEN THE Administrador seleciona o relatório de desperdício, THE Sistema SHALL exibir formulário com seleção de período
2. THE Sistema SHALL buscar todas as reservas canceladas no período
3. THE Sistema SHALL calcular total de cancelamentos, taxa de cancelamento e custo estimado de desperdício
4. THE Sistema SHALL agrupar cancelamentos por horário mostrando quantos foram feitos antes e depois do prazo limite (8:30 AM)
5. THE Sistema SHALL identificar usuários com maior taxa de cancelamento (top 10)
6. THE Sistema SHALL exibir gráfico de linha mostrando evolução de cancelamentos ao longo do período
7. THE Sistema SHALL exibir análise de motivos identificando padrões (cancelamentos de última hora, cancelamentos recorrentes)
8. THE Sistema SHALL destacar cancelamentos após prazo limite que geraram desperdício

### Requirement 7: Exportação de Relatórios em PDF

**User Story:** Como administrador, quero exportar relatórios em formato PDF, para que eu possa compartilhar, arquivar ou imprimir os dados.

#### Acceptance Criteria

1. WHEN THE Administrador visualiza qualquer relatório, THE Sistema SHALL exibir botão "Exportar PDF" no topo da página
2. WHEN THE Administrador clica no botão de exportação, THE Sistema SHALL gerar arquivo PDF contendo todos os dados visíveis do relatório
3. THE Sistema SHALL incluir no PDF: cabeçalho com logo e título do relatório, período selecionado, data de geração
4. THE Sistema SHALL incluir no PDF todas as tabelas, gráficos e estatísticas exibidas na tela
5. THE Sistema SHALL formatar o PDF com layout profissional e legível
6. THE Sistema SHALL incluir rodapé com numeração de páginas e informações do sistema
7. THE Sistema SHALL iniciar download automático do arquivo PDF após geração
8. THE Sistema SHALL nomear o arquivo seguindo padrão: relatorio-[tipo]-[data-inicio]-[data-fim].pdf

### Requirement 8: Filtros e Personalização

**User Story:** Como administrador, quero aplicar filtros avançados nos relatórios, para que eu possa analisar dados específicos de acordo com minhas necessidades.

#### Acceptance Criteria

1. THE Sistema SHALL permitir seleção de período customizado com date pickers
2. THE Sistema SHALL oferecer períodos pré-definidos: Última semana, Último mês, Últimos 3 meses, Último ano
3. THE Sistema SHALL permitir filtrar por status de reserva (CONFIRMED, CANCELLED, TODOS)
4. THE Sistema SHALL permitir filtrar por tipo de usuário (FIXO, NAO_FIXO, TODOS)
5. THE Sistema SHALL permitir filtrar por tipo de reserva (Manual, Automática, TODAS)
6. THE Sistema SHALL aplicar filtros em tempo real sem recarregar a página
7. THE Sistema SHALL manter estado dos filtros ao navegar entre abas do mesmo relatório
8. THE Sistema SHALL exibir indicador visual dos filtros ativos

### Requirement 9: Performance e Loading States

**User Story:** Como administrador, quero que os relatórios carreguem rapidamente, para que eu possa acessar informações sem demora.

#### Acceptance Criteria

1. WHEN THE Sistema está carregando dados do relatório, THE Sistema SHALL exibir skeleton loaders nas áreas de conteúdo
2. WHEN THE Sistema está gerando PDF, THE Sistema SHALL exibir modal de loading com mensagem "Gerando PDF..."
3. THE Sistema SHALL implementar paginação em tabelas com mais de 50 registros
4. THE Sistema SHALL cachear dados de relatórios por 5 minutos usando Tanstack Query
5. THE Sistema SHALL exibir mensagem de erro amigável caso falha ao carregar dados
6. THE Sistema SHALL permitir retry manual em caso de erro
7. THE Sistema SHALL limitar período máximo de consulta a 1 ano para evitar sobrecarga

### Requirement 10: Responsividade e Acessibilidade

**User Story:** Como administrador, quero acessar relatórios em diferentes dispositivos, para que eu possa consultar dados em qualquer lugar.

#### Acceptance Criteria

1. THE Sistema SHALL adaptar layout dos relatórios para telas mobile (320px+)
2. THE Sistema SHALL permitir scroll horizontal em tabelas em dispositivos mobile
3. THE Sistema SHALL adaptar gráficos para visualização em telas pequenas
4. THE Sistema SHALL manter funcionalidade de exportação PDF em dispositivos mobile
5. THE Sistema SHALL seguir padrões de acessibilidade WCAG 2.1 nível AA
6. THE Sistema SHALL permitir navegação por teclado em todos os controles
7. THE Sistema SHALL incluir labels ARIA apropriados em elementos interativos
8. THE Sistema SHALL garantir contraste adequado de cores em modo claro e escuro

### Requirement 11: Integração com Sistema Existente

**User Story:** Como desenvolvedor, quero integrar o módulo de relatórios ao sistema existente, para que mantenha consistência com a arquitetura atual.

#### Acceptance Criteria

1. THE Sistema SHALL criar nova rota /relatorios no dashboard protegida com role ADMIN
2. THE Sistema SHALL adicionar item "Relatórios" na sidebar para administradores
3. THE Sistema SHALL reutilizar componentes UI existentes (shadcn/ui)
4. THE Sistema SHALL seguir padrões de código do projeto (kebab-case, TypeScript, Tanstack Query)
5. THE Sistema SHALL utilizar API client existente com autenticação JWT
6. THE Sistema SHALL criar services específicos para buscar dados de relatórios
7. THE Sistema SHALL criar types TypeScript para todas as estruturas de dados de relatórios
8. THE Sistema SHALL implementar tratamento de erros consistente com o resto do sistema
