# Prueba Técnica Frontend - Chat en Tiempo Real (Vue 3 + React + Socket.io)

Este repositorio contiene la solución completa a la prueba técnica para el rol de Desarrollador Frontend. El proyecto implementa un sistema de mensajería bidireccional mediante WebSockets, compuesto por un servidor backend en Node.js y dos aplicaciones cliente independientes desarrolladas en Vue 3 y React.

## Demos en Producción

Las aplicaciones han sido desplegadas para facilitar su revisión. Al estar conectadas al mismo backend, los mensajes enviados desde el cliente de React se reflejarán inmediatamente en el cliente de Vue, y viceversa.

* Cliente React: https://prueba-tecnica-chat.vercel.app/
* Cliente Vue 3: https://vue-chat-ten.vercel.app/

*Nota sobre el entorno de producción: El servidor de WebSockets está alojado en un servicio gratuito (Render). Si el servidor no recibe tráfico por 15 minutos, entra en estado de suspensión. Al enviar el primer mensaje tras un periodo de inactividad, puede haber una demora de hasta 30 segundos mientras la instancia se reactiva.*

---

## Arquitectura y Decisiones Técnicas

El objetivo principal de la arquitectura frontend fue garantizar la escalabilidad, el tipado estricto y la separación de responsabilidades (Separation of Concerns), evitando el acoplamiento directo entre la interfaz gráfica y la capa de red.

### 1. Aislamiento del Servicio de WebSockets (Patrón Singleton)
Una de las consideraciones más críticas fue evitar la inicialización y manejo de `socket.io-client` directamente dentro de los componentes visuales. 
Se implementó una clase `SocketService` instanciada como un Singleton en ambos clientes. Este servicio actúa como la única capa que interactúa con el servidor, exponiendo métodos limpios (`connect`, `sendMessage`, `disconnect`) hacia los componentes. Esto previene conexiones accidentales múltiples y facilita el mantenimiento.

### 2. Prevención de Fugas de Memoria (Memory Leaks)
Para garantizar un rendimiento óptimo y evitar la duplicidad de eventos (event listeners), se ató la conexión y desconexión de los sockets estrictamente al ciclo de vida del componente principal de la aplicación:
* En **React**, se utilizó la función de limpieza (cleanup function) dentro del hook `useEffect`.
* En **Vue 3**, se utilizó el hook `onUnmounted` de la Composition API.
Al destruirse el componente, se invoca `socketService.disconnect()`, limpiando la conexión de forma segura.

### 3. Manejo de Estado Global
Se optó por herramientas modernas y ligeras para el manejo del estado global, evitando arquitecturas excesivamente verbosas donde no era estrictamente necesario:
* **React:** Se utilizó **Zustand**. Su capacidad para leer y actualizar el estado por fuera del árbol de componentes de React (`useChatStore.getState()`) permitió integrar el `SocketService` de manera directa y limpia, sin necesidad de recurrir a *prop drilling* o inyección de dependencias compleja.
* **Vue 3:** Se utilizó **Pinia** implementando la sintaxis de *Setup Stores* (Composition API). Pinia ofrece una reactividad superior y un tipado nativo que se integra perfectamente con las interfaces definidas.

### 4. Integración de TypeScript
Se definieron interfaces estrictas (como `Message` y `ChatState`) a lo largo de todo el flujo de datos. Esto garantiza la predictibilidad de la estructura de los objetos transmitidos entre el servidor y los clientes, reduciendo errores en tiempo de ejecución.

---

## Funcionalidades y Requisitos Extra (Bonus) Implementados

El proyecto cumple con todos los requisitos base de la prueba e incluye las siguientes características adicionales para mejorar la experiencia de usuario y la solidez técnica:

* **Tipado Estricto:** Implementación completa con TypeScript en ambos clientes.
* **Reconexión Automática:** Delegada de forma nativa al cliente de Socket.io, reflejando el cambio de estado (Conectado/Desconectado) en la interfaz del usuario en tiempo real.
* **Scroll Automático:** Implementado en la lista de mensajes utilizando referencias del DOM (`useRef` en React y `ref` + `nextTick` en Vue) para desplazar la vista al último mensaje entrante de forma automática.
* **Persistencia Local:** Los mensajes de la sesión se guardan en el `localStorage` del navegador. En React se logró mediante el middleware `persist` de Zustand, y en Vue mediante `watchers` profundos sobre el estado reactivo.
* **Avatares Dinámicos y Autenticación Simulada:** Pantalla de bienvenida que permite al usuario definir su nombre (o usar uno aleatorio). Se integró la API de DiceBear para generar avatares SVG únicos basados en el nombre seleccionado.
* **Interfaz de Usuario Contextual:** Lógica visual para alinear los mensajes propios a la derecha con un color distintivo, y los mensajes entrantes a la izquierda, emulando la experiencia de mensajería moderna.

---

## Instrucciones de Ejecución Local

Para ejecutar el proyecto en un entorno de desarrollo local, siga los siguientes pasos:

## Instrucciones para ejecutar localmente

### 1. Levantar el Backend (Socket.io)

```bash
cd server
npm install
node index.js
```
El servidor correrá en `http://localhost:3001`.

### 2. Levantar el cliente Vue 3
En una nueva terminal:
```bash
cd vue-chat
npm install
npm run dev
```
La aplicación correrá en el puerto asignado por Vite (generalmente `http://localhost:5173`).

### 3. Levantar el cliente React
En una tercera terminal:
```bash
cd react-chat
npm install
npm run dev
```
La aplicación correrá en el puerto asignado por Vite (generalmente `http://localhost:5174`).

---
*Desarrollado por Bryzon*