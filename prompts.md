# Registro de prompts de IA
## Proyecto: Almacén de Equipos

Este archivo documenta las instrucciones utilizadas
para apoyar el desarrollo del frontend con React y Vite.

## 1. Unificación de estilos

### Prompt
Revisa los estilos CSS del proyecto y unifica
los colores y las tipografías según el mockup.

Centraliza las variables globales en src/index.css.
Utiliza Barlow como tipografía principal y
Roboto Mono para fechas y códigos.

Mantén los estilos específicos de cada historia
sin modificar su funcionalidad.

### Resultado
Se definieron variables compartidas de colores
y tipografías en index.css.

## 2. Cabecera compartida del estudiante

### Prompt
Crea un componente reutilizable HeaderEstudiante
para las pantallas del estudiante.

Debe incluir logo, navegación, búsqueda y perfil.
Utiliza React Router y los datos del usuario
autenticado. Evita duplicar el JSX.

### Resultado
Se creó un componente compartido para reutilizar
la cabecera entre pantallas.

## 3. Navegación del encargado

### Prompt
Unifica la barra lateral del encargado usando
un solo componente React.

Conserva las rutas existentes y elimina las
opciones que no se utilizan.

Los contadores deben obtenerse de los datos
simulados y no escribirse directamente en el JSX.

### Resultado
Se utilizó un menú lateral compartido con las
opciones y los contadores del encargado.

## 4. Cabecera compartida del encargado

### Prompt
Unifica la cabecera superior de Inventario,
Aprobación y entrega, Devoluciones y Usuarios.

Conserva el buscador, los datos de sesión,
el contador de solicitudes pendientes y el botón
para cerrar sesión.

Utiliza las variables globales de diseño.

### Resultado
Se creó HeaderEncargado como componente reutilizable.

## 5. Corrección de errores de integración

### Prompt
Revisa los errores producidos después de
renombrar las carpetas del proyecto.

Actualiza las rutas de importación sin modificar
las rutas públicas de React Router.

### Resultado
Se corrigieron referencias antiguas a carpetas
de páginas y estilos.
