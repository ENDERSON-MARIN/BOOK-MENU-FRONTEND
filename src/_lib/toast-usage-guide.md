# Guia de Uso de Toast Notifications

Este documento descreve como usar as toast notifications no projeto.

## Configuração

O sistema de toast notifications está configurado usando a biblioteca `sonner` e já está integrado no layout principal da aplicação.

### Componente Toaster

O componente `<Toaster />` está configurado em `src/app/layout.tsx`:

```tsx
import { Toaster } from "@/_components/ui/sonner";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## Mensagens Padronizadas

Todas as mensagens de toast estão centralizadas em `src/_lib/toast-messages.ts` para garantir consistência em toda a aplicação.

### Estrutura das Mensagens

```typescript
export const toastMessages = {
  user: {
    createSuccess: "Usuário criado com sucesso",
    createError: "Erro ao criar usuário",
    // ...
  },
  category: {
    // ...
  },
  // ...
};
```

## Uso nos Hooks de Mutation

Os toasts são automaticamente exibidos nos hooks de mutation do Tanstack Query:

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toastMessages } from "@/_lib/toast-messages";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => UserService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(toastMessages.user.createSuccess);
    },
    onError: (error: Error) => {
      toast.error(error.message || toastMessages.user.createError);
    },
  });
}
```

## Uso em Componentes

### Toasts Automáticos (Recomendado)

Na maioria dos casos, você não precisa chamar `toast` manualmente nos componentes, pois os hooks de mutation já fazem isso:

```tsx
function UserForm() {
  const createUser = useCreateUser();

  const onSubmit = async (data) => {
    // O toast será exibido automaticamente pelo hook
    createUser.mutate(data);
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

### Toasts Manuais (Casos Especiais)

Para casos especiais onde você precisa exibir toasts manualmente:

```tsx
import { toast } from "sonner";
import { toastMessages } from "@/_lib/toast-messages";

function MyComponent() {
  const handleAction = () => {
    try {
      // Alguma lógica
      toast.success(toastMessages.generic.success);
    } catch (error) {
      toast.error(error.message || toastMessages.generic.error);
    }
  };

  return <button onClick={handleAction}>Ação</button>;
}
```

## Tipos de Toast

### Success (Verde)

```typescript
toast.success("Operação realizada com sucesso");
```

### Error (Vermelho)

```typescript
toast.error("Erro ao realizar operação");
```

### Info (Azul)

```typescript
toast.info("Informação importante");
```

### Warning (Amarelo)

```typescript
toast.warning("Atenção: verifique os dados");
```

### Loading (Com Spinner)

```typescript
const toastId = toast.loading("Processando...");

// Depois de concluir
toast.success("Concluído!", { id: toastId });
// ou
toast.error("Erro!", { id: toastId });
```

## Toasts no API Client

O `api-client.ts` exibe toasts automaticamente para erros de autenticação:

- **401 Unauthorized**: "Sessão expirada. Faça login novamente"
- **403 Forbidden**: "Você não tem permissão para acessar este recurso"

## Toasts no Auth Provider

O `auth-provider.tsx` exibe toasts para:

- **Login bem-sucedido**: "Login realizado com sucesso"
- **Logout**: "Logout realizado com sucesso"

## Boas Práticas

1. **Use mensagens padronizadas**: Sempre use `toastMessages` ao invés de strings hardcoded
2. **Deixe os hooks fazerem o trabalho**: Não adicione toasts manuais em componentes se o hook já faz isso
3. **Mensagens claras**: Use mensagens descritivas que ajudem o usuário a entender o que aconteceu
4. **Erros da API**: Sempre exiba a mensagem de erro retornada pela API quando disponível
5. **Evite duplicação**: Não exiba múltiplos toasts para a mesma ação

## Adicionando Novas Mensagens

Para adicionar novas mensagens padronizadas:

1. Abra `src/_lib/toast-messages.ts`
2. Adicione a nova mensagem na categoria apropriada:

```typescript
export const toastMessages = {
  // ...
  newFeature: {
    createSuccess: "Nova feature criada com sucesso",
    createError: "Erro ao criar nova feature",
  },
};
```

3. Use a nova mensagem nos hooks ou componentes:

```typescript
toast.success(toastMessages.newFeature.createSuccess);
```

## Customização

Para customizar a aparência dos toasts, edite `src/_components/ui/sonner.tsx`:

```tsx
<Sonner
  theme={theme as ToasterProps["theme"]}
  className="toaster group"
  position="top-right" // Posição dos toasts
  duration={4000} // Duração em ms
  closeButton // Adicionar botão de fechar
  richColors // Cores mais vibrantes
/>
```

## Referências

- [Documentação do Sonner](https://sonner.emilkowal.ski/)
- [shadcn/ui Sonner](https://ui.shadcn.com/docs/components/sonner)
