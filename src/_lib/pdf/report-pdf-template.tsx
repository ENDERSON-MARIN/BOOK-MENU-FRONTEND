/* eslint-disable jsx-a11y/alt-text */
import "dayjs/locale/pt-br";

import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import dayjs from "dayjs";

dayjs.locale("pt-br");

// Estilos do PDF seguindo as cores da empresa
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottom: "1.5px solid #1b994b",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  logo: {
    width: 60,
    height: 30,
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1b994b",
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 9,
    color: "#333333",
    marginBottom: 2,
  },
  generatedAt: {
    fontSize: 8,
    color: "#666666",
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    bottom: 15,
    left: 20,
    right: 20,
    paddingTop: 5,
    borderTop: "1px solid #e5e5e5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    color: "#666666",
  },
  footerBrand: {
    fontSize: 8,
    color: "#1b994b",
    fontWeight: "bold",
  },
  pageNumber: {
    fontSize: 7,
    color: "#666666",
  },
});

interface ReportPDFProps {
  title: string;
  period: {
    start: string;
    end: string;
  };
  children: React.ReactNode;
}

export function ReportPDF({ title, period, children }: ReportPDFProps) {
  const generatedAt = dayjs().format("DD/MM/YYYY [às] HH:mm");
  const formattedStartDate = dayjs(period.start).format("DD/MM/YYYY");
  const formattedEndDate = dayjs(period.end).format("DD/MM/YYYY");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src="/logo.png" style={styles.logo} cache={false} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            Período: {formattedStartDate} a {formattedEndDate}
          </Text>
          <Text style={styles.generatedAt}>Gerado em: {generatedAt}</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>{children}</View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View>
            <Text style={styles.footerBrand}>BookMenu</Text>
            <Text style={styles.footerText}>
              Sistema de Reservas de Almoço Corporativo
            </Text>
          </View>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Página ${pageNumber} de ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

// Estilos reutilizáveis para conteúdo dos relatórios
export const reportStyles = StyleSheet.create({
  section: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333333",
    borderBottom: "1px solid #e5e5e5",
    paddingBottom: 3,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 6,
  },
  statCard: {
    flex: 1,
    padding: 8,
    backgroundColor: "#f9fafb",
    borderRadius: 3,
    borderLeft: "2px solid #1b994b",
  },
  statLabel: {
    fontSize: 7,
    color: "#666666",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1b994b",
  },
  statDescription: {
    fontSize: 7,
    color: "#999999",
    marginTop: 2,
  },
  table: {
    width: "100%",
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    borderBottomStyle: "solid",
    minHeight: 22,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#1b994b",
    fontWeight: "bold",
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 8,
    color: "#ffffff",
    padding: 5,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  tableCell: {
    flex: 1,
    fontSize: 8,
    color: "#333333",
    padding: 5,
  },
  tableCellBold: {
    flex: 1,
    fontSize: 8,
    color: "#333333",
    padding: 5,
    fontWeight: "bold",
  },
  badge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
  },
  badgeSuccess: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
  },
  badgeDanger: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  badgeWarning: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  badgeInfo: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  text: {
    fontSize: 8,
    color: "#333333",
    marginBottom: 3,
  },
  textBold: {
    fontSize: 8,
    color: "#333333",
    fontWeight: "bold",
    marginBottom: 3,
  },
  textMuted: {
    fontSize: 7,
    color: "#666666",
    marginBottom: 3,
  },
  divider: {
    borderBottom: "1px solid #e5e5e5",
    marginVertical: 6,
  },
  highlight: {
    backgroundColor: "#fef3c7",
    padding: 6,
    borderRadius: 3,
    marginVertical: 6,
  },
  highlightText: {
    fontSize: 8,
    color: "#92400e",
  },
});
