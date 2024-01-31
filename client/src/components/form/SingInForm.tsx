"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useApi from "@/hooks/useFetch";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { toast } from "../ui/use-toast";

const FormSchema = z.object({
  email: z.string().email("this is not a valid email"),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
});

export default function SignInForm() {
  const makeRequest = useApi();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>, event) {
    try {
      event.preventDefault();
      const res = await signIn("credentials", { ...data, redirect: false });
      console.log("res", res);
      toast({ variant: "success", title: res.msg });
    } catch (error) {
      console.log(error);
      toast({ variant: "destructive", title: error.data.msg });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
        <Button type="submit">Submit</Button>
      </form>
      <Link href="/sign-up">Sign up</Link>
    </Form>
  );
}
