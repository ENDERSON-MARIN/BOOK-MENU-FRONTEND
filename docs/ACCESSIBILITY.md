# Guia de Acessibilidade - Sistema de Reservas de Almoço

## Visão Geral

Este documento descreve as práticas de acessibilidade implementadas no sistema, seguindo as diretrizes WCAG 2.1 nível AA.

## Melhorias Implementadas

### 1. Navegação por Teclado

#### Skip Links

- **Implementação**: Componente `SkipLink` permite que usuários de teclado pulem diretamente para o conteúdo principal
- **Localização**: `src/_components/common/skip-link.tsx`
- **Atalhos disponíveis**:
  - "Pular para o conteúdo principal" → `#main-content`
  - "Pular para a navegação" → `#navigation`

#### Tab Order

- Todos os elementos interativos são acessíveis via Tab
- Ordem lógica de navegação mantida em todos os componentes
- Focus indicators visíveis em todos os elementos focáveis

### 2. ARIA Labels e Roles

#### Componentes com ARIA

- **Sidebar**:
  - `role="navigation"` e `aria-label="Menu de navegação"`
  - Links com `aria-current="page"` para página ativa
  - Ícones com `aria-hidden="true"`
- **Header**:
  - `role="banner"` no header principal
  - Botões com `aria-label` descritivos
  - Toggle de tema com `aria-pressed`
- **DataTable**:
  - `role="region"` com `aria-label="Tabela de dados"`
  - Cabeçalhos com `scope="col"`
  - Paginação com `aria-live="polite"` para anúncios de mudança de página
- **Dialogs**:
  - `role="dialog"` e `aria-modal="true"` em modais
  - Botão de fechar com `aria-label` descritivo

### 3. Contraste de Cores (WCAG AA)

#### Tema Claro

- **Texto principal**: Contraste 16:1 (preto sobre branco)
- **Primary (verde)**: `oklch(0.55 0.15 155)` - Contraste 4.5:1 com branco
- **Secondary (amarelo)**: `oklch(0.88 0.18 100)` - Contraste 4.5:1 com preto
- **Destructive**: Contraste 4.5:1 mínimo

#### Tema Escuro

- **Texto principal**: Contraste 15:1 (branco sobre escuro)
- **Primary (verde)**: `oklch(0.6 0.17 155)` - Ajustado para melhor visibilidade
- **Borders**: Transparência ajustada para contraste adequado

### 4. Focus Indicators

#### Estilos de Foco

```css
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

- **Botões**: Ring de 3px com cor primária
- **Inputs**: Ring de 3px com cor primária + borda destacada
- **Links**: Ring de 2px com offset de 2px
- **Estados de erro**: Ring vermelho para campos inválidos

### 5. Formulários Acessíveis

#### Componente Form

- Labels associados corretamente via `htmlFor`
- Mensagens de erro com `aria-describedby`
- Estados de erro com `aria-invalid`
- Descrições de campo com IDs únicos

#### Validação

- Mensagens de erro claras e descritivas
- Feedback visual e textual
- Anúncios de erro via `aria-live`

### 6. Responsividade e Touch Targets

#### Mobile

- Targets mínimos de 44x44px (iOS guidelines)
- Font-size mínimo de 16px em inputs (previne zoom no iOS)
- Scroll horizontal em tabelas com indicação visual

#### Desktop

- Hover states claros
- Keyboard navigation otimizada
- Atalhos de teclado documentados

## Testes de Acessibilidade

### Ferramentas Recomendadas

1. **Lighthouse** (Chrome DevTools)
   - Executar audit de acessibilidade
   - Meta: Score 90+

2. **axe DevTools** (Extensão do navegador)
   - Verificar violações WCAG
   - Testar componentes individuais

3. **NVDA/JAWS** (Screen Readers)
   - Testar navegação completa
   - Verificar anúncios de mudanças de estado

4. **Keyboard Only Navigation**
   - Testar todas as funcionalidades apenas com teclado
   - Verificar tab order lógico

### Checklist de Testes

- [ ] Navegação completa apenas com teclado (Tab, Shift+Tab, Enter, Esc)
- [ ] Skip links funcionando corretamente
- [ ] Screen reader anuncia corretamente todos os elementos
- [ ] Contraste de cores passa WCAG AA em todos os estados
- [ ] Focus indicators visíveis em todos os elementos interativos
- [ ] Formulários com labels e mensagens de erro acessíveis
- [ ] Tabelas com headers e estrutura semântica correta
- [ ] Modais trapam foco corretamente
- [ ] Imagens com alt text descritivo
- [ ] Vídeos/áudio com legendas (se aplicável)

## Componentes Acessíveis

### Lista de Componentes Auditados

✅ **Button** - ARIA labels, focus states, disabled states
✅ **Input** - Labels, error states, aria-describedby
✅ **Form** - Validação acessível, mensagens de erro
✅ **Dialog** - Modal trap, close button, aria-modal
✅ **DataTable** - Headers, pagination, aria-live
✅ **Sidebar** - Navigation, aria-current, keyboard nav
✅ **Header** - Banner role, user menu, theme toggle
✅ **SkipLink** - Keyboard navigation shortcuts

### Componentes Pendentes de Auditoria

- [ ] Select/Combobox
- [ ] DatePicker
- [ ] Toast notifications
- [ ] Alert dialogs
- [ ] Dropdown menus

## Boas Práticas

### Desenvolvimento

1. **Sempre use elementos semânticos HTML**

   ```tsx
   // ✅ Bom
   <button onClick={handleClick}>Clique aqui</button>

   // ❌ Evitar
   <div onClick={handleClick}>Clique aqui</div>
   ```

2. **Adicione ARIA labels quando necessário**

   ```tsx
   // ✅ Bom
   <button aria-label="Fechar modal">
     <X />
   </button>

   // ❌ Evitar
   <button>
     <X />
   </button>
   ```

3. **Esconda ícones decorativos**

   ```tsx
   // ✅ Bom
   <Icon aria-hidden="true" />

   // ❌ Evitar
   <Icon />
   ```

4. **Use aria-live para anúncios dinâmicos**
   ```tsx
   <div aria-live="polite" aria-atomic="true">
     {statusMessage}
   </div>
   ```

### Design

1. **Contraste mínimo**: 4.5:1 para texto normal, 3:1 para texto grande
2. **Touch targets**: Mínimo 44x44px
3. **Focus indicators**: Sempre visíveis e com contraste adequado
4. **Animações**: Respeitar `prefers-reduced-motion`

## Recursos Adicionais

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Contato

Para reportar problemas de acessibilidade ou sugerir melhorias, abra uma issue no repositório do projeto.
