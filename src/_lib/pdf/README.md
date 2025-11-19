# Módulo de Geração de PDF

Este módulo fornece funcionalidades completas para geração e exportação de relatórios em PDF.

## Estrutura de Arquivos

```
src/_lib/pdf/
├── generate-pdf.ts              # Funções principais de geração e download
├── report-pdf-template.tsx      # Template base para PDFs
├── reservations-report-pdf.tsx  # PDF de reservas
├── active-users-report-pdf.tsx  # PDF de usuários ativos
├── operational-stats-report-pdf.tsx  # PDF de estatísticas operacionais
├── waste-report-pdf.tsx         # PDF de desperdício
├── example-usage.md             # Exemplos de uso detalhados
└── README.md                    # Este arquivo
```

## Componentes Relacionados

```
src/_components/reports/
├── pdf-loading-modal.tsx        # Modal de loading durante geração
└── export-pdf-button.tsx        # Botão reutilizável para exportação
```

```
src/_hooks/
└── use-pdf-export.ts            # Hook para gerenciar exportação
```

## Início Rápido

### 1. Usando o Componente ExportPDFButton (Mais Simples)

```tsx
import { ExportPDFButton } from "@/_components/reports/export-pdf-button";
import { generateReportFilename, REPORT_TYPES } from "@/_lib/pdf/generate-pdf";
import { ReservationsReportPDF } from "@/_lib/pdf/reservations-report-pdf";

function MyReportPage() {
  const { data, isLoading } = useGetReservationsReport(filters);

  return (
    <ExportPDFButton
      pdfComponent={<ReservationsReportPDF data={data} filters={filters} />}
      filename={generateReportFilename(
        REPORT_TYPES.RESERVATIONS,
        filters.startDate,
        filters.endDate,
      )}
      disabled={isLoading || !data}
    />
  );
}
```

### 2. Usando o Hook Diretamente (Mais Controle)

```tsx
import { usePDFExport } from "@/_hooks/use-pdf-export";
import { PDFLoadingModal } from "@/_components/reports/pdf-loading-modal";

function MyReportPage() {
  const { exportPDF, isGenerating, progress } = usePDFExport();

  const handleExport = async () => {
    await exportPDF(<MyReportPDF data={data} />, "meu-relatorio.pdf");
  };

  return (
    <>
      <Button onClick={handleExport} disabled={isGenerating}>
        Exportar PDF
      </Button>
      <PDFLoadingModal isOpen={isGenerating} progress={progress} />
    </>
  );
}
```

## Funcionalidades

### ✅ Geração de PDF

- Conversão de componentes React em PDF
- Suporte a múltiplas páginas
- Formatação profissional

### ✅ Download Automático

- Download direto no navegador
- Nomenclatura padronizada de arquivos
- Suporte a nomes customizados

### ✅ Loading States

- Modal de loading durante geração
- Barra de progresso animada
- Mensagens contextuais

### ✅ Tratamento de Erros

- Mensagens de erro amigáveis
- Toast notifications automáticas
- Callbacks personalizáveis

### ✅ Nomenclatura Padrão

- Formato: `relatorio-[tipo]-[data-inicio]-[data-fim].pdf`
- Função utilitária `generateReportFilename()`
- Constantes para tipos de relatórios

## Tipos de Relatórios Disponíveis

```typescript
REPORT_TYPES.RESERVATIONS; // reservas-periodo
REPORT_TYPES.POPULAR_MENUS; // cardapios-populares
REPORT_TYPES.ACTIVE_USERS; // usuarios-ativos
REPORT_TYPES.OPERATIONAL_STATS; // estatisticas-operacionais
REPORT_TYPES.WASTE; // desperdicio-cancelamentos
```

## API Reference

### generateAndDownloadPDF()

```typescript
function generateAndDownloadPDF(
  component: ReactElement<DocumentProps>,
  filename: string,
  onProgress?: (progress: number) => void,
): Promise<void>;
```

Gera e faz download de um PDF.

**Parâmetros:**

- `component`: Componente React PDF a ser renderizado
- `filename`: Nome do arquivo (com ou sem extensão .pdf)
- `onProgress`: Callback opcional para acompanhar progresso (0-100)

**Throws:** Error se a geração falhar

### generateReportFilename()

```typescript
function generateReportFilename(
  reportType: string,
  startDate: string,
  endDate: string,
): string;
```

Gera nome padronizado para arquivo PDF.

**Parâmetros:**

- `reportType`: Tipo do relatório (use constantes REPORT_TYPES)
- `startDate`: Data inicial (formato ISO: YYYY-MM-DD)
- `endDate`: Data final (formato ISO: YYYY-MM-DD)

**Retorna:** Nome do arquivo formatado

### usePDFExport()

```typescript
function usePDFExport(options?: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}): {
  exportPDF: (component: ReactElement, filename: string) => Promise<void>;
  isGenerating: boolean;
  progress: number;
};
```

Hook para gerenciar exportação de PDF.

**Retorna:**

- `exportPDF`: Função para exportar PDF
- `isGenerating`: Estado de geração (true/false)
- `progress`: Progresso da geração (0-100)

## Estilos Disponíveis

O template base (`report-pdf-template.tsx`) exporta estilos reutilizáveis:

```typescript
import { reportStyles } from "@/_lib/pdf/report-pdf-template";

// Exemplos de estilos disponíveis:
reportStyles.section;
reportStyles.sectionTitle;
reportStyles.statsGrid;
reportStyles.statCard;
reportStyles.table;
reportStyles.tableRow;
reportStyles.badge;
// ... e muitos outros
```

Veja `example-usage.md` para lista completa de estilos.

## Cores da Empresa

```typescript
const colors = {
  primary: "#1b994b", // Verde principal
  secondary: "#e4e30d", // Amarelo
  success: "#10b981", // Verde claro
  danger: "#ef4444", // Vermelho
  warning: "#f59e0b", // Laranja
};
```

## Exemplos Completos

Veja `example-usage.md` para exemplos detalhados de:

- Uso básico do template
- Criação de tabelas
- Cards de estatísticas
- Badges e highlights
- Integração com componentes

## Troubleshooting

### PDF não está sendo gerado

1. Verifique se o componente é um `<Document>` válido do react-pdf
2. Confirme que todas as props necessárias estão sendo passadas
3. Verifique o console para erros de renderização

### Download não inicia

1. Verifique se o navegador permite downloads
2. Confirme que `file-saver` está instalado
3. Teste em modo de navegação anônima

### Erro de tipo TypeScript

1. Certifique-se de usar `ReactElement<DocumentProps>`
2. Importe os tipos corretos de `@react-pdf/renderer`
3. Veja exemplos em `example-usage.md`

## Dependências

- `@react-pdf/renderer`: ^4.3.1
- `file-saver`: ^2.0.5
- `@types/file-saver`: ^2.0.7
- `dayjs`: ^1.11.19

## Contribuindo

Ao criar novos relatórios PDF:

1. Crie o componente em `src/_lib/pdf/[nome]-report-pdf.tsx`
2. Use o template base `ReportPDF`
3. Reutilize estilos de `reportStyles`
4. Adicione o tipo em `REPORT_TYPES`
5. Documente em `example-usage.md`

## Suporte

Para dúvidas ou problemas:

1. Consulte `example-usage.md`
2. Verifique os componentes existentes como referência
3. Revise a documentação do react-pdf: https://react-pdf.org/
