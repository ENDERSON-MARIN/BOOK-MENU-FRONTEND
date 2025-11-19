# Exemplo de Uso do Template PDF

## Uso Básico

```tsx
import { ReportPDF, reportStyles } from "@/_lib/pdf/report-pdf-template";
import { Text, View } from "@react-pdf/renderer";

function MyReportPDF() {
  return (
    <ReportPDF
      title="Relatório de Reservas por Período"
      period={{
        start: "2025-11-01",
        end: "2025-11-30",
      }}
    >
      {/* Seção de Estatísticas */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>Resumo</Text>
        <View style={reportStyles.statsGrid}>
          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Total de Reservas</Text>
            <Text style={reportStyles.statValue}>150</Text>
            <Text style={reportStyles.statDescription}>No período</Text>
          </View>
          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Reservas Ativas</Text>
            <Text style={reportStyles.statValue}>135</Text>
          </View>
        </View>
      </View>

      {/* Seção de Tabela */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>Detalhamento</Text>
        <View style={reportStyles.table}>
          <View style={[reportStyles.tableRow, reportStyles.tableHeader]}>
            <Text style={reportStyles.tableHeaderCell}>Data</Text>
            <Text style={reportStyles.tableHeaderCell}>Usuário</Text>
            <Text style={reportStyles.tableHeaderCell}>Status</Text>
          </View>
          <View style={reportStyles.tableRow}>
            <Text style={reportStyles.tableCell}>01/11/2025</Text>
            <Text style={reportStyles.tableCell}>João Silva</Text>
            <Text style={reportStyles.tableCell}>Confirmada</Text>
          </View>
        </View>
      </View>
    </ReportPDF>
  );
}
```

## Estilos Disponíveis

### Layout

- `section`: Container para seções do relatório
- `sectionTitle`: Título de seção
- `divider`: Linha divisória

### Estatísticas

- `statsGrid`: Grid para cards de estatísticas
- `statCard`: Card individual de estatística
- `statLabel`: Label da estatística
- `statValue`: Valor da estatística
- `statDescription`: Descrição adicional

### Tabelas

- `table`: Container da tabela
- `tableRow`: Linha da tabela
- `tableHeader`: Linha de cabeçalho
- `tableHeaderCell`: Célula de cabeçalho
- `tableCell`: Célula normal
- `tableCellBold`: Célula em negrito

### Badges

- `badge`: Badge base
- `badgeSuccess`: Badge verde (sucesso)
- `badgeDanger`: Badge vermelho (erro)
- `badgeWarning`: Badge amarelo (aviso)
- `badgeInfo`: Badge azul (informação)

### Texto

- `text`: Texto normal
- `textBold`: Texto em negrito
- `textMuted`: Texto esmaecido
- `highlight`: Destaque com fundo amarelo
- `highlightText`: Texto destacado

## Cores da Empresa

- **Verde Principal**: #1b994b
- **Amarelo**: #e4e30d
- **Sucesso**: #10b981
- **Perigo**: #ef4444
- **Aviso**: #f59e0b

---

# Geração e Download de PDF

## Importações Necessárias

```typescript
import { usePDFExport } from "@/_hooks/use-pdf-export";
import { PDFLoadingModal } from "@/_components/reports/pdf-loading-modal";
import { generateReportFilename, REPORT_TYPES } from "@/_lib/pdf/generate-pdf";
import { ReservationsReportPDF } from "@/_lib/pdf/reservations-report-pdf";
```

## Uso Básico com ExportPDFButton (Recomendado)

```typescript
import { ExportPDFButton } from "@/_components/reports/export-pdf-button";

function ReservationsReportPage() {
  const { data, isLoading } = useGetReservationsReport(filters);

  const filename = generateReportFilename(
    REPORT_TYPES.RESERVATIONS,
    filters.startDate,
    filters.endDate
  );

  return (
    <div>
      <ExportPDFButton
        pdfComponent={<ReservationsReportPDF data={data} filters={filters} />}
        filename={filename}
        disabled={isLoading || !data}
      />

      {/* Resto do conteúdo do relatório */}
    </div>
  );
}
```

## Uso Avançado com Hook Direto

```typescript
function ReservationsReportPage() {
  const { data, isLoading } = useGetReservationsReport(filters);
  const { exportPDF, isGenerating, progress } = usePDFExport();

  const handleExportPDF = async () => {
    if (!data) return;

    const filename = generateReportFilename(
      REPORT_TYPES.RESERVATIONS,
      filters.startDate,
      filters.endDate
    );

    await exportPDF(
      <ReservationsReportPDF data={data} filters={filters} />,
      filename
    );
  };

  return (
    <div>
      <Button
        onClick={handleExportPDF}
        disabled={isLoading || !data || isGenerating}
      >
        <Download className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>

      {/* Modal de loading */}
      <PDFLoadingModal isOpen={isGenerating} progress={progress} />

      {/* Resto do conteúdo do relatório */}
    </div>
  );
}
```

## Uso com Callbacks Personalizados

```typescript
function MyReportPage() {
  const { exportPDF, isGenerating, progress } = usePDFExport({
    onSuccess: () => {
      console.log("PDF gerado com sucesso!");
      // Executar ações adicionais após sucesso
    },
    onError: (error) => {
      console.error("Erro ao gerar PDF:", error);
      // Tratamento de erro personalizado
    },
  });

  // ... resto do código
}
```

## Tipos de Relatórios Disponíveis

```typescript
REPORT_TYPES.RESERVATIONS; // "reservas-periodo"
REPORT_TYPES.POPULAR_MENUS; // "cardapios-populares"
REPORT_TYPES.ACTIVE_USERS; // "usuarios-ativos"
REPORT_TYPES.OPERATIONAL_STATS; // "estatisticas-operacionais"
REPORT_TYPES.WASTE; // "desperdicio-cancelamentos"
```

## Nomenclatura de Arquivos

Os arquivos PDF seguem o padrão:
`relatorio-[tipo]-[data-inicio]-[data-fim].pdf`

Exemplo:
`relatorio-reservas-periodo-2025-11-01-2025-11-30.pdf`

## Tratamento de Erros

O hook `usePDFExport` automaticamente:

- Exibe toast de sucesso quando o PDF é gerado
- Exibe toast de erro em caso de falha
- Gerencia o estado de loading e progresso
- Reseta o estado após conclusão ou erro

## Estados do Modal de Loading

O modal exibe diferentes mensagens baseadas no progresso:

- 0-29%: "Preparando dados..."
- 30-69%: "Gerando documento..."
- 70-99%: "Finalizando..."
- 100%: "Concluído!"

## Funções Utilitárias

### generateAndDownloadPDF

Gera e faz download de um PDF a partir de um componente React PDF.

```typescript
await generateAndDownloadPDF(
  <MyReportPDF data={data} />,
  "meu-relatorio.pdf",
  (progress) => console.log(`Progresso: ${progress}%`)
);
```

### generateReportFilename

Gera o nome padrão do arquivo PDF seguindo o padrão estabelecido.

```typescript
const filename = generateReportFilename(
  REPORT_TYPES.RESERVATIONS,
  "2025-11-01",
  "2025-11-30",
);
// Resultado: "relatorio-reservas-periodo-2025-11-01-2025-11-30.pdf"
```
