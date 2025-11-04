'use client';

import { Header } from '@/components/dashboard/header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useI18n } from '@/lib/i18n';

export default function AyudaPage() {
  const { t } = useI18n();

  const faqs = [
    {
      question: t('faq_1_q'),
      answer: t('faq_1_a'),
    },
    {
      question: t('faq_2_q'),
      answer: t('faq_2_a'),
    },
    {
      question: t('faq_3_q'),
      answer: t('faq_3_a'),
    },
    {
      question: t('faq_4_q'),
      answer: t('faq_4_a'),
    },
    {
      question: t('faq_5_q'),
      answer: t('faq_5_a'),
    },
  ];

  return (
    <main>
      <Header title={t('help')} />
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">{t('faqs')}</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </main>
  );
}
