import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";

interface ReportCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export function ReportCard({
  title,
  description,
  icon: Icon,
  href,
}: ReportCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
            <Icon className="text-primary h-6 w-6" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={href}>Acessar Relatório</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
