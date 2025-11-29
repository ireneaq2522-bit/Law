"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { ComplaintSchema, type ComplaintInput } from "@/lib/definitions";
import { submitComplaint } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, LoaderCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "@/hooks/use-translation";

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useTranslation();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> {t('complaint.submitting')}
        </>
      ) : (
        t('complaint.submitButton')
      )}
    </Button>
  );
}

export default function ComplaintPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [state, formAction] = useFormState(submitComplaint, {
    message: "",
    status: "idle",
  });

  const form = useForm<ComplaintInput>({
    resolver: zodResolver(ComplaintSchema(t)),
    defaultValues: {
      problem: "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (state.status === "success") {
      toast({
        title: t('complaint.toasts.success.title'),
        description: state.message,
      });
      form.reset({ problem: "", email: user?.email || ""});
    } else if (state.status === "error") {
      toast({
        title: t('complaint.toasts.error.title'),
        description: state.message,
        variant: "destructive",
      });
    }
  }, [state, toast, form, user, t]);

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText />
            {t('complaint.title')}
          </CardTitle>
          <CardDescription>
            {t('complaint.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction} className="space-y-6">
               <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('complaint.emailLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="problem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('complaint.problemLabel')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('complaint.problemPlaceholder')}
                        rows={10}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SubmitButton />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
