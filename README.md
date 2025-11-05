'''
# MiControl: Your Personal Finance Assistant

**MiControl** is a personal finance web application designed to help you take control of your money in a simple and intuitive way. Built with modern technologies like Next.js, React, and Tailwind CSS, this tool allows you to:

-   **Track** your daily income and expenses.
-   **Create and manage** monthly budgets by category to keep your spending in check.
-   **Visualize** your financial activity with interactive charts and clear reports.
-   **Export** your data to PDF.

All information is stored securely in your browser's local storage, ensuring your financial data remains private and accessible only to you.

---

# MiControl: Tu Asistente Financiero Personal

**MiControl** es una aplicación web de finanzas personales diseñada para ayudarte a tomar el control de tu dinero de forma sencilla e intuitiva. Construida con tecnologías modernas como Next.js, React y Tailwind CSS, esta herramienta te permite:

-   **Registrar** tus ingresos y gastos diarios.
-   **Crear y gestionar presupuestos** mensuales por categoría para no gastar de más.
-   **Visualizar** tus movimientos financieros con gráficos interactivos y reportes claros.
-   **Exportar** tus datos a PDF.

Toda la información se almacena de forma segura en el almacenamiento local de tu navegador, garantizando que tus datos financieros sean siempre privados y accesibles solo para ti.

## Cambios recientes

- Se añadió un botón "Volver" global en la esquina superior izquierda de la interfaz para facilitar la navegación entre páginas internas. Comportamiento:
	- Presionar el botón intenta volver a la página anterior (history.back()).
	- Si no hay historial (por ejemplo, al abrir una página directamente en una nueva pestaña), redirige a la página raíz `/`.
	- El botón no se muestra en la página raíz para evitar redundancia.

Puedes personalizar su posición o estilo editando `src/components/back-button.tsx` y su inclusión en `src/app/layout.tsx`.
'''