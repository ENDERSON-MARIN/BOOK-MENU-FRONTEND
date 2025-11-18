# Guia de Otimização de Performance

Este documento descreve as otimizações de performance implementadas no projeto e como utilizá-las.

## 📋 Índice

1. [Code Splitting](#code-splitting)
2. [React.memo](#reactmemo)
3. [Debouncing](#debouncing)
4. [Tanstack Query Cache](#tanstack-query-cache)
5. [Utilitários de Performance](#utilitários-de-performance)
6. [Boas Práticas](#boas-práticas)

---

## 🔀 Code Splitting

### O que é?

Code splitting permite dividir o código em chunks menores que são carregados sob demanda, reduzindo o tamanho inicial do bundle.

### Implementação

Utilizamos `next/dynamic` para lazy loading de componentes:

```tsx
import dynamic from "next/dynamic";

// Lazy load com SSR desabilitado
const Header = dynamic(
  () =>
    import("@/_components/common/header").then((mod) => ({
      default: mod.Header,
    })),
  { ssr: false },
);

const Sidebar = dynamic(
  () =>
    import("@/_components/common/sidebar").then((mod) => ({
      default: mod.Sidebar,
    })),
  { ssr: false },
);
```

### Quando usar?

- Componentes pesados que não são necessários no carregamento inicial
- Rotas administrativas que poucos usuários acessam
- Componentes que dependem de bibliotecas grandes
- Modais e dialogs que são abertos sob demanda

### Exemplo prático

```tsx
// ❌ Ruim - carrega tudo no bundle inicial
import { HeavyChart } from "@/_components/charts/heavy-chart";

// ✅ Bom - carrega apenas quando necessário
const HeavyChart = dynamic(() => import("@/_components/charts/heavy-chart"), {
  loading: () => <Skeleton className="h-[400px]" />,
  ssr: false,
});
```

---

## 🎯 React.memo

### O que é?

`React.memo` é um HOC (Higher Order Component) que memoriza o resultado de um componente, evitando re-renders desnecessários quando as props não mudam.

### Implementação

Componentes memoizados no projeto:

- `Sidebar` - Componente de navegação
- `Header` - Cabeçalho da aplicação
- `DataTable` - Tabela de dados

```tsx
import { memo } from "react";

export const Sidebar = memo(function Sidebar({ onClose }: SidebarProps) {
  // ... código do componente
});
```

### Quando usar?

- Componentes que renderizam frequentemente mas raramente mudam
- Componentes com props complexas ou pesadas
- Componentes filhos de componentes que re-renderizam muito
- Listas de itens

### Quando NÃO usar?

- Componentes que sempre mudam suas props
- Componentes muito simples (overhead não compensa)
- Componentes que já são otimizados naturalmente

### Exemplo prático

```tsx
// ❌ Ruim - re-renderiza toda vez que o pai renderiza
export function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>;
}

// ✅ Bom - só re-renderiza se user mudar
export const UserCard = memo(function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>;
});
```

---

## ⏱️ Debouncing

### O que é?

Debouncing atrasa a execução de uma função até que ela pare de ser chamada por um período de tempo. Útil para otimizar inputs de busca e filtros.

### Hook customizado

```tsx
import { useDebounce } from "@/_hooks/use-debounce";

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // Só executa 500ms após o usuário parar de digitar
    fetchResults(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Buscar..."
    />
  );
}
```

### Função utilitária

```tsx
import { debounce } from "@/_lib/performance-utils";

const handleSearch = debounce((searchTerm: string) => {
  fetchResults(searchTerm);
}, 500);

input.addEventListener("input", (e) => handleSearch(e.target.value));
```

### Quando usar?

- Inputs de busca
- Filtros em tempo real
- Autocomplete
- Validações assíncronas
- Eventos de scroll/resize

### Valores recomendados

- **Busca**: 300-500ms
- **Validação**: 500-800ms
- **Scroll/Resize**: 100-200ms

---

## 💾 Tanstack Query Cache

### Configuração atual

```tsx
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      structuralSharing: true,
    },
  },
});
```

### Estratégias de cache

#### 1. Dados estáticos (raramente mudam)

```tsx
export function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getAll,
    staleTime: 1000 * 60 * 30, // 30 minutos
    gcTime: 1000 * 60 * 60, // 1 hora
  });
}
```

#### 2. Dados dinâmicos (mudam frequentemente)

```tsx
export function useGetReservations() {
  return useQuery({
    queryKey: ["reservations"],
    queryFn: ReservationService.getAll,
    staleTime: 1000 * 60, // 1 minuto
    gcTime: 1000 * 60 * 5, // 5 minutos
  });
}
```

#### 3. Dados em tempo real

```tsx
export function useGetLiveData() {
  return useQuery({
    queryKey: ["live-data"],
    queryFn: LiveService.getData,
    staleTime: 0, // Sempre stale
    refetchInterval: 5000, // Refetch a cada 5s
  });
}
```

### Invalidação de cache

```tsx
const queryClient = useQueryClient();

// Invalidar query específica
queryClient.invalidateQueries({ queryKey: ["users"] });

// Invalidar múltiplas queries
queryClient.invalidateQueries({ queryKey: ["users", "reservations"] });

// Remover query do cache
queryClient.removeQueries({ queryKey: ["old-data"] });
```

---

## 🛠️ Utilitários de Performance

### useStableCallback

Cria callbacks estáveis que não causam re-renders:

```tsx
import { useStableCallback } from "@/_lib/performance-utils";

function MyComponent() {
  const handleClick = useStableCallback((value: string) => {
    console.log(value);
  });

  return <ChildComponent onClick={handleClick} />;
}
```

### throttle

Limita a frequência de execução:

```tsx
import { throttle } from "@/_lib/performance-utils";

const handleScroll = throttle(() => {
  console.log("Scrolling...");
}, 200);

window.addEventListener("scroll", handleScroll);
```

### memoize

Cache resultados de funções puras:

```tsx
import { memoize } from "@/_lib/performance-utils";

const expensiveCalculation = memoize((a: number, b: number) => {
  // Cálculo pesado
  return a * b;
});

// Primeira chamada: executa o cálculo
expensiveCalculation(5, 10); // 50

// Segunda chamada: retorna do cache
expensiveCalculation(5, 10); // 50 (cached)
```

### shallowEqual

Comparação superficial de objetos:

```tsx
import { shallowEqual } from "@/_lib/performance-utils";

const MyComponent = memo(
  ({ data }) => {
    return <div>{data.name}</div>;
  },
  (prevProps, nextProps) => shallowEqual(prevProps.data, nextProps.data),
);
```

---

## ✅ Boas Práticas

### 1. Evite re-renders desnecessários

```tsx
// ❌ Ruim - cria nova função a cada render
<Button onClick={() => handleClick(id)} />;

// ✅ Bom - usa useCallback
const handleClickWithId = useCallback(() => handleClick(id), [id]);
<Button onClick={handleClickWithId} />;
```

### 2. Use keys estáveis em listas

```tsx
// ❌ Ruim - index como key
{
  items.map((item, index) => <Item key={index} {...item} />);
}

// ✅ Bom - ID único como key
{
  items.map((item) => <Item key={item.id} {...item} />);
}
```

### 3. Evite inline objects/arrays

```tsx
// ❌ Ruim - cria novo objeto a cada render
<Component style={{ margin: 10 }} />;

// ✅ Bom - define fora do componente
const style = { margin: 10 };
<Component style={style} />;
```

### 4. Use React DevTools Profiler

```bash
# Instale a extensão React DevTools
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

### 5. Monitore o bundle size

```bash
# Analise o bundle
npm run build
npm run analyze # (se configurado)
```

### 6. Lazy load imagens

```tsx
import Image from "next/image";

<Image
  src="/large-image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>;
```

### 7. Prefetch rotas importantes

```tsx
import Link from "next/link";

// Next.js faz prefetch automático de links visíveis
<Link href="/dashboard" prefetch={true}>
  Dashboard
</Link>;
```

---

## 📊 Métricas de Performance

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Ferramentas de medição

1. **Lighthouse** (Chrome DevTools)
2. **Web Vitals Extension**
3. **Next.js Analytics**
4. **React DevTools Profiler**

---

## 🔍 Debugging de Performance

### 1. Identificar re-renders

```tsx
import { useEffect, useRef } from "react";

function useWhyDidYouUpdate(name: string, props: any) {
  const previousProps = useRef<any>();

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: any = {};

      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current[key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log("[why-did-you-update]", name, changedProps);
      }
    }

    previousProps.current = props;
  });
}

// Uso
function MyComponent(props) {
  useWhyDidYouUpdate("MyComponent", props);
  return <div>...</div>;
}
```

### 2. Medir tempo de execução

```tsx
console.time("operation");
// ... código
console.timeEnd("operation");
```

### 3. React DevTools Profiler

```tsx
import { Profiler } from "react";

function onRenderCallback(
  id: string,
  phase: "mount" | "update",
  actualDuration: number,
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>;
```

---

## 📚 Recursos Adicionais

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Tanstack Query Performance](https://tanstack.com/query/latest/docs/react/guides/performance)
- [Web.dev Performance](https://web.dev/performance/)

---

**Última atualização**: Novembro 2024
