"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useApi from "@/hooks/useApi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useSelector, useDispatch } from "react-redux";
import { changeLoading } from "@/store/loading/Loading";
import { saveAdmin } from "@/store/admin/adminSlice";

const FormSchema = z.object({
  email: z.string().email("this is not a valid email"),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
});

export default function SignInForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.isLoading);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(credential: z.infer<typeof FormSchema>, event: any) {
    dispatch(changeLoading(true));
    try {
      event.preventDefault();
      const data = await useApi
        .post("/auth/admin/login", credential)
        .then((res) => res.data);
      localStorage.setItem("token", data.admin.token);
      dispatch(saveAdmin(data.admin));
      toast({ variant: "destructive", title: data.msg });
      // navigate("/");
      dispatch(changeLoading(false));
    } catch ({ response }) {
      toast({ variant: "destructive", title: response.data.msg });
      dispatch(changeLoading(false));
    }
  }

  return (
    <div className="mt-8 h-full w-full flex justify-center items-center flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Correct Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter you strong passsword" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} type="submit">
            Submit
          </Button>
        </form>
        <Link className={buttonVariants()} to="/auth/signup">
          Sign up
        </Link>
      </Form>
    </div>
  );
}
