# Guia de Testes de Acessibilidade

## Testes Automatizados

### Script de Verificação

Execute o script de verificação automática:

```bash
npm run test:a11y
```

Este script verifica:

- ✅ Skip Links implementados
- ✅ ARIA labels em componentes interativos
- ✅ Focus indicators visíveis
- ✅ Suporte a prefers-reduced-motion
- ✅ Roles semânticos (main, nav, banner)
- ✅ Tabelas com headers apropriados
- ✅ Formulários com labels associados
- ✅ Ícones decorativos com aria-hidden
- ✅ Touch targets mínimos (44x44px)
- ✅ Documentação de acessibilidade

## Testes Manuais

### 1. Navegação por Teclado

#### Teclas Principais

- **Tab**: Navegar para o próximo elemento focável
- **Shift + Tab**: Navegar para o elemento anterior
- **Enter**: Ativar botões e links
- **Espaço**: Ativar botões e checkboxes
- **Esc**: Fechar modais e dropdowns
- **Setas**: Navegar em menus e selects

#### Checklist

- [ ] Todos os elementos interativos são acessíveis via Tab
- [ ] Ordem de tabulação é lógica e intuitiva
- [ ] Focus indicators são claramente visíveis
- [ ] Skip links aparecem ao pressionar Tab
- [ ] Modais trapam o foco corretamente
- [ ] Dropdowns podem ser navegados com setas
- [ ] Esc fecha modais e retorna o foco

### 2. Screen Reader (NVDA/JAWS)

#### Instalação

- **NVDA** (Windows - Gratuito): https://www.nvaccess.org/download/
- **JAWS** (Windows - Pago): https://www.freedomscientific.com/products/software/jaws/
- **VoiceOver** (macOS - Nativo): Cmd + F5

#### Comandos NVDA

- **NVDA + Espaço**: Modo de navegação/foco
- **H**: Próximo heading
- **K**: Próximo link
- **B**: Próximo botão
- **F**: Próximo campo de formulário
- **T**: Próxima tabela
- **L**: Próxima lista

#### Checklist

- [ ] Todos os elementos são anunciados corretamente
- [ ] Headings têm hierarquia lógica (h1, h2, h3...)
- [ ] Links têm texto descritivo
- [ ] Botões têm labels claros
- [ ] Campos de formulário têm labels associados
- [ ] Mensagens de erro são anunciadas
- [ ] Mudanças de estado são anunciadas (aria-live)
- [ ] Ícones decorativos são ignorados

### 3. Contraste de Cores

#### Ferramentas Online

- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Coolors Contrast Checker**: https://coolors.co/contrast-checker
- **Chrome DevTools**: Lighthouse > Accessibility

#### Requisitos WCAG AA

- **Texto normal**: Contraste mínimo 4.5:1
- **Texto grande** (18pt+ ou 14pt+ bold): Contraste mínimo 3:1
- **Elementos UI**: Contraste mínimo 3:1

#### Checklist

- [ ] Texto principal tem contraste adequado
- [ ] Links são distinguíveis do texto normal
- [ ] Botões têm contraste suficiente
- [ ] Estados de foco são visíveis
- [ ] Mensagens de erro são legíveis
- [ ] Placeholders têm contraste adequado

### 4. Zoom e Responsividade

#### Testes de Zoom

- [ ] Página funciona em 200% de zoom
- [ ] Texto não é cortado ou sobreposto
- [ ] Elementos interativos permanecem clicáveis
- [ ] Scroll horizontal não aparece (exceto em tabelas)

#### Testes Mobile

- [ ] Touch targets têm mínimo 44x44px
- [ ] Inputs não causam zoom no iOS (font-size >= 16px)
- [ ] Navegação é acessível em telas pequenas
- [ ] Modais são responsivos

### 5. Formulários

#### Checklist

- [ ] Todos os campos têm labels visíveis
- [ ] Labels estão associados aos inputs (htmlFor)
- [ ] Mensagens de erro são claras e específicas
- [ ] Erros são anunciados para screen readers
- [ ] Campos obrigatórios são indicados
- [ ] Validação em tempo real funciona
- [ ] Sucesso de envio é anunciado

### 6. Tabelas

#### Checklist

- [ ] Headers têm scope="col" ou scope="row"
- [ ] Caption ou aria-label descreve a tabela
- [ ] Células complexas usam headers attribute
- [ ] Tabelas não são usadas para layout
- [ ] Scroll horizontal tem indicação visual

### 7. Imagens e Mídia

#### Checklist

- [ ] Imagens têm alt text descritivo
- [ ] Imagens decorativas têm alt=""
- [ ] Ícones têm aria-label ou aria-hidden
- [ ] Vídeos têm legendas (se aplicável)
- [ ] Áudio tem transcrição (se aplicável)

## Ferramentas Recomendadas

### Extensões do Navegador

1. **axe DevTools** (Chrome/Firefox)
   - Detecta violações WCAG automaticamente
   - Fornece sugestões de correção
   - https://www.deque.com/axe/devtools/

2. **WAVE** (Chrome/Firefox)
   - Avaliação visual de acessibilidade
   - Identifica erros e avisos
   - https://wave.webaim.org/extension/

3. **Lighthouse** (Chrome DevTools)
   - Audit completo de acessibilidade
   - Score e recomendações
   - Nativo no Chrome

### Ferramentas de Linha de Comando

1. **pa11y**

   ```bash
   npm install -g pa11y
   pa11y http://localhost:3000
   ```

2. **axe-core**
   ```bash
   npm install -g @axe-core/cli
   axe http://localhost:3000
   ```

## Checklist Completo de Lançamento

Antes de fazer deploy, verifique:

- [ ] ✅ Script de teste automatizado passa (npm run test:a11y)
- [ ] ✅ Navegação completa por teclado funciona
- [ ] ✅ Screen reader testa todas as páginas principais
- [ ] ✅ Contraste de cores passa WCAG AA
- [ ] ✅ Zoom 200% funciona sem problemas
- [ ] ✅ Touch targets são adequados em mobile
- [ ] ✅ Formulários são totalmente acessíveis
- [ ] ✅ Lighthouse score de acessibilidade > 90
- [ ] ✅ axe DevTools não reporta erros críticos
- [ ] ✅ Documentação de acessibilidade está atualizada

## Recursos Adicionais

### Documentação

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)

### Cursos e Tutoriais

- [Web Accessibility by Google (Udacity)](https://www.udacity.com/course/web-accessibility--ud891)
- [Accessibility Fundamentals (Deque University)](https://dequeuniversity.com/)

### Comunidade

- [A11y Slack](https://web-a11y.slack.com/)
- [WebAIM Discussion List](https://webaim.org/discussion/)

## Reportando Problemas

Se encontrar problemas de acessibilidade:

1. Abra uma issue no repositório
2. Inclua:
   - Descrição do problema
   - Passos para reproduzir
   - Ferramenta/método de teste usado
   - Screenshot ou vídeo (se aplicável)
   - Nível de severidade (crítico/alto/médio/baixo)

## Contato

Para dúvidas sobre acessibilidade, entre em contato com a equipe de desenvolvimento.
