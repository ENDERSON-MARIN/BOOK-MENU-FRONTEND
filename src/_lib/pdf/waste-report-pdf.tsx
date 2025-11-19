import "dayjs/locale/pt-br";

import { Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";

import { ReportFilters, WasteReportData } from "@/_types/report";

import { formatReportDate, maskCPF } from "../report-utils";
import { ReportPDF, reportStyles } from "./report-pdf-template";

dayjs.locale("pt-br");

interface WasteReportPDFProps {
  data: WasteReportData;
  filters: ReportFilters;
}

export function WasteReportPDF({ data, filters }: WasteReportPDFProps) {
  // Função auxiliar para formatar valores monetários
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Função auxiliar para calcular percentual
  const calculatePercentage = (value: number, total: number): string => {
    if (total === 0) return "0.00";
    return ((value / total) * 100).toFixed(2);
  };

  return (
    <ReportPDF
      title="Relatório de Desperdício e Cancelamentos"
      period={{
        start: filters.startDate,
        end: filters.endDate,
      }}
    >
      {/* Seção 1: Resumo Geral */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>Resumo Geral</Text>
        <View style={reportStyles.statsGrid}>
          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Total Cancelamentos</Text>
            <Text style={reportStyles.statValue}>
              {data.summary.totalCancellations}
            </Text>
            <Text style={reportStyles.statDescription}>
              Reservas canceladas no período
            </Text>
          </View>

          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Taxa de Cancelamento</Text>
            <Text style={reportStyles.statValue}>
              {data.summary.cancellationRate.toFixed(2)}%
            </Text>
            <Text style={reportStyles.statDescription}>
              Percentual de cancelamentos
            </Text>
          </View>

          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Custo Estimado</Text>
            <Text style={reportStyles.statValue}>
              {formatCurrency(data.summary.estimatedWasteCost)}
            </Text>
            <Text style={reportStyles.statDescription}>
              Desperdício financeiro estimado
            </Text>
          </View>
        </View>
      </View>

      {/* Seção 2: Distribuição por Horário */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>
          Distribuição por Horário de Cancelamento
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={[reportStyles.statCard, { flex: 1 }]}>
            <Text style={reportStyles.statLabel}>Antes do Prazo</Text>
            <Text style={[reportStyles.statValue, { color: "#065f46" }]}>
              {data.timeDistribution.beforeDeadline}
            </Text>
            <Text style={reportStyles.statDescription}>
              {calculatePercentage(
                data.timeDistribution.beforeDeadline,
                data.summary.totalCancellations,
              )}
              % do total
            </Text>
            <Text style={[reportStyles.statDescription, { marginTop: 5 }]}>
              Cancelados antes das 8:30 AM
            </Text>
          </View>

          <View style={[reportStyles.statCard, { flex: 1 }]}>
            <Text style={reportStyles.statLabel}>Após o Prazo</Text>
            <Text style={[reportStyles.statValue, { color: "#991b1b" }]}>
              {data.timeDistribution.afterDeadline}
            </Text>
            <Text style={reportStyles.statDescription}>
              {calculatePercentage(
                data.timeDistribution.afterDeadline,
                data.summary.totalCancellations,
              )}
              % do total
            </Text>
            <Text style={[reportStyles.statDescription, { marginTop: 5 }]}>
              ⚠ Geraram desperdício
            </Text>
          </View>
        </View>

        {/* Alerta para cancelamentos após prazo */}
        {data.timeDistribution.afterDeadline > 0 && (
          <View style={[reportStyles.highlight, { marginTop: 15 }]}>
            <Text style={reportStyles.highlightText}>
              ⚠ ATENÇÃO: {data.timeDistribution.afterDeadline} cancelamentos
              foram realizados após o prazo limite (8:30 AM), resultando em
              desperdício de alimentos e custos desnecessários.
            </Text>
          </View>
        )}
      </View>

      {/* Seção 3: Análise de Padrões */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>Análise de Padrões</Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={[reportStyles.statCard, { flex: 1 }]}>
            <Text style={reportStyles.statLabel}>
              Cancelamentos de Última Hora
            </Text>
            <Text style={[reportStyles.statValue, { color: "#991b1b" }]}>
              {data.patterns.lastMinuteCancellations}
            </Text>
            <Text style={reportStyles.statDescription}>
              {calculatePercentage(
                data.patterns.lastMinuteCancellations,
                data.summary.totalCancellations,
              )}
              % do total
            </Text>
            <Text style={[reportStyles.statDescription, { marginTop: 5 }]}>
              Cancelados próximo ao horário limite
            </Text>
          </View>

          <View style={[reportStyles.statCard, { flex: 1 }]}>
            <Text style={reportStyles.statLabel}>Canceladores Recorrentes</Text>
            <Text style={[reportStyles.statValue, { color: "#92400e" }]}>
              {data.patterns.recurringCancellers}
            </Text>
            <Text style={reportStyles.statDescription}>
              Usuários com padrão de cancelamento
            </Text>
            <Text style={[reportStyles.statDescription, { marginTop: 5 }]}>
              Requerem atenção especial
            </Text>
          </View>
        </View>
      </View>

      {/* Seção 4: Top 10 Usuários com Mais Cancelamentos */}
      <View style={reportStyles.section} break>
        <Text style={reportStyles.sectionTitle}>
          Top 10 Usuários com Mais Cancelamentos
        </Text>
        {data.topCancellers && data.topCancellers.length > 0 ? (
          <View style={reportStyles.table}>
            <View style={[reportStyles.tableRow, reportStyles.tableHeader]}>
              <Text style={[reportStyles.tableHeaderCell, { flex: 0.5 }]}>
                #
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 1.5 }]}>
                Nome
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 1 }]}>
                CPF
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 0.8 }]}>
                Cancelamentos
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 0.8 }]}>
                Taxa
              </Text>
            </View>
            {data.topCancellers.map((user, index) => {
              const isHighRate = user.cancellationRate > 20;
              return (
                <View
                  key={user.userId}
                  style={
                    isHighRate
                      ? [reportStyles.tableRow, { backgroundColor: "#fee2e2" }]
                      : reportStyles.tableRow
                  }
                >
                  <Text style={[reportStyles.tableCell, { flex: 0.5 }]}>
                    {index + 1}
                  </Text>
                  <Text style={[reportStyles.tableCell, { flex: 1.5 }]}>
                    {user.userName}
                  </Text>
                  <Text style={[reportStyles.tableCell, { flex: 1 }]}>
                    {maskCPF(user.userCpf)}
                  </Text>
                  <Text
                    style={
                      isHighRate
                        ? [
                            reportStyles.tableCellBold,
                            { flex: 0.8, color: "#991b1b" },
                          ]
                        : [reportStyles.tableCellBold, { flex: 0.8 }]
                    }
                  >
                    {user.totalCancellations}
                  </Text>
                  <Text
                    style={
                      isHighRate
                        ? [
                            reportStyles.tableCellBold,
                            { flex: 0.8, color: "#991b1b" },
                          ]
                        : [reportStyles.tableCellBold, { flex: 0.8 }]
                    }
                  >
                    {user.cancellationRate.toFixed(2)}%
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={reportStyles.textMuted}>
            Nenhum dado de cancelamento disponível.
          </Text>
        )}

        {data.topCancellers && data.topCancellers.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={reportStyles.textMuted}>
              * Usuários destacados em vermelho possuem taxa de cancelamento
              acima de 20%
            </Text>
          </View>
        )}
      </View>

      {/* Seção 5: Evolução Temporal de Cancelamentos */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>
          Evolução Temporal de Cancelamentos
        </Text>
        {data.dailyTrend && data.dailyTrend.length > 0 ? (
          <View style={reportStyles.table}>
            <View style={[reportStyles.tableRow, reportStyles.tableHeader]}>
              <Text style={[reportStyles.tableHeaderCell, { flex: 1.5 }]}>
                Data
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 1 }]}>
                Cancelamentos
              </Text>
            </View>
            {data.dailyTrend.slice(0, 20).map((day, index) => (
              <View key={index} style={reportStyles.tableRow}>
                <Text style={[reportStyles.tableCell, { flex: 1.5 }]}>
                  {formatReportDate(day.date)}
                </Text>
                <Text style={[reportStyles.tableCellBold, { flex: 1 }]}>
                  {day.cancellations}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={reportStyles.textMuted}>
            Nenhum dado de tendência disponível.
          </Text>
        )}

        {data.dailyTrend && data.dailyTrend.length > 20 && (
          <View style={{ marginTop: 10 }}>
            <Text style={reportStyles.textMuted}>
              * Exibindo os primeiros 20 dias. Total de dias no período:{" "}
              {data.dailyTrend.length}
            </Text>
          </View>
        )}
      </View>

      {/* Seção 6: Insights e Recomendações */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>Insights e Recomendações</Text>
        <View>
          {/* Insight sobre taxa de cancelamento geral */}
          {data.summary.cancellationRate > 15 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={[reportStyles.text, { color: "#991b1b" }]}>
                ⚠ Taxa de cancelamento elevada (
                {data.summary.cancellationRate.toFixed(2)}%). Ações
                recomendadas:
              </Text>
              <Text style={reportStyles.textMuted}>
                • Implementar sistema de lembretes automáticos
              </Text>
              <Text style={reportStyles.textMuted}>
                • Revisar políticas de cancelamento e penalidades
              </Text>
              <Text style={reportStyles.textMuted}>
                • Realizar pesquisa para entender motivos dos cancelamentos
              </Text>
            </View>
          )}

          {/* Insight sobre cancelamentos após prazo */}
          {data.timeDistribution.afterDeadline > 0 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={[reportStyles.text, { color: "#991b1b" }]}>
                ⚠ Cancelamentos após prazo detectados (
                {data.timeDistribution.afterDeadline}). Ações recomendadas:
              </Text>
              <Text style={reportStyles.textMuted}>
                • Enviar lembretes sobre o prazo limite (8:30 AM)
              </Text>
              <Text style={reportStyles.textMuted}>
                • Considerar bloqueio de cancelamentos após o prazo
              </Text>
              <Text style={reportStyles.textMuted}>
                • Implementar penalidades para cancelamentos tardios
              </Text>
            </View>
          )}

          {/* Insight sobre canceladores recorrentes */}
          {data.patterns.recurringCancellers > 0 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={[reportStyles.text, { color: "#92400e" }]}>
                ⚠ Identificados {data.patterns.recurringCancellers} usuários
                com padrão recorrente de cancelamento. Ações recomendadas:
              </Text>
              <Text style={reportStyles.textMuted}>
                • Contato direto com usuários para entender dificuldades
              </Text>
              <Text style={reportStyles.textMuted}>
                • Avaliar se o sistema atende às necessidades desses usuários
              </Text>
              <Text style={reportStyles.textMuted}>
                • Considerar treinamento ou suporte adicional
              </Text>
            </View>
          )}

          {/* Insight sobre cancelamentos de última hora */}
          {data.patterns.lastMinuteCancellations > 0 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={[reportStyles.text, { color: "#92400e" }]}>
                ⚠ {data.patterns.lastMinuteCancellations} cancelamentos de
                última hora detectados. Ações recomendadas:
              </Text>
              <Text style={reportStyles.textMuted}>
                • Implementar notificações push próximo ao horário limite
              </Text>
              <Text style={reportStyles.textMuted}>
                • Facilitar processo de confirmação de presença
              </Text>
              <Text style={reportStyles.textMuted}>
                • Considerar sistema de confirmação obrigatória
              </Text>
            </View>
          )}

          {/* Insight sobre custo de desperdício */}
          {data.summary.estimatedWasteCost > 1000 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={[reportStyles.text, { color: "#991b1b" }]}>
                ⚠ Custo estimado de desperdício elevado (
                {formatCurrency(data.summary.estimatedWasteCost)}). Ações
                recomendadas:
              </Text>
              <Text style={reportStyles.textMuted}>
                • Revisar processo de planejamento de compras
              </Text>
              <Text style={reportStyles.textMuted}>
                • Implementar margem de segurança menor
              </Text>
              <Text style={reportStyles.textMuted}>
                • Considerar doação de excedentes para reduzir desperdício
              </Text>
            </View>
          )}

          {/* Mensagem positiva se métricas estiverem boas */}
          {data.summary.cancellationRate <= 15 &&
            data.timeDistribution.afterDeadline === 0 &&
            data.patterns.lastMinuteCancellations === 0 && (
              <View>
                <Text style={[reportStyles.text, { color: "#065f46" }]}>
                  ✓ As métricas de cancelamento estão dentro dos parâmetros
                  aceitáveis. Continue monitorando para manter os bons
                  resultados e identificar oportunidades de melhoria contínua.
                </Text>
              </View>
            )}
        </View>
      </View>

      {/* Seção 7: Impacto Financeiro */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>
          Análise de Impacto Financeiro
        </Text>
        <View style={reportStyles.highlight}>
          <Text style={reportStyles.text}>
            <Text style={reportStyles.textBold}>Custo Total Estimado: </Text>
            {formatCurrency(data.summary.estimatedWasteCost)}
          </Text>
          <Text style={reportStyles.text}>
            <Text style={reportStyles.textBold}>
              Custo Médio por Cancelamento:{" "}
            </Text>
            {data.summary.totalCancellations > 0
              ? formatCurrency(
                  data.summary.estimatedWasteCost /
                    data.summary.totalCancellations,
                )
              : "R$ 0,00"}
          </Text>
          <Text style={reportStyles.text}>
            <Text style={reportStyles.textBold}>
              Desperdício por Cancelamento Tardio:{" "}
            </Text>
            {data.timeDistribution.afterDeadline > 0
              ? formatCurrency(
                  data.summary.estimatedWasteCost /
                    data.timeDistribution.afterDeadline,
                )
              : "R$ 0,00"}
          </Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={reportStyles.textMuted}>
            * Valores estimados baseados em custo médio de R$ 15,00 por refeição
          </Text>
          <Text style={reportStyles.textMuted}>
            * Apenas cancelamentos após o prazo geram custo de desperdício real
          </Text>
        </View>
      </View>

      {/* Seção de Filtros Aplicados */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>Filtros Aplicados</Text>
        <View>
          <Text style={reportStyles.text}>
            <Text style={reportStyles.textBold}>Período: </Text>
            {formatReportDate(filters.startDate)} a{" "}
            {formatReportDate(filters.endDate)}
          </Text>
          <Text style={reportStyles.text}>
            <Text style={reportStyles.textBold}>Status: </Text>
            Canceladas
          </Text>
          <Text style={reportStyles.textMuted}>
            Este relatório analisa apenas reservas canceladas
          </Text>
        </View>
      </View>
    </ReportPDF>
  );
}
