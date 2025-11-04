import { Header } from '@/components/dashboard/header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: '¿Cómo puedo añadir una nueva transacción?',
    answer:
      'Puedes añadir una nueva transacción (ingreso o gasto) haciendo clic en el botón "Añadir" que se encuentra en la parte superior derecha de la aplicación. Se abrirá un formulario donde podrás introducir todos los detalles.',
  },
  {
    question: '¿Dónde puedo ver mis presupuestos?',
    answer:
      'La sección de "Presupuestos" en el menú lateral te permite ver y gestionar tus presupuestos por categoría. Podrás ver cuánto has gastado y cuánto te queda para cada uno.',
  },
  {
    question: '¿Es posible exportar mis transacciones?',
    answer:
      'Sí, en la página de "Transacciones", encontrarás un botón "Exportar PDF". Al hacer clic, se generará y descargará un archivo PDF con la lista de tus transacciones.',
  },
  {
    question: '¿Cómo puedo cambiar el tema de la aplicación?',
    answer:
      'Ve a la página de "Ajustes". Allí encontrarás una sección de "Apariencia" con un interruptor para cambiar entre el tema claro y el oscuro.',
  },
  {
    question: '¿Qué hago si quiero borrar todos mis datos?',
    answer:
      'En la página de "Ajustes", dentro de "Gestión de Datos", hay un botón para "Borrar todas las transacciones". Ten en cuenta que esta acción es irreversible y eliminará todos los datos de tu navegador.',
  },
];

export default function AyudaPage() {
  return (
    <main>
      <Header title="Ayuda" />
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Preguntas Frecuentes</h2>
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
