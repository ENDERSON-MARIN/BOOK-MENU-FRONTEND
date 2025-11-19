import "dayjs/locale/pt-br";

import { Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";

import { ReportFilters, ReservationReportData } from "@/_types/report";

import { formatReportDate, maskCPF } from "../report-utils";
import { ReportPDF, reportStyles } from "./report-pdf-template";

dayjs.locale("pt-br");

interface ReservationsReportPDFProps {
  data: ReservationReportData;
  filters: ReportFilters;
}

export function ReservationsReportPDF({
  data,
  filters,
}: ReservationsReportPDFProps) {
  // Função auxiliar para formatar status
  const getStatusLabel = (status: string): string => {
    const statusMap: Record<string, string> = {
      CONFIRMED: "Confirmada",
      CANCELLED: "Cancelada",
      PENDING: "Pendente",
    };
    return statusMap[status] || status;
  };

  // Função auxiliar para obter estilo do badge de status
  const getStatusBadgeStyle = (status: string) => {
    if (status === "CONFIRMED") {
      return [reportStyles.badge, reportStyles.badgeSuccess];
    }
    if (status === "CANCELLED") {
      return [reportStyles.badge, reportStyles.badgeDanger];
    }
    return [reportStyles.badge, reportStyles.badgeWarning];
  };

  return (
    <ReportPDF
      title="Relatório de Reservas por Período"
      period={{
        start: filters.startDate,
        end: filters.endDate,
      }}
    >
      {/* Seção de Estatísticas Resumidas */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>Resumo Geral</Text>
        <View style={reportStyles.statsGrid}>
          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Total de Reservas</Text>
            <Text style={reportStyles.statValue}>
              {data.summary.totalReservations}
            </Text>
            <Text style={reportStyles.statDescription}>
              Todas as reservas no período
            </Text>
          </View>

          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Reservas Ativas</Text>
            <Text style={reportStyles.statValue}>
              {data.summary.activeReservations}
            </Text>
            <Text style={reportStyles.statDescription}>
              Reservas confirmadas
            </Text>
          </View>

          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Canceladas</Text>
            <Text style={reportStyles.statValue}>
              {data.summary.cancelledReservations}
            </Text>
            <Text style={reportStyles.statDescription}>
              Reservas canceladas
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
        </View>
      </View>

      {/* Seção de Dados Semanais */}
      {data.weeklyData && data.weeklyData.length > 0 && (
        <View style={reportStyles.section}>
          <Text style={reportStyles.sectionTitle}>Resumo Semanal</Text>
          <View style={reportStyles.table}>
            <View style={[reportStyles.tableRow, reportStyles.tableHeader]}>
              <Text style={reportStyles.tableHeaderCell}>Semana</Text>
              <Text style={reportStyles.tableHeaderCell}>
                Total de Reservas
              </Text>
            </View>
            {data.weeklyData.map((week, index) => (
              <View key={index} style={reportStyles.tableRow}>
                <Text style={reportStyles.tableCell}>
                  {formatReportDate(week.weekStart)} a{" "}
                  {formatReportDate(week.weekEnd)}
                </Text>
                <Text style={reportStyles.tableCellBold}>{week.total}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Seção de Detalhamento de Reservas */}
      <View style={reportStyles.section} break>
        <Text style={reportStyles.sectionTitle}>Detalhamento de Reservas</Text>
        {data.reservations && data.reservations.length > 0 ? (
          <View style={reportStyles.table}>
            <View style={[reportStyles.tableRow, reportStyles.tableHeader]}>
              <Text style={[reportStyles.tableHeaderCell, { flex: 0.8 }]}>
                Data
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 1.2 }]}>
                Usuário
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 0.8 }]}>
                CPF
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 1.5 }]}>
                Cardápio
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 0.8 }]}>
                Variação
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 0.7 }]}>
                Status
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 0.6 }]}>
                Tipo
              </Text>
            </View>
            {data.reservations.slice(0, 50).map((reservation) => (
              <View key={reservation.id} style={reportStyles.tableRow}>
                <Text style={[reportStyles.tableCell, { flex: 0.8 }]}>
                  {formatReportDate(reservation.date)}
                </Text>
                <Text style={[reportStyles.tableCell, { flex: 1.2 }]}>
                  {reservation.userName}
                </Text>
                <Text style={[reportStyles.tableCell, { flex: 0.8 }]}>
                  {maskCPF(reservation.userCpf)}
                </Text>
                <Text style={[reportStyles.tableCell, { flex: 1.5 }]}>
                  {reservation.menuSummary}
                </Text>
                <Text style={[reportStyles.tableCell, { flex: 0.8 }]}>
                  {reservation.variation}
                </Text>
                <Text style={[reportStyles.tableCell, { flex: 0.7 }]}>
                  <Text style={getStatusBadgeStyle(reservation.status)}>
                    {getStatusLabel(reservation.status)}
                  </Text>
                </Text>
                <Text style={[reportStyles.tableCell, { flex: 0.6 }]}>
                  {reservation.isAutomatic ? "Auto" : "Manual"}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={reportStyles.textMuted}>
            Nenhuma reserva encontrada no período selecionado.
          </Text>
        )}

        {data.reservations && data.reservations.length > 50 && (
          <View style={reportStyles.highlight}>
            <Text style={reportStyles.highlightText}>
              ⚠ Este relatório exibe as primeiras 50 reservas. Total de
              reservas no período: {data.reservations.length}
            </Text>
          </View>
        )}
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
          {filters.status && filters.status !== "ALL" && (
            <Text style={reportStyles.text}>
              <Text style={reportStyles.textBold}>Status: </Text>
              {getStatusLabel(filters.status)}
            </Text>
          )}
          {filters.reservationType && filters.reservationType !== "ALL" && (
            <Text style={reportStyles.text}>
              <Text style={reportStyles.textBold}>Tipo de Reserva: </Text>
              {filters.reservationType === "AUTOMATIC"
                ? "Automática"
                : "Manual"}
            </Text>
          )}
          {(!filters.status || filters.status === "ALL") &&
            (!filters.reservationType || filters.reservationType === "ALL") && (
              <Text style={reportStyles.textMuted}>
                Nenhum filtro adicional aplicado
              </Text>
            )}
        </View>
      </View>
    </ReportPDF>
  );
}
