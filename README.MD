# Realtime Chat - Prueba Técnica Frontend (Vue 3 + React)

Este repositorio contiene la solución a la prueba técnica para el rol de Desarrollador Frontend. El proyecto consiste en dos aplicaciones cliente (Vue 3 y React) que se conectan en tiempo real a un mismo servidor de Socket.io.

 **Demos en Vivo:**
- **React Chat:** [PROXIMAMENTE EL LINK AQUÍ]
- **Vue 3 Chat:** [PROXIMAMENTE EL LINK AQUÍ]
- **Backend (API):** [PROXIMAMENTE EL LINK AQUÍ]

---

## Arquitectura y Decisiones Técnicas

El enfoque principal de la solución fue mantener un código modular, escalable y limpio, evitando el acoplamiento directo entre la interfaz gráfica y la lógica de negocio o comunicación.

1. **Patrón Singleton para WebSockets:** El manejo de Socket.io no se encuentra dentro de los componentes visuales. Se creó un servicio aislado (`socketService.ts`) en ambos clientes. Esto previene múltiples conexiones accidentales, facilita el testing y asegura que la lógica de tiempo real esté centralizada.
2. **Prevención de Fugas de Memoria (Memory Leaks):**
   Se implementó una correcta limpieza de los *listeners* (`socket.disconnect()`) atada al ciclo de vida de los componentes principales (`onUnmounted` en Vue, `useEffect cleanup` en React) para evitar eventos duplicados.
3. **Manejo de Estado Global Moderno:**
   - En **React**, se utilizó `Zustand` por su ligereza y su capacidad nativa para integrarse fuera del árbol de React, permitiendo al `socketService` actualizar el estado sin necesidad de *prop drilling* o *hooks* complejos.
   - En **Vue 3**, se implementó `Pinia` junto con la Composition API (`Setup Stores`), que es el estándar actual y recomendado por el ecosistema Vue.
4. **TypeScript First:** Se definieron interfaces estrictas (ej. `Message`) a lo largo del flujo de datos para garantizar la integridad de los objetos transmitidos entre el backend y los clientes.

---

##  Funcionalidades y Bonus Implementados

Además de los requisitos base, se incluyeron las siguientes mejoras:

- [x] **TypeScript:** Tipado estricto en ambos clientes.
- [x] **Reconexión Automática:** Manejada de forma nativa por el cliente de socket y reflejada en la UI.
- [x] **Scroll Automático:** Implementado con referencias (`useRef` / `ref`) al llegar nuevos mensajes.
- [x] **Persistencia Local:** Historial de chat guardado en `localStorage` (mediante middleware en Zustand y *watchers* en Pinia).
- [x] **Avatares de Usuario:** Generación dinámica de avatares en formato SVG (DiceBear API) basados en el nombre del usuario.
- [x] **Identidad Visual Condicional:** Alineación y colores de mensajes según el emisor (estilo mensajería moderna).

---

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
*Desarrollado por Bryzon para la prueba técnica de Frontend.*