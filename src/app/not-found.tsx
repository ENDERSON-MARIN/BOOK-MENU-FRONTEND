import { FileQuestion } from "lucide-react";
import Link from "next/link";

import { Button } from "@/_components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <FileQuestion className="text-muted-foreground h-24 w-24" />
        </div>

        <div className="space-y-2">
          <h1 className="text-primary text-6xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Página não encontrada</h2>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">Voltar para o início</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/cardapios">Ver cardápios</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
