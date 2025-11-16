# Design Document - Relatórios Administrativos

## Overview

O módulo de Relatórios Administrativos fornecerá aos administradores do sistema ferramentas analíticas para monitorar e otimizar as operações de reservas de almoço. O módulo será implementado como uma nova seção no dashboard administrativo, seguindo os padrões arquiteturais existentes do projeto.

### Objetivos

- Fornecer insights acionáveis sobre padrões de reservas
- Identificar oportunidades de otimização operacional
- Reduzir desperdício através de análise de cancelamentos
- Facilitar tomada de decisões baseada em dados
- Permitir exportação e compartilhamento de relatórios

### Tecnologias

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts (biblioteca de gráficos React)
- **PDF Generation**: react-pdf/renderer
- **Data Fetching**: Tanstack Query
- **Date Handling**: dayjs
- **Forms**: React Hook Form + Zod

## Architecture

### Estrutura de Rotas

```
src/app/(dashboard)/relatorios/
├── page.tsx                          # Dashboard principal de relatórios
├── layout.tsx                        # Layout compartilhado (opcional)
├── _components/
│   ├── reports-dashboard.tsx         # Grid de cards de relatórios
│   └── report-card.tsx               # Card individual de relatório
├── reservas-periodo/
│   ├── page.tsx
│   └── _components/
│       ├── reservations-report-filters.tsx
│       ├── reservations-report-stats.tsx
│       ├── reservations-report-chart.tsx
│       └── reservations-report-table.tsx
├── cardapios-populares/
│   ├── page.tsx
│   └── _components/
│       ├── popular-menus-filters.tsx
│       ├── popular-menus-ranking.tsx
│       └── popular-menus-chart.tsx
├── usuarios-ativos/
│   ├── page.tsx
│   └── _components/
│       ├── active-users-filters.tsx
│       ├── active-users-stats.tsx
│       └── active-users-table.tsx
├── estatisticas-operacionais/
│   ├── page.tsx
│   └── _components/
│       ├── operational-stats-filters.tsx
│       ├── operational-stats-cards.tsx
│       └── operational-stats-charts.tsx
├── desperdicio-cancelamentos/
│   ├── page.tsx
│   └── _components/
│       ├── waste-report-filters.tsx
│       ├── waste-report-stats.tsx
│       └── waste-report-analysis.tsx
```

### Estrutura de Dados

#### Types TypeScript

```typescript
// src/_types/report.ts

export type ReportType =
  | "reservations-period"
  | "popular-menus"
  | "active-users"
  | "operational-stats"
  | "waste-analysis";

export type ReportPeriod =
  | "last-week"
  | "last-month"
  | "last-3-months"
  | "last-year"
  | "custom";

export interface ReportFilters {
  startDate: string; // ISO date
  endDate: string; // ISO date
  status?: "CONFIRMED" | "CANCELLED" | "ALL";
  userType?: "FIXO" | "NAO_FIXO" | "ALL";
  reservationType?: "MANUAL" | "AUTOMATIC" | "ALL";
}

export interface ReservationReportData {
  summary: {
    totalReservations: number;
    activeReservations: number;
    cancelledReservations: number;
    cancellationRate: number;
  };
  dailyData: Array<{
    date: string;
    total: number;
    confirmed: number;
    cancelled: number;
  }>;
  weeklyData: Array<{
    weekStart: string;
    weekEnd: string;
    total: number;
  }>;
  reservations: Array<{
    id: string;
    date: string;
    userName: string;
    userCpf: string;
    menuSummary: string;
    variation: string;
    status: string;
    isAutomatic: boolean;
  }>;
}

export interface PopularMenusReportData {
  summary: {
    totalMenus: number;
    totalReservations: number;
    averageReservationsPerMenu: number;
  };
  topMenus: Array<{
    menuId: string;
    date: string;
    dayOfWeek: string;
    summary: string;
    totalReservations: number;
    adherenceRate: number;
    composition: Array<{
      categoryName: string;
      items: string[];
    }>;
    variationDistribution: {
      standard: number;
      withEgg: number;
    };
  }>;
}

export interface ActiveUsersReportData {
  summary: {
    totalActiveUsers: number;
    totalRegisteredUsers: number;
    adherenceRate: number;
  };
  userTypeDistribution: {
    fixo: number;
    naoFixo: number;
  };
  users: Array<{
    userId: string;
    name: string;
    cpf: string;
    userType: "FIXO" | "NAO_FIXO";
    totalReservations: number;
    cancelledReservations: number;
    cancellationRate: number;
  }>;
}

export interface OperationalStatsReportData {
  reservationMetrics: {
    total: number;
    dailyAverage: number;
    peakDay: { date: string; count: number };
    lowestDay: { date: string; count: number };
  };
  userMetrics: {
    totalActive: number;
    adherenceRate: number;
    newUsers: number;
  };
  menuMetrics: {
    totalMenus: number;
    averageReservationsPerMenu: number;
    mostPopularMenu: { date: string; reservations: number };
  };
  cancellationMetrics: {
    total: number;
    rate: number;
    averageTime: string;
  };
  dayOfWeekDistribution: Array<{
    dayOfWeek: string;
    count: number;
  }>;
  variationDistribution: {
    standard: number;
    withEgg: number;
  };
  growthTrend: {
    currentPeriod: number;
    previousPeriod: number;
    percentageChange: number;
  };
}

export interface WasteReportData {
  summary: {
    totalCancellations: number;
    cancellationRate: number;
    estimatedWasteCost: number;
  };
  timeDistribution: {
    beforeDeadline: number;
    afterDeadline: number;
  };
  topCancellers: Array<{
    userId: string;
    userName: string;
    userCpf: string;
    totalCancellations: number;
    cancellationRate: number;
  }>;
  dailyTrend: Array<{
    date: string;
    cancellations: number;
  }>;
  patterns: {
    lastMinuteCancellations: number;
    recurringCancellers: number;
  };
}
```

## Components and Interfaces

### 1. Dashboard Principal de Relatórios

**Component**: `src/app/(dashboard)/relatorios/page.tsx`

```typescript
export default function RelatoriosPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Análises e estatísticas do sistema de reservas
          </p>
        </div>
        <ReportsDashboard />
      </div>
    </PageContainer>
  );
}
```

**Component**: `ReportsDashboard`

Exibe grid de cards com os relatórios disponíveis. Cada card contém:

- Ícone representativo
- Título do relatório
- Descrição breve
- Botão "Acessar"

### 2. Relatório de Reservas por Período

**Page**: `src/app/(dashboard)/relatorios/reservas-periodo/page.tsx`

**Components**:

- **ReservationsReportFilters**: Formulário com date pickers e filtros
- **ReservationsReportStats**: Cards com estatísticas resumidas
- **ReservationsReportChart**: Gráfico de linha com evolução diária
- **ReservationsReportTable**: Tabela paginada com detalhes das reservas

**Data Flow**:

1. Usuário seleciona período e filtros
2. Hook `useGetReservationsReport(filters)` busca dados da API
3. Componentes renderizam dados com loading states
4. Botão "Exportar PDF" gera documento usando react-pdf

### 3. Relatório de Cardápios Populares

**Page**: `src/app/(dashboard)/relatorios/cardapios-populares/page.tsx`

**Components**:

- **PopularMenusFilters**: Seleção de período
- **PopularMenusRanking**: Lista ordenada dos top 10 cardápios
- **PopularMenusChart**: Gráfico de barras horizontais

**Features**:

- Cada item do ranking é expansível para mostrar composição completa
- Badge visual para taxa de adesão (alta/média/baixa)
- Gráfico de pizza para distribuição de variações

### 4. Relatório de Usuários Ativos

**Page**: `src/app/(dashboard)/relatorios/usuarios-ativos/page.tsx`

**Components**:

- **ActiveUsersFilters**: Período e filtro por tipo de usuário
- **ActiveUsersStats**: Cards com métricas gerais
- **ActiveUsersTable**: Tabela com usuários ordenados por atividade

**Features**:

- Highlight visual para usuários com alta taxa de cancelamento (>20%)
- Gráfico de pizza para distribuição FIXO vs NAO_FIXO
- Ordenação por diferentes colunas

### 5. Relatório de Estatísticas Operacionais

**Page**: `src/app/(dashboard)/relatorios/estatisticas-operacionais/page.tsx`

**Components**:

- **OperationalStatsFilters**: Seleção de período
- **OperationalStatsCards**: Grid de cards com métricas principais
- **OperationalStatsCharts**: Múltiplos gráficos (barras, pizza, linha)

**Layout**:

- Grid 2x2 de cards de métricas no topo
- Seção de gráficos abaixo com tabs para diferentes visualizações
- Card de tendência de crescimento com indicador visual (↑/↓)

### 6. Relatório de Desperdício e Cancelamentos

**Page**: `src/app/(dashboard)/relatorios/desperdicio-cancelamentos/page.tsx`

**Components**:

- **WasteReportFilters**: Seleção de período
- **WasteReportStats**: Cards com métricas de cancelamento
- **WasteReportAnalysis**: Análise detalhada com gráficos e tabelas

**Features**:

- Destaque visual para cancelamentos após prazo (vermelho)
- Lista de top 10 usuários com mais cancelamentos
- Gráfico de linha mostrando tendência temporal
- Análise de padrões com insights automáticos

## Data Models

### API Endpoints

Como a API atual não possui endpoints específicos para relatórios, utilizaremos os endpoints existentes e processaremos os dados no frontend:

```typescript
// Endpoints utilizados:
GET /api/lunch-reservation/reservations/all?startDate={date}&endDate={date}&status={status}
GET /api/lunch-reservation/users?includeInactive=true
GET /api/lunch-reservation/menus?startDate={date}&endDate={date}
```

### Services

**File**: `src/_services/report.service.ts`

```typescript
import { apiClient } from "@/_lib/api-client";
import {
  ReportFilters,
  ReservationReportData,
  PopularMenusReportData,
  ActiveUsersReportData,
  OperationalStatsReportData,
  WasteReportData,
} from "@/_types/report";

export const reportService = {
  // Busca dados brutos e processa para relatório de reservas
  async getReservationsReport(
    filters: ReportFilters,
  ): Promise<ReservationReportData> {
    const params = new URLSearchParams({
      startDate: filters.startDate,
      endDate: filters.endDate,
    });

    if (filters.status && filters.status !== "ALL") {
      params.append("status", filters.status);
    }

    const response = await apiClient.get(
      `/lunch-reservation/reservations/all?${params}`,
    );

    // Processar dados para formato do relatório
    return processReservationsData(response.data, filters);
  },

  async getPopularMenusReport(
    filters: ReportFilters,
  ): Promise<PopularMenusReportData> {
    // Buscar reservas e cardápios, processar para ranking
    const [reservations, menus] = await Promise.all([
      apiClient.get(
        `/lunch-reservation/reservations/all?startDate=${filters.startDate}&endDate=${filters.endDate}`,
      ),
      apiClient.get(
        `/lunch-reservation/menus?startDate=${filters.startDate}&endDate=${filters.endDate}`,
      ),
    ]);

    return processPopularMenusData(reservations.data, menus.data);
  },

  async getActiveUsersReport(
    filters: ReportFilters,
  ): Promise<ActiveUsersReportData> {
    const [reservations, users] = await Promise.all([
      apiClient.get(
        `/lunch-reservation/reservations/all?startDate=${filters.startDate}&endDate=${filters.endDate}`,
      ),
      apiClient.get("/lunch-reservation/users?includeInactive=false"),
    ]);

    return processActiveUsersData(reservations.data, users.data, filters);
  },

  async getOperationalStatsReport(
    filters: ReportFilters,
  ): Promise<OperationalStatsReportData> {
    const [reservations, users, menus] = await Promise.all([
      apiClient.get(
        `/lunch-reservation/reservations/all?startDate=${filters.startDate}&endDate=${filters.endDate}`,
      ),
      apiClient.get("/lunch-reservation/users?includeInactive=false"),
      apiClient.get(
        `/lunch-reservation/menus?startDate=${filters.startDate}&endDate=${filters.endDate}`,
      ),
    ]);

    return processOperationalStatsData(
      reservations.data,
      users.data,
      menus.data,
      filters,
    );
  },

  async getWasteReport(filters: ReportFilters): Promise<WasteReportData> {
    const response = await apiClient.get(
      `/lunch-reservation/reservations/all?startDate=${filters.startDate}&endDate=${filters.endDate}&status=CANCELLED`,
    );

    return processWasteData(response.data, filters);
  },
};

// Funções auxiliares de processamento
function processReservationsData(
  reservations: any[],
  filters: ReportFilters,
): ReservationReportData {
  // Implementar lógica de agregação e cálculos
}

// ... outras funções de processamento
```

### Hooks Tanstack Query

**File**: `src/_hooks/queries/use-get-reservations-report.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/_services/report.service";
import { ReportFilters } from "@/_types/report";

export function useGetReservationsReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ["reservations-report", filters],
    queryFn: () => reportService.getReservationsReport(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!filters.startDate && !!filters.endDate,
  });
}
```

Criar hooks similares para cada tipo de relatório:

- `useGetPopularMenusReport`
- `useGetActiveUsersReport`
- `useGetOperationalStatsReport`
- `useGetWasteReport`

## Error Handling

### Estratégias de Tratamento de Erros

1. **Erro de Autenticação (401)**
   - Redirecionar para página de login
   - Limpar token do localStorage

2. **Erro de Autorização (403)**
   - Exibir toast: "Você não tem permissão para acessar relatórios"
   - Redirecionar para dashboard principal

3. **Erro de Validação (400)**
   - Exibir mensagens de erro inline nos campos do formulário
   - Destacar campos com erro em vermelho

4. **Erro de Servidor (500)**
   - Exibir toast: "Erro ao carregar relatório. Tente novamente."
   - Oferecer botão de retry

5. **Timeout ou Rede**
   - Exibir mensagem: "Falha na conexão. Verifique sua internet."
   - Implementar retry automático (3 tentativas)

6. **Dados Vazios**
   - Exibir empty state com ilustração
   - Mensagem: "Nenhum dado encontrado para o período selecionado"
   - Sugerir ajustar filtros

### Error Boundaries

Implementar Error Boundary específico para módulo de relatórios:

```typescript
// src/app/(dashboard)/relatorios/error.tsx
'use client';

export default function ReportsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <h2 className="text-2xl font-bold">Erro ao carregar relatório</h2>
      <p className="text-muted-foreground">
        Ocorreu um erro inesperado. Por favor, tente novamente.
      </p>
      <Button onClick={reset}>Tentar Novamente</Button>
    </div>
  );
}
```

## Testing Strategy

### Testes Unitários

**Prioridade**: Funções de processamento de dados

```typescript
// src/_services/__tests__/report.service.test.ts

describe("reportService", () => {
  describe("processReservationsData", () => {
    it("should calculate correct summary statistics", () => {
      const mockReservations = [
        { status: "CONFIRMED", date: "2025-11-01" },
        { status: "CONFIRMED", date: "2025-11-02" },
        { status: "CANCELLED", date: "2025-11-03" },
      ];

      const result = processReservationsData(mockReservations, filters);

      expect(result.summary.totalReservations).toBe(3);
      expect(result.summary.activeReservations).toBe(2);
      expect(result.summary.cancelledReservations).toBe(1);
      expect(result.summary.cancellationRate).toBe(33.33);
    });

    it("should group reservations by day correctly", () => {
      // Test implementation
    });

    it("should group reservations by week correctly", () => {
      // Test implementation
    });
  });

  describe("processPopularMenusData", () => {
    it("should rank menus by reservation count", () => {
      // Test implementation
    });

    it("should calculate adherence rate correctly", () => {
      // Test implementation
    });
  });
});
```

### Testes de Integração

**Prioridade**: Fluxos principais de usuário

```typescript
// src/app/(dashboard)/relatorios/__tests__/reservations-report.test.tsx

describe('Reservations Report', () => {
  it('should load and display report data', async () => {
    render(<ReservationsPeriodPage />);

    // Selecionar período
    const startDateInput = screen.getByLabelText('Data Inicial');
    await userEvent.type(startDateInput, '2025-11-01');

    const endDateInput = screen.getByLabelText('Data Final');
    await userEvent.type(endDateInput, '2025-11-30');

    // Submeter formulário
    const submitButton = screen.getByRole('button', { name: /gerar relatório/i });
    await userEvent.click(submitButton);

    // Verificar loading state
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();

    // Aguardar dados carregarem
    await waitFor(() => {
      expect(screen.getByText(/total de reservas/i)).toBeInTheDocument();
    });

    // Verificar estatísticas exibidas
    expect(screen.getByText('150')).toBeInTheDocument(); // Total
  });

  it('should handle empty data gracefully', async () => {
    // Mock API returning empty array
    server.use(
      rest.get('/api/lunch-reservation/reservations/all', (req, res, ctx) => {
        return res(ctx.json([]));
      })
    );

    render(<ReservationsPeriodPage />);

    // ... submit form

    await waitFor(() => {
      expect(screen.getByText(/nenhum dado encontrado/i)).toBeInTheDocument();
    });
  });
});
```

### Testes de Acessibilidade

```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Reports Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<ReportsDashboard />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## PDF Generation

### Biblioteca: react-pdf/renderer

**Instalação**:

```bash
npm install @react-pdf/renderer
```

### Estrutura de Componentes PDF

**File**: `src/_lib/pdf/report-pdf-template.tsx`

```typescript
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #1b994b',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1b994b',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    width: '23%',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  statLabel: {
    fontSize: 9,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b994b',
  },
  table: {
    display: 'table',
    width: '100%',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #ddd',
    paddingVertical: 8,
  },
  tableHeader: {
    backgroundColor: '#1b994b',
    color: 'white',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
    borderTop: '1px solid #ddd',
    paddingTop: 10,
  },
});

interface ReportPDFProps {
  title: string;
  period: { start: string; end: string };
  generatedAt: string;
  children: React.ReactNode;
}

export function ReportPDF({ title, period, generatedAt, children }: ReportPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            Período: {period.start} a {period.end}
          </Text>
          <Text style={styles.subtitle}>
            Gerado em: {generatedAt}
          </Text>
        </View>

        {children}

        <View style={styles.footer}>
          <Text>BookMenu - Sistema de Reservas de Almoço Corporativo</Text>
          <Text>Página {/* page number */}</Text>
        </View>
      </Page>
    </Document>
  );
}
```

### Componentes PDF Específicos

**File**: `src/_lib/pdf/reservations-report-pdf.tsx`

```typescript
export function ReservationsReportPDF({ data, filters }: Props) {
  return (
    <ReportPDF
      title="Relatório de Reservas por Período"
      period={{ start: filters.startDate, end: filters.endDate }}
      generatedAt={dayjs().format('DD/MM/YYYY HH:mm')}
    >
      {/* Estatísticas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total de Reservas</Text>
            <Text style={styles.statValue}>{data.summary.totalReservations}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Reservas Ativas</Text>
            <Text style={styles.statValue}>{data.summary.activeReservations}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Canceladas</Text>
            <Text style={styles.statValue}>{data.summary.cancelledReservations}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Taxa de Cancelamento</Text>
            <Text style={styles.statValue}>{data.summary.cancellationRate}%</Text>
          </View>
        </View>
      </View>

      {/* Tabela de Reservas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalhamento</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Data</Text>
            <Text style={styles.tableCell}>Usuário</Text>
            <Text style={styles.tableCell}>Cardápio</Text>
            <Text style={styles.tableCell}>Status</Text>
          </View>
          {data.reservations.map((reservation) => (
            <View key={reservation.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{reservation.date}</Text>
              <Text style={styles.tableCell}>{reservation.userName}</Text>
              <Text style={styles.tableCell}>{reservation.menuSummary}</Text>
              <Text style={styles.tableCell}>{reservation.status}</Text>
            </View>
          ))}
        </View>
      </View>
    </ReportPDF>
  );
}
```

### Geração e Download

**File**: `src/_lib/pdf/generate-pdf.ts`

```typescript
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

export async function generateAndDownloadPDF(
  component: React.ReactElement,
  filename: string,
) {
  try {
    const blob = await pdf(component).toBlob();
    saveAs(blob, filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Falha ao gerar PDF");
  }
}
```

### Uso nos Componentes

```typescript
// Em qualquer página de relatório
import { generateAndDownloadPDF } from '@/_lib/pdf/generate-pdf';
import { ReservationsReportPDF } from '@/_lib/pdf/reservations-report-pdf';

function ReservationsReportPage() {
  const { data, isLoading } = useGetReservationsReport(filters);

  const handleExportPDF = async () => {
    if (!data) return;

    const filename = `relatorio-reservas-${filters.startDate}-${filters.endDate}.pdf`;

    await generateAndDownloadPDF(
      <ReservationsReportPDF data={data} filters={filters} />,
      filename
    );
  };

  return (
    <div>
      <Button onClick={handleExportPDF} disabled={isLoading || !data}>
        <Download className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>
      {/* Rest of the report UI */}
    </div>
  );
}
```

## Charts and Visualizations

### Biblioteca: Recharts

**Instalação**:

```bash
npm install recharts
```

### Componentes de Gráficos Reutilizáveis

**File**: `src/_components/charts/line-chart.tsx`

```typescript
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: Array<{ [key: string]: any }>;
  xKey: string;
  lines: Array<{
    dataKey: string;
    name: string;
    color: string;
  }>;
  height?: number;
}

export function LineChart({ data, xKey, lines, height = 300 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name}
            stroke={line.color}
            strokeWidth={2}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
```

**File**: `src/_components/charts/bar-chart.tsx`

```typescript
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: Array<{ [key: string]: any }>;
  xKey: string;
  bars: Array<{
    dataKey: string;
    name: string;
    color: string;
  }>;
  layout?: 'horizontal' | 'vertical';
  height?: number;
}

export function BarChart({ data, xKey, bars, layout = 'vertical', height = 300 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} layout={layout}>
        <CartesianGrid strokeDasharray="3 3" />
        {layout === 'vertical' ? (
          <>
            <XAxis dataKey={xKey} />
            <YAxis />
          </>
        ) : (
          <>
            <XAxis type="number" />
            <YAxis dataKey={xKey} type="category" />
          </>
        )}
        <Tooltip />
        <Legend />
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
```

**File**: `src/_components/charts/pie-chart.tsx`

```typescript
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PieChartProps {
  data: Array<{ name: string; value: number }>;
  colors: string[];
  height?: number;
}

export function PieChart({ data, colors, height = 300 }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
```

### Uso nos Relatórios

```typescript
// Exemplo: Gráfico de evolução diária de reservas
<LineChart
  data={reportData.dailyData}
  xKey="date"
  lines={[
    { dataKey: 'total', name: 'Total', color: '#1b994b' },
    { dataKey: 'confirmed', name: 'Confirmadas', color: '#10b981' },
    { dataKey: 'cancelled', name: 'Canceladas', color: '#ef4444' },
  ]}
/>

// Exemplo: Gráfico de cardápios mais populares
<BarChart
  data={reportData.topMenus}
  xKey="summary"
  bars={[
    { dataKey: 'totalReservations', name: 'Reservas', color: '#1b994b' },
  ]}
  layout="horizontal"
  height={400}
/>

// Exemplo: Distribuição de tipos de usuário
<PieChart
  data={[
    { name: 'Fixo', value: reportData.userTypeDistribution.fixo },
    { name: 'Não Fixo', value: reportData.userTypeDistribution.naoFixo },
  ]}
  colors={['#1b994b', '#e4e30d']}
/>
```

## UI/UX Design Patterns

### Color Palette

Seguindo as cores da empresa definidas no projeto:

```typescript
// Cores principais
const colors = {
  primary: "#1b994b", // Verde principal
  secondary: "#e4e30d", // Amarelo
  success: "#10b981", // Verde claro
  danger: "#ef4444", // Vermelho
  warning: "#f59e0b", // Laranja
  info: "#3b82f6", // Azul
  muted: "#6b7280", // Cinza
};
```

### Cards de Estatísticas

Design consistente para cards de métricas:

```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export function StatCard({ title, value, icon, trend, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={cn(
            "text-xs flex items-center gap-1",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend.value)}% em relação ao período anterior
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
```

### Filtros de Período

Componente reutilizável para seleção de período:

```typescript
interface PeriodFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onPresetSelect: (preset: ReportPeriod) => void;
}

export function PeriodFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onPresetSelect
}: PeriodFilterProps) {
  const presets = [
    { label: 'Última Semana', value: 'last-week' },
    { label: 'Último Mês', value: 'last-month' },
    { label: 'Últimos 3 Meses', value: 'last-3-months' },
    { label: 'Último Ano', value: 'last-year' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {presets.map((preset) => (
          <Button
            key={preset.value}
            variant="outline"
            size="sm"
            onClick={() => onPresetSelect(preset.value as ReportPeriod)}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start-date">Data Inicial</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="end-date">Data Final</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
```

### Empty States

Design para quando não há dados:

```typescript
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Uso
<EmptyState
  title="Nenhum dado encontrado"
  description="Não há reservas para o período selecionado. Tente ajustar os filtros."
  icon={<FileSearch className="h-12 w-12" />}
  action={{
    label: "Limpar Filtros",
    onClick: handleClearFilters
  }}
/>
```

### Loading States

Skeletons específicos para relatórios:

```typescript
export function ReportStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ReportChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}

export function ReportTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

## Performance Optimization

### Estratégias de Otimização

1. **Code Splitting**
   - Carregar módulo de relatórios apenas quando acessado
   - Usar dynamic imports para componentes pesados (gráficos, PDF)

```typescript
// src/app/(dashboard)/relatorios/page.tsx
import dynamic from 'next/dynamic';

const ReportsDashboard = dynamic(
  () => import('./_components/reports-dashboard'),
  { loading: () => <ReportsDashboardSkeleton /> }
);

const RechartsComponents = dynamic(
  () => import('recharts'),
  { ssr: false }
);
```

2. **Memoization**
   - Usar React.memo em componentes de gráficos
   - Usar useMemo para cálculos pesados

```typescript
export const LineChart = React.memo(function LineChart({ data, xKey, lines }: Props) {
  // Component implementation
});

function ReservationsReport() {
  const processedData = useMemo(() => {
    return processReservationsData(rawData, filters);
  }, [rawData, filters]);

  return <LineChart data={processedData} />;
}
```

3. **Virtualização de Tabelas**
   - Para tabelas com muitos registros (>100), usar virtualização

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedReportTable({ data }: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <TableRow data={data[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

4. **Debouncing de Filtros**
   - Evitar requisições excessivas ao digitar

```typescript
import { useDebouncedValue } from "@/_hooks/use-debounced-value";

function ReportFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 500);

  const { data } = useGetReservationsReport({
    ...filters,
    search: debouncedSearch,
  });
}
```

5. **Cache Strategy**
   - Configurar staleTime e cacheTime apropriados

```typescript
export function useGetReservationsReport(filters: ReportFilters) {
  return useQuery({
    queryKey: ["reservations-report", filters],
    queryFn: () => reportService.getReservationsReport(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    enabled: !!filters.startDate && !!filters.endDate,
  });
}
```

6. **Paginação Server-Side**
   - Para relatórios com muitos dados, implementar paginação

```typescript
interface PaginatedReportFilters extends ReportFilters {
  page: number;
  pageSize: number;
}

export function useGetPaginatedReservationsReport(
  filters: PaginatedReportFilters,
) {
  return useQuery({
    queryKey: ["reservations-report", filters],
    queryFn: () => reportService.getReservationsReport(filters),
    keepPreviousData: true, // Manter dados anteriores durante loading
  });
}
```

## Security Considerations

### Controle de Acesso

1. **Route Protection**
   - Todas as rotas de relatórios protegidas com ProtectedRoute
   - Verificação de role ADMIN em nível de página

```typescript
// src/app/(dashboard)/relatorios/layout.tsx
import { ProtectedRoute } from '@/_components/common/protected-route';

export default function RelatoriosLayout({ children }: Props) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      {children}
    </ProtectedRoute>
  );
}
```

2. **API Authorization**
   - Token JWT incluído em todas as requisições
   - Tratamento de 403 (Forbidden) com redirecionamento

3. **Data Sanitization**
   - Sanitizar inputs de filtros antes de enviar para API
   - Validar datas com Zod

```typescript
const reportFiltersSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.enum(["CONFIRMED", "CANCELLED", "ALL"]).optional(),
});
```

4. **Sensitive Data**
   - Mascarar CPF parcialmente em relatórios (123.456.**\*-**)
   - Não expor IDs internos em PDFs exportados

```typescript
function maskCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.***-**");
}
```

## Deployment Considerations

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_MAX_REPORT_PERIOD_DAYS=365
```

### Build Optimization

```typescript
// next.config.ts
const config = {
  // ... existing config
  experimental: {
    optimizePackageImports: ["recharts", "@react-pdf/renderer"],
  },
};
```

### Monitoring

Adicionar tracking de uso de relatórios:

```typescript
// src/_lib/analytics.ts
export function trackReportGeneration(
  reportType: ReportType,
  filters: ReportFilters,
) {
  // Implementar tracking (Google Analytics, Mixpanel, etc.)
  console.log("Report generated:", { reportType, filters });
}
```

## Future Enhancements

Possíveis melhorias futuras (fora do escopo inicial):

1. **Agendamento de Relatórios**
   - Permitir agendar geração automática de relatórios
   - Enviar por email periodicamente

2. **Relatórios Customizáveis**
   - Permitir admin criar relatórios personalizados
   - Salvar configurações de filtros favoritos

3. **Exportação em Outros Formatos**
   - Excel (.xlsx)
   - CSV
   - JSON

4. **Dashboards Interativos**
   - Drill-down em gráficos
   - Filtros interativos em tempo real

5. **Comparação de Períodos**
   - Comparar dois períodos lado a lado
   - Análise de tendências

6. **Alertas e Notificações**
   - Alertas automáticos para anomalias
   - Notificações de métricas críticas

7. **API de Relatórios**
   - Endpoints dedicados no backend para relatórios
   - Processamento server-side para melhor performance
