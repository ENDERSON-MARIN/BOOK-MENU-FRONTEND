#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Script de teste de acessibilidade
 * Verifica conformidade WCAG 2.1 AA
 *
 * Uso: node scripts/test-accessibility.js
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 Iniciando verificação de acessibilidade...\n");

// Cores para output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
};

let totalIssues = 0;
let totalWarnings = 0;
let totalPassed = 0;

// Checklist de acessibilidade
const checks = [
  {
    name: "Skip Links implementados",
    check: () => {
      const layoutPath = path.join(
        process.cwd(),
        "src/app/(dashboard)/layout.tsx",
      );
      if (fs.existsSync(layoutPath)) {
        const content = fs.readFileSync(layoutPath, "utf8");
        return content.includes("SkipLink");
      }
      return false;
    },
    severity: "error",
  },
  {
    name: "ARIA labels em componentes interativos",
    check: () => {
      const sidebarPath = path.join(
        process.cwd(),
        "src/_components/common/sidebar.tsx",
      );
      if (fs.existsSync(sidebarPath)) {
        const content = fs.readFileSync(sidebarPath, "utf8");
        return (
          content.includes("aria-label") && content.includes("aria-current")
        );
      }
      return false;
    },
    severity: "error",
  },
  {
    name: "Focus indicators visíveis (CSS)",
    check: () => {
      const cssPath = path.join(process.cwd(), "src/app/globals.css");
      if (fs.existsSync(cssPath)) {
        const content = fs.readFileSync(cssPath, "utf8");
        return content.includes("focus-visible") && content.includes("outline");
      }
      return false;
    },
    severity: "error",
  },
  {
    name: "Suporte a prefers-reduced-motion",
    check: () => {
      const cssPath = path.join(process.cwd(), "src/app/globals.css");
      if (fs.existsSync(cssPath)) {
        const content = fs.readFileSync(cssPath, "utf8");
        return content.includes("prefers-reduced-motion");
      }
      return false;
    },
    severity: "warning",
  },
  {
    name: "Roles semânticos (main, nav, banner)",
    check: () => {
      const layoutPath = path.join(
        process.cwd(),
        "src/app/(dashboard)/layout.tsx",
      );
      const headerPath = path.join(
        process.cwd(),
        "src/_components/common/header.tsx",
      );

      let hasRoles = false;
      if (fs.existsSync(layoutPath)) {
        const content = fs.readFileSync(layoutPath, "utf8");
        hasRoles = content.includes('role="main"') || content.includes("<main");
      }
      if (fs.existsSync(headerPath)) {
        const content = fs.readFileSync(headerPath, "utf8");
        hasRoles =
          hasRoles &&
          (content.includes('role="banner"') || content.includes("<header"));
      }
      return hasRoles;
    },
    severity: "error",
  },
  {
    name: "Tabelas com headers apropriados",
    check: () => {
      const tablePath = path.join(
        process.cwd(),
        "src/_components/ui/data-table.tsx",
      );
      if (fs.existsSync(tablePath)) {
        const content = fs.readFileSync(tablePath, "utf8");
        return content.includes('scope="col"') || content.includes("TableHead");
      }
      return false;
    },
    severity: "error",
  },
  {
    name: "Formulários com labels associados",
    check: () => {
      const formPath = path.join(process.cwd(), "src/_components/ui/form.tsx");
      if (fs.existsSync(formPath)) {
        const content = fs.readFileSync(formPath, "utf8");
        return (
          content.includes("htmlFor") && content.includes("aria-describedby")
        );
      }
      return false;
    },
    severity: "error",
  },
  {
    name: "Ícones decorativos com aria-hidden",
    check: () => {
      const sidebarPath = path.join(
        process.cwd(),
        "src/_components/common/sidebar.tsx",
      );
      if (fs.existsSync(sidebarPath)) {
        const content = fs.readFileSync(sidebarPath, "utf8");
        return content.includes('aria-hidden="true"');
      }
      return false;
    },
    severity: "warning",
  },
  {
    name: "Touch targets mínimos (44x44px)",
    check: () => {
      const cssPath = path.join(process.cwd(), "src/app/globals.css");
      if (fs.existsSync(cssPath)) {
        const content = fs.readFileSync(cssPath, "utf8");
        return content.includes("min-height: 44px");
      }
      return false;
    },
    severity: "warning",
  },
  {
    name: "Documentação de acessibilidade",
    check: () => {
      const docsPath = path.join(process.cwd(), "docs/ACCESSIBILITY.md");
      return fs.existsSync(docsPath);
    },
    severity: "warning",
  },
];

// Executar checks
console.log(
  `${colors.blue}Executando ${checks.length} verificações...${colors.reset}\n`,
);

checks.forEach((check, index) => {
  const passed = check.check();
  const icon = passed ? "✅" : check.severity === "error" ? "❌" : "⚠️";
  const color = passed
    ? colors.green
    : check.severity === "error"
      ? colors.red
      : colors.yellow;

  console.log(`${icon} ${color}${check.name}${colors.reset}`);

  if (passed) {
    totalPassed++;
  } else {
    if (check.severity === "error") {
      totalIssues++;
    } else {
      totalWarnings++;
    }
  }
});

// Resumo
console.log("\n" + "=".repeat(50));
console.log(`${colors.blue}Resumo da Verificação${colors.reset}`);
console.log("=".repeat(50));
console.log(`${colors.green}✅ Passou: ${totalPassed}${colors.reset}`);
console.log(`${colors.yellow}⚠️  Avisos: ${totalWarnings}${colors.reset}`);
console.log(`${colors.red}❌ Erros: ${totalIssues}${colors.reset}`);
console.log("=".repeat(50) + "\n");

// Recomendações
if (totalIssues > 0 || totalWarnings > 0) {
  console.log(`${colors.blue}📋 Próximos Passos:${colors.reset}\n`);

  if (totalIssues > 0) {
    console.log(
      `${colors.red}1. Corrija os ${totalIssues} erro(s) crítico(s) de acessibilidade${colors.reset}`,
    );
  }

  if (totalWarnings > 0) {
    console.log(
      `${colors.yellow}2. Revise os ${totalWarnings} aviso(s) de acessibilidade${colors.reset}`,
    );
  }

  console.log(
    `${colors.blue}3. Execute testes manuais com screen readers (NVDA/JAWS)${colors.reset}`,
  );
  console.log(
    `${colors.blue}4. Teste navegação completa apenas com teclado${colors.reset}`,
  );
  console.log(
    `${colors.blue}5. Verifique contraste de cores com ferramentas online${colors.reset}\n`,
  );
}

// Exit code
if (totalIssues > 0) {
  console.log(
    `${colors.red}❌ Verificação falhou com ${totalIssues} erro(s)${colors.reset}\n`,
  );
  process.exit(1);
} else {
  console.log(
    `${colors.green}✅ Verificação concluída com sucesso!${colors.reset}\n`,
  );
  process.exit(0);
}
