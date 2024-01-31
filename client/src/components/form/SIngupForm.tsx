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

import Link from "next/link";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 3 characters.",
  }),
  email: z.string().email("this is not a valid email"),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
  accessKey: z.string(),
});

export default function SignupForm() {
  const makeRequest = useApi();
  const navigate = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      accessKey: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>, event: any) {
    event.preventDefault();
    try {
      const res = await makeRequest.post("/auth/admin/register", data);
      toast({
        variant: "destructive",
        title: res.msg,
        description: "Please Login Now",
      });
      setTimeout(() => {
        navigate.push("/sign-in");
      }, 2000);
    } catch (error) {
      console.log(error);
      toast({ variant: "success", title: error.data.msg });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter Your Name" {...field} />
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
        <FormField
          control={form.control}
          name="accessKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Key </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Access key For Registration"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
      <Link href="/sign-in">Sign In</Link>
    </Form>
  );
}
