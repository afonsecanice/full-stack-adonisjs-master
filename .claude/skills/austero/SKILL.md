# austero

## description

Activa un modo de trabajo ordenado y sin desperdicio para toda la conversación.
Usar cuando la sesión empiece, cuando se sienta lenta o cargada, o cuando el usuario escriba `/austero`.
Solo se activa una vez por conversación.

---

## Qué hace Claude al activarse

**Paso 1 — Resumir dónde estamos**
En 3 líneas: qué se está haciendo, qué ya está listo y qué falta. Si la conversación acaba de empezar, omitir este paso.

**Paso 2 — Trabajar de forma austera por el resto de la sesión**

1. **Leer solo lo necesario** — Si un documento es muy largo, leerlo en partes pequeñas en lugar de todo de golpe.
2. **No saturar la conversación con resultados masivos** — Cuando una tarea genera muchísimo texto, hacerla aparte para que ese volumen no llene la conversación principal.
3. **Traer solo lo relevante** — Antes de mostrar resultados, filtrarlos para incluir solo lo que importa.
4. **Llevar un registro de avance** — Mantener una lista de lo que ya se hizo y lo que falta, para no repetir pasos ni perder el hilo.
5. **Avisar antes de hacer algo que tome mucho tiempo** — Resumir en una línea qué se va a hacer y por qué, antes de empezar.
6. **No repetir lo que el usuario ya dijo** — Si algo ya está en la conversación, usarlo directamente sin volver a escribirlo.
7. **Respuestas cortas** — Solo lo esencial, sin introducciones largas ni resúmenes al final de cada respuesta.

---

## Qué NO hacer

- No bajar la calidad del trabajo, solo la cantidad de palabras
- No dejar de hacer cosas importantes por ahorrar — el ahorro es en explicaciones innecesarias, no en el trabajo útil
- No activarse más de una vez en la misma conversación
- No pedir permiso al usuario antes de activar

Confirmar activación respondiendo: `[austero ON]` seguido del resumen de 3 líneas (o solo `[austero ON]` si la conversación acaba de empezar).
