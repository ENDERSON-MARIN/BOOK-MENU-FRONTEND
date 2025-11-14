//componente contenedor de todo el contenido
export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">{children}</div>;
};

//componente contenedor del Header
export const PageHeaderContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      {children}
    </div>
  );
};

//componente elementos del Header
export const PageHeaderContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="w-full space-y-1">{children}</div>;
};

//componente title del Header
export const PageHeaderTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="text-xl font-bold sm:text-2xl">{children}</div>;
};

//componente Descripcion del Header
export const PageHeaderDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="text-muted-foreground text-xs sm:text-sm">{children}</div>
  );
};

//componente Actions del Header
export const PageHeaderActions = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">{children}</div>
  );
};

//componente del contenido
export const PageContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-6">{children}</div>;
};
