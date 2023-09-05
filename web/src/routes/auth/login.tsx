import { useAuth } from "@/components/provider/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userLogin } from "@/lib/requests";
import { useEffect } from "react";
import {
  ActionFunctionArgs,
  Form,
  redirect,
  useNavigate,
} from "react-router-dom";

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate(`/applications/${user.applicationId}`);
    }
  }, [user, navigate]);

  return (
    <>
      <Form method="post" className="flex flex-col">
        <Input required name="email" type="email" placeholder="email" />
        <Input
          required
          name="password"
          type="password"
          placeholder="password"
        />
        <Button type="submit">Login</Button>
      </Form>
    </>
  );
}

Login.action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());
  const userData = await userLogin(params.applicationId!, {
    email: formData.email as string,
    password: formData.password as string,
  });

  const newParams = new URLSearchParams({
    access_token: userData.token,
  });

  return redirect(
    `/applications/${params.applicationId}/callback?${newParams.toString()}`
  );
};
