import "dayjs/locale/pt-br";

import { Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";

import { OperationalStatsReportData, ReportFilters } from "@/_types/report";

import { formatReportDate } from "../report-utils";
import { ReportPDF, reportStyles } from "./report-pdf-template";

dayjs.locale("pt-br");

interface OperationalStatsReportPDFProps {
  data: OperationalStatsReportData;
  filters: ReportFilters;
}

export function OperationalStatsReportPDF({
  data,
  filters,
}: OperationalStatsReportPDFProps) {
  // Função auxiliar para formatar tendência de crescimento
  const formatGrowthTrend = (percentageChange: number): string => {
    const sign = percentageChange >= 0 ? "+" : "";
    return `${sign}${percentageChange.toFixed(2)}%`;
  };

  // Função auxiliar para obter estilo de tendência
  const getTrendStyle = (percentageChange: number) => {
    if (percentageChange > 0) {
      return { color: "#065f46" }; // Verde para crescimento
    } else if (percentageChange < 0) {
      return { color: "#991b1b" }; // Vermelho para decrescimento
    }
    return { color: "#666666" }; // Cinza para neutro
  };

  return (
    <ReportPDF
      title="Relatório de Estatísticas Operacionais"
      period={{
        start: filters.startDate,
        end: filters.endDate,
      }}
    >
      {/* Seção 1: Métricas de Reservas */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>Métricas de Reservas</Text>
        <View style={reportStyles.statsGrid}>
          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Total de Reservas</Text>
            <Text style={reportStyles.statValue}>
              {data.reservationMetrics.total}
            </Text>
            <Text style={reportStyles.statDescription}>
              No período selecionado
            </Text>
          </View>

          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Média Diária</Text>
            <Text style={reportStyles.statValue}>
              {data.reservationMetrics.dailyAverage.toFixed(1)}
            </Text>
            <Text style={reportStyles.statDescription}>Reservas por dia</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={reportStyles.text}>
            <Text style={reportStyles.textBold}>Dia com Mais Reservas: </Text>
            {formatReportDate(data.reservationMetrics.peakDay.date)} (
            {data.reservationMetrics.peakDay.count} reservas)
          </Text>
          <Text style={reportStyles.text}>
            <Text style={reportStyles.textBold}>Dia com Menos Reservas: </Text>
            {formatReportDate(data.reservationMetrics.lowestDay.date)} (
            {data.reservationMetrics.lowestDay.count} reservas)
          </Text>
        </View>
      </View>

      {/* Seção 2: Métricas de Usuários */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>Métricas de Usuários</Text>
        <View style={reportStyles.statsGrid}>
          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Usuários Ativos</Text>
            <Text style={reportStyles.statValue}>
              {data.userMetrics.totalActive}
            </Text>
            <Text style={reportStyles.statDescription}>
              Fizeram pelo menos uma reserva
            </Text>
          </View>

          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Taxa de Adesão</Text>
            <Text style={reportStyles.statValue}>
              {data.userMetrics.adherenceRate.toFixed(2)}%
            </Text>
            <Text style={reportStyles.statDescription}>
              Percentual de usuários ativos
            </Text>
          </View>

          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Novos Usuários</Text>
            <Text style={reportStyles.statValue}>
              {data.userMetrics.newUsers}
            </Text>
            <Text style={reportStyles.statDescription}>
              Primeira reserva no período
            </Text>
          </View>
        </View>
      </View>

      {/* Seção 3: Métricas de Cardápios */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>Métricas de Cardápios</Text>
        <View style={reportStyles.statsGrid}>
          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Total de Cardápios</Text>
            <Text style={reportStyles.statValue}>
              {data.menuMetrics.totalMenus}
            </Text>
            <Text style={reportStyles.statDescription}>
              Cardápios disponibilizados
            </Text>
          </View>

          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Média por Cardápio</Text>
            <Text style={reportStyles.statValue}>
              {data.menuMetrics.averageReservationsPerMenu.toFixed(1)}
            </Text>
            <Text style={reportStyles.statDescription}>
              Reservas por cardápio
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={reportStyles.text}>
            <Text style={reportStyles.textBold}>Cardápio Mais Popular: </Text>
            {formatReportDate(data.menuMetrics.mostPopularMenu.date)} (
            {data.menuMetrics.mostPopularMenu.reservations} reservas)
          </Text>
        </View>
      </View>

      {/* Seção 4: Métricas de Cancelamento */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>Métricas de Cancelamento</Text>
        <View style={reportStyles.statsGrid}>
          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Total Cancelamentos</Text>
            <Text style={reportStyles.statValue}>
              {data.cancellationMetrics.total}
            </Text>
            <Text style={reportStyles.statDescription}>
              Reservas canceladas
            </Text>
          </View>

          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Taxa de Cancelamento</Text>
            <Text style={reportStyles.statValue}>
              {data.cancellationMetrics.rate.toFixed(2)}%
            </Text>
            <Text style={reportStyles.statDescription}>
              Percentual de cancelamentos
            </Text>
          </View>

          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Horário Médio</Text>
            <Text style={reportStyles.statValue}>
              {data.cancellationMetrics.averageTime}
            </Text>
            <Text style={reportStyles.statDescription}>
              Hora média de cancelamento
            </Text>
          </View>
        </View>
      </View>

      {/* Seção 5: Distribuição por Dia da Semana */}
      <View style={reportStyles.section} break>
        <Text style={reportStyles.sectionTitle}>
          Distribuição por Dia da Semana
        </Text>
        {data.dayOfWeekDistribution && data.dayOfWeekDistribution.length > 0 ? (
          <View style={reportStyles.table}>
            <View style={[reportStyles.tableRow, reportStyles.tableHeader]}>
              <Text style={[reportStyles.tableHeaderCell, { flex: 1.5 }]}>
                Dia da Semana
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 1 }]}>
                Total de Reservas
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 1 }]}>
                Percentual
              </Text>
            </View>
            {data.dayOfWeekDistribution.map((day, index) => {
              const percentage =
                data.reservationMetrics.total > 0
                  ? (day.count / data.reservationMetrics.total) * 100
                  : 0;
              return (
                <View key={index} style={reportStyles.tableRow}>
                  <Text style={[reportStyles.tableCell, { flex: 1.5 }]}>
                    {day.dayOfWeek}
                  </Text>
                  <Text style={[reportStyles.tableCellBold, { flex: 1 }]}>
                    {day.count}
                  </Text>
                  <Text style={[reportStyles.tableCell, { flex: 1 }]}>
                    {percentage.toFixed(2)}%
                  </Text>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={reportStyles.textMuted}>
            Nenhum dado de distribuição disponível.
          </Text>
        )}
      </View>

      {/* Seção 6: Distribuição por Variação */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>
          Distribuição por Variação de Cardápio
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={[reportStyles.statCard, { flex: 1 }]}>
            <Text style={reportStyles.statLabel}>Padrão</Text>
            <Text style={reportStyles.statValue}>
              {data.variationDistribution.standard}
            </Text>
            <Text style={reportStyles.statDescription}>
              {data.reservationMetrics.total > 0
                ? (
                    (data.variationDistribution.standard /
                      data.reservationMetrics.total) *
                    100
                  ).toFixed(1)
                : 0}
              % do total
            </Text>
          </View>

          <View style={[reportStyles.statCard, { flex: 1 }]}>
            <Text style={reportStyles.statLabel}>Com Ovo</Text>
            <Text style={reportStyles.statValue}>
              {data.variationDistribution.withEgg}
            </Text>
            <Text style={reportStyles.statDescription}>
              {data.reservationMetrics.total > 0
                ? (
                    (data.variationDistribution.withEgg /
                      data.reservationMetrics.total) *
                    100
                  ).toFixed(1)
                : 0}
              % do total
            </Text>
          </View>
        </View>
      </View>

      {/* Seção 7: Tendência de Crescimento */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>Tendência de Crescimento</Text>
        <View style={reportStyles.highlight}>
          <Text style={reportStyles.text}>
            <Text style={reportStyles.textBold}>Período Atual: </Text>
            {data.growthTrend.currentPeriod} reservas
          </Text>
          <Text style={reportStyles.text}>
            <Text style={reportStyles.textBold}>Período Anterior: </Text>
            {data.growthTrend.previousPeriod} reservas
          </Text>
          <Text
            style={[
              reportStyles.text,
              reportStyles.textBold,
              getTrendStyle(data.growthTrend.percentageChange),
            ]}
          >
            Variação: {formatGrowthTrend(data.growthTrend.percentageChange)}
          </Text>
        </View>

        {data.growthTrend.percentageChange > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={[reportStyles.text, { color: "#065f46" }]}>
              ✓ Crescimento positivo em relação ao período anterior. Continue
              monitorando as métricas para manter a tendência.
            </Text>
          </View>
        )}

        {data.growthTrend.percentageChange < 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={[reportStyles.text, { color: "#991b1b" }]}>
              ⚠ Redução em relação ao período anterior. Considere investigar
              possíveis causas e implementar ações corretivas.
            </Text>
          </View>
        )}

        {data.growthTrend.percentageChange === 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={[reportStyles.text, { color: "#666666" }]}>
              → Estabilidade em relação ao período anterior. Mantenha o
              monitoramento das operações.
            </Text>
          </View>
        )}
      </View>

      {/* Seção 8: Insights e Recomendações */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>Insights e Recomendações</Text>
        <View>
          {/* Insight sobre taxa de cancelamento */}
          {data.cancellationMetrics.rate > 15 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={[reportStyles.text, { color: "#991b1b" }]}>
                ⚠ Taxa de cancelamento elevada (
                {data.cancellationMetrics.rate.toFixed(2)}%). Recomenda-se:
              </Text>
              <Text style={reportStyles.textMuted}>
                • Investigar motivos dos cancelamentos
              </Text>
              <Text style={reportStyles.textMuted}>
                • Revisar políticas de cancelamento
              </Text>
              <Text style={reportStyles.textMuted}>
                • Considerar lembretes automáticos aos usuários
              </Text>
            </View>
          )}

          {/* Insight sobre taxa de adesão */}
          {data.userMetrics.adherenceRate < 50 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={[reportStyles.text, { color: "#92400e" }]}>
                ⚠ Taxa de adesão abaixo de 50% (
                {data.userMetrics.adherenceRate.toFixed(2)}%). Recomenda-se:
              </Text>
              <Text style={reportStyles.textMuted}>
                • Campanhas de engajamento com usuários inativos
              </Text>
              <Text style={reportStyles.textMuted}>
                • Pesquisa de satisfação para entender barreiras
              </Text>
              <Text style={reportStyles.textMuted}>
                • Melhorias na divulgação dos cardápios
              </Text>
            </View>
          )}

          {/* Insight sobre média de reservas por cardápio */}
          {data.menuMetrics.averageReservationsPerMenu < 20 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={[reportStyles.text, { color: "#92400e" }]}>
                ⚠ Média baixa de reservas por cardápio (
                {data.menuMetrics.averageReservationsPerMenu.toFixed(1)}).
                Recomenda-se:
              </Text>
              <Text style={reportStyles.textMuted}>
                • Revisar variedade e qualidade dos cardápios
              </Text>
              <Text style={reportStyles.textMuted}>
                • Coletar feedback dos usuários sobre preferências
              </Text>
              <Text style={reportStyles.textMuted}>
                • Considerar opções mais atrativas
              </Text>
            </View>
          )}

          {/* Mensagem positiva se tudo estiver bem */}
          {data.cancellationMetrics.rate <= 15 &&
            data.userMetrics.adherenceRate >= 50 &&
            data.menuMetrics.averageReservationsPerMenu >= 20 && (
              <View>
                <Text style={[reportStyles.text, { color: "#065f46" }]}>
                  ✓ As métricas operacionais estão dentro dos parâmetros
                  esperados. Continue monitorando para manter a qualidade do
                  serviço.
                </Text>
              </View>
            )}
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
          <Text style={reportStyles.textMuted}>
            Nenhum filtro adicional aplicado
          </Text>
        </View>
      </View>
    </ReportPDF>
  );
}
