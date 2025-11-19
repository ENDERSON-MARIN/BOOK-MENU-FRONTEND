import "dayjs/locale/pt-br";

import { Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";

import { ActiveUsersReportData, ReportFilters } from "@/_types/report";

import { formatReportDate, maskCPF } from "../report-utils";
import { ReportPDF, reportStyles } from "./report-pdf-template";

dayjs.locale("pt-br");

interface ActiveUsersReportPDFProps {
  data: ActiveUsersReportData;
  filters: ReportFilters;
}

export function ActiveUsersReportPDF({
  data,
  filters,
}: ActiveUsersReportPDFProps) {
  // Função auxiliar para formatar tipo de usuário
  const getUserTypeLabel = (userType: "FIXO" | "NAO_FIXO"): string => {
    return userType === "FIXO" ? "Fixo" : "Não Fixo";
  };

  // Função auxiliar para verificar se a taxa de cancelamento é alta
  const isHighCancellationRate = (rate: number): boolean => {
    return rate > 20;
  };

  return (
    <ReportPDF
      title="Relatório de Usuários Ativos"
      period={{
        start: filters.startDate,
        end: filters.endDate,
      }}
    >
      {/* Seção de Estatísticas Gerais */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>Resumo Geral</Text>
        <View style={reportStyles.statsGrid}>
          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Usuários Ativos</Text>
            <Text style={reportStyles.statValue}>
              {data.summary.totalActiveUsers}
            </Text>
            <Text style={reportStyles.statDescription}>
              Fizeram pelo menos uma reserva
            </Text>
          </View>

          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Total Cadastrados</Text>
            <Text style={reportStyles.statValue}>
              {data.summary.totalRegisteredUsers}
            </Text>
            <Text style={reportStyles.statDescription}>
              Usuários no sistema
            </Text>
          </View>

          <View style={reportStyles.statCard}>
            <Text style={reportStyles.statLabel}>Taxa de Adesão</Text>
            <Text style={reportStyles.statValue}>
              {data.summary.adherenceRate.toFixed(2)}%
            </Text>
            <Text style={reportStyles.statDescription}>
              Percentual de usuários ativos
            </Text>
          </View>
        </View>
      </View>

      {/* Seção de Distribuição por Tipo */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>
          Distribuição por Tipo de Usuário
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={[reportStyles.statCard, { flex: 1 }]}>
            <Text style={reportStyles.statLabel}>Usuários Fixos</Text>
            <Text style={reportStyles.statValue}>
              {data.userTypeDistribution.fixo}
            </Text>
            <Text style={reportStyles.statDescription}>
              {data.summary.totalActiveUsers > 0
                ? (
                    (data.userTypeDistribution.fixo /
                      data.summary.totalActiveUsers) *
                    100
                  ).toFixed(1)
                : 0}
              % do total
            </Text>
          </View>

          <View style={[reportStyles.statCard, { flex: 1 }]}>
            <Text style={reportStyles.statLabel}>Usuários Não Fixos</Text>
            <Text style={reportStyles.statValue}>
              {data.userTypeDistribution.naoFixo}
            </Text>
            <Text style={reportStyles.statDescription}>
              {data.summary.totalActiveUsers > 0
                ? (
                    (data.userTypeDistribution.naoFixo /
                      data.summary.totalActiveUsers) *
                    100
                  ).toFixed(1)
                : 0}
              % do total
            </Text>
          </View>
        </View>
      </View>

      {/* Seção de Detalhamento de Usuários */}
      <View style={reportStyles.section} break>
        <Text style={reportStyles.sectionTitle}>
          Detalhamento de Usuários Ativos
        </Text>
        {data.users && data.users.length > 0 ? (
          <View style={reportStyles.table}>
            <View style={[reportStyles.tableRow, reportStyles.tableHeader]}>
              <Text style={[reportStyles.tableHeaderCell, { flex: 1.5 }]}>
                Nome
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 1 }]}>
                CPF
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 0.8 }]}>
                Tipo
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 0.7 }]}>
                Reservas
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 0.8 }]}>
                Canceladas
              </Text>
              <Text style={[reportStyles.tableHeaderCell, { flex: 0.9 }]}>
                Taxa Cancel.
              </Text>
            </View>
            {data.users.slice(0, 50).map((user) => (
              <View key={user.userId} style={reportStyles.tableRow}>
                <Text style={[reportStyles.tableCell, { flex: 1.5 }]}>
                  {user.name}
                </Text>
                <Text style={[reportStyles.tableCell, { flex: 1 }]}>
                  {maskCPF(user.cpf)}
                </Text>
                <Text style={[reportStyles.tableCell, { flex: 0.8 }]}>
                  {getUserTypeLabel(user.userType)}
                </Text>
                <Text style={[reportStyles.tableCellBold, { flex: 0.7 }]}>
                  {user.totalReservations}
                </Text>
                <Text style={[reportStyles.tableCell, { flex: 0.8 }]}>
                  {user.cancelledReservations}
                </Text>
                <Text
                  style={
                    isHighCancellationRate(user.cancellationRate)
                      ? [
                          reportStyles.tableCellBold,
                          { flex: 0.9, color: "#991b1b" },
                        ]
                      : [reportStyles.tableCell, { flex: 0.9 }]
                  }
                >
                  {user.cancellationRate.toFixed(2)}%
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={reportStyles.textMuted}>
            Nenhum usuário ativo encontrado no período selecionado.
          </Text>
        )}

        {data.users && data.users.length > 50 && (
          <View style={reportStyles.highlight}>
            <Text style={reportStyles.highlightText}>
              ⚠ Este relatório exibe os primeiros 50 usuários. Total de
              usuários ativos no período: {data.users.length}
            </Text>
          </View>
        )}
      </View>

      {/* Seção de Alertas */}
      {data.users &&
        data.users.filter((u) => u.cancellationRate > 20).length > 0 && (
          <View style={reportStyles.section}>
            <Text style={reportStyles.sectionTitle}>
              Usuários com Alta Taxa de Cancelamento
            </Text>
            <View style={reportStyles.highlight}>
              <Text style={reportStyles.highlightText}>
                ⚠ {data.users.filter((u) => u.cancellationRate > 20).length}{" "}
                usuário(s) com taxa de cancelamento acima de 20%. Considere
                entrar em contato para entender os motivos.
              </Text>
            </View>
            <View style={reportStyles.table}>
              <View style={[reportStyles.tableRow, reportStyles.tableHeader]}>
                <Text style={[reportStyles.tableHeaderCell, { flex: 1.5 }]}>
                  Nome
                </Text>
                <Text style={[reportStyles.tableHeaderCell, { flex: 1 }]}>
                  CPF
                </Text>
                <Text style={[reportStyles.tableHeaderCell, { flex: 0.8 }]}>
                  Total Reservas
                </Text>
                <Text style={[reportStyles.tableHeaderCell, { flex: 0.8 }]}>
                  Canceladas
                </Text>
                <Text style={[reportStyles.tableHeaderCell, { flex: 0.9 }]}>
                  Taxa Cancel.
                </Text>
              </View>
              {data.users
                .filter((u) => u.cancellationRate > 20)
                .slice(0, 20)
                .map((user) => (
                  <View key={user.userId} style={reportStyles.tableRow}>
                    <Text style={[reportStyles.tableCell, { flex: 1.5 }]}>
                      {user.name}
                    </Text>
                    <Text style={[reportStyles.tableCell, { flex: 1 }]}>
                      {maskCPF(user.cpf)}
                    </Text>
                    <Text style={[reportStyles.tableCell, { flex: 0.8 }]}>
                      {user.totalReservations}
                    </Text>
                    <Text style={[reportStyles.tableCell, { flex: 0.8 }]}>
                      {user.cancelledReservations}
                    </Text>
                    <Text
                      style={[
                        reportStyles.tableCellBold,
                        { flex: 0.9, color: "#991b1b" },
                      ]}
                    >
                      {user.cancellationRate.toFixed(2)}%
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        )}

      {/* Seção de Filtros Aplicados */}
      <View style={reportStyles.section}>
        <Text style={reportStyles.sectionTitle}>Filtros Aplicados</Text>
        <View>
          <Text style={reportStyles.text}>
            <Text style={reportStyles.textBold}>Período: </Text>
            {formatReportDate(filters.startDate)} a{" "}
            {formatReportDate(filters.endDate)}
          </Text>
          {filters.userType && filters.userType !== "ALL" && (
            <Text style={reportStyles.text}>
              <Text style={reportStyles.textBold}>Tipo de Usuário: </Text>
              {getUserTypeLabel(filters.userType)}
            </Text>
          )}
          {(!filters.userType || filters.userType === "ALL") && (
            <Text style={reportStyles.textMuted}>
              Nenhum filtro adicional aplicado
            </Text>
          )}
        </View>
      </View>
    </ReportPDF>
  );
}
