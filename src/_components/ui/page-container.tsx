//componente contenedor de todo el contenido
export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-6 p-6">{children}</div>;
};

//componente contenedor del Header
export const PageHeaderContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center justify-between w-full">{children}</div>;
};

//componente elementos del Header
export const PageHeaderContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-1 w-full">{children}</div>;
};

//componente title del Header
export const PageHeaderTitle = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-2xl font-bold">{children}</div>;
};

//componente Descripcion del Header
export const PageHeaderDescription = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-sm text-muted-foreground">{children}</div>;
};

//componente Actions del Header
export const PageHeaderActions = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-2">{children}</div>;
};

//componente del contenido
export const PageContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-6">{children}</div>;
};

