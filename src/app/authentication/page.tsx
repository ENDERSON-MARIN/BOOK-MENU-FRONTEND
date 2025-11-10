import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/_components/ui/tabs";

import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";

const Authentication = async () => {
  return (
    <>
      <div className="flex w-full flex-col gap-6 p-5">
        <Tabs defaultValue="login">
          <TabsList className="flex w-full justify-center">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Criar conta</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="w-full">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register" className="w-full">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Authentication;
