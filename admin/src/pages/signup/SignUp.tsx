import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
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
import { changeLoading } from "@/store/loading/Loading";

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.isLoading);
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
    dispatch(changeLoading(true));
    event.preventDefault();
    try {
      const res = await useApi
        .post("/auth/admin/register", data)
        .then((res) => res.data);
      toast({
        variant: "destructive",
        title: res.msg,
        description: "Please Login Now",
      });
      setTimeout(() => {
        navigate("/auth/signin");
      }, 2000);
      dispatch(changeLoading(false));
    } catch ({ response }: any) {
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
          <Button disabled={isLoading} type="submit">
            Submit
          </Button>
        </form>
        <Link className={buttonVariants()} to="/auth/signin">
          Sign In
        </Link>
      </Form>
    </div>
  );
}
