"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

const Newsletter = () => {
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    console.log(data);
  };

  return (
    <section className='py-12 md:py-16 w-full bg-white relative'>
      {/* Teal Glow Background */}
      <div
        className='absolute inset-0 z-0'
        style={{
          backgroundImage: `
            radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #14b8a6 100%)
          `,
          backgroundSize: "100% 100%",
        }}
      />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative'>
        <div className='flex flex-col items-center text-center'>
          <h2
            className={cn(
              "text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#00564A] to-[#00A892] bg-clip-text text-transparent mb-4"
            )}>
            Stay Updated with Datapollex LMS
          </h2>
          <p className='text-lg text-gray-600 mb-6 max-w-md'>
            Subscribe to our newsletter for the latest updates, course releases,
            and learning tips.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full max-w-md flex flex-col sm:flex-row gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <div className='relative'>
                        <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                        <Input
                          type='email'
                          placeholder='Enter your email'
                          className='pl-10 bg-gray-100 text-gray-800 placeholder-gray-400 border-none focus:ring-2 focus:ring-[#3DB6A6]'
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className={cn(
                  "bg-gradient-to-r from-[#3DB6A6] to-[#2D7F74] text-white hover:from-[#2D7F74] hover:to-[#3DB6A6] rounded-full px-6 py-3 text-sm font-medium"
                )}>
                Subscribe
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
