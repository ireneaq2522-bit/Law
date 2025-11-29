"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { handleTranslation } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoaderCircle, Languages } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const createTranslateSchema = (t: (key: string) => string) => z.object({
  text: z.string().min(1, t('validation.translate.textRequired')),
  targetLanguage: z.enum(["Tamil", "Telugu", "Kannada", "Malayalam"]),
});

type TranslateFormInput = z.infer<ReturnType<typeof createTranslateSchema>>;

export default function TranslatePage() {
  const [isPending, startTransition] = useTransition();
  const [translatedText, setTranslatedText] = useState("");
  const { t } = useTranslation();

  const TranslateSchema = createTranslateSchema(t);

  const form = useForm<TranslateFormInput>({
    resolver: zodResolver(TranslateSchema),
    defaultValues: {
      text: "",
      targetLanguage: "Tamil",
    },
  });

  const onSubmit = async (data: TranslateFormInput) => {
    setTranslatedText("");
    startTransition(async () => {
      const result = await handleTranslation(data);
      if (result.data) {
        setTranslatedText(result.data.translatedText);
      } else {
        setTranslatedText(`Error: ${result.error}`);
      }
    });
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages />
          {t('translate.title')}
        </CardTitle>
        <CardDescription>
          {t('translate.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('translate.textLabel')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('translate.textPlaceholder')}
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('translate.languageLabel')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('translate.languagePlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Tamil">{t('translate.languages.tamil')}</SelectItem>
                      <SelectItem value="Telugu">{t('translate.languages.telugu')}</SelectItem>
                      <SelectItem value="Kannada">{t('translate.languages.kannada')}</SelectItem>
                      <SelectItem value="Malayalam">{t('translate.languages.malayalam')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  {t('translate.translatingButton')}
                </>
              ) : (
                t('translate.translateButton')
              )}
            </Button>
          </form>
        </Form>
        {translatedText && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('translate.resultTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{translatedText}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
