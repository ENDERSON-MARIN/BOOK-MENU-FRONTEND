"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/_components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/_components/ui/form";
import { Input } from "@/_components/ui/input";
import { useCreateCompany } from "@/_hooks/mutations/use-create-company";
import { useUpdateCompany } from "@/_hooks/mutations/use-update-company";
import {
  companyFormSchema,
  CompanyFormValues,
} from "@/_schemas/company.schema";
import { Company } from "@/_types/company";

interface UpsertCompanyFormProps {
  company?: Company;
  onSuccess: () => void;
}

const UpsertCompanyForm = ({ company, onSuccess }: UpsertCompanyFormProps) => {
  const { mutate: createCompany, isPending: isCreating } = useCreateCompany();
  const { mutate: updateCompany, isPending: isUpdating } = useUpdateCompany(
    company?.id ?? "",
  );

  const isPending = isCreating || isUpdating;
  const isEditing = !!company;

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: company?.name ?? "",
      cnpj: company?.cnpj ?? "",
      email: company?.email ?? "",
      phone: company?.phone ?? "",
      address: company?.address ?? "",
    },
  });

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name,
        cnpj: company.cnpj,
        email: company.email,
        phone: company.phone ?? "",
        address: company.address ?? "",
      });
    } else {
      form.reset({
        name: "",
        cnpj: "",
        email: "",
        phone: "",
        address: "",
      });
    }
  }, [company, form]);

  const onSubmit = (values: CompanyFormValues) => {
    if (isEditing) {
      updateCompany(values, {
        onSuccess: () => {
          toast.success("Empresa atualizada com sucesso!");
          onSuccess();
        },
        onError: (error) => {
          console.error(error);
          toast.error("Erro ao atualizar a empresa.");
        },
      });
    } else {
      createCompany(values, {
        onSuccess: () => {
          toast.success("Empresa criada com sucesso!");
          onSuccess();
        },
        onError: (error) => {
          console.error(error);
          toast.error("Erro ao criar a empresa.");
        },
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Editar Empresa" : "Nova Empresa"}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Tech Solutions LTDA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input placeholder="12345678000195" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="contato@techsolutions.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="11987654321" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Rua das Flores, 123 - São Paulo, SP"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending
              ? "Salvando..."
              : isEditing
                ? "Salvar Alterações"
                : "Criar Empresa"}
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertCompanyForm;
