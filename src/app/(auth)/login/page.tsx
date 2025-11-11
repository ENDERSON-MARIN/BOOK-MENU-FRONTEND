import Image from "next/image";

import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={160}
            className="mb-2"
            priority
          />
          <h1 className="text-2xl font-bold tracking-tight">
            Sistema de Reservas de Almoço
          </h1>
          <p className="text-muted-foreground text-sm">
            Entre com suas credenciais para acessar o sistema
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
