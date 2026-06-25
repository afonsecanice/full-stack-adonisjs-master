---
name: openspec-implement
description: Implementa un cambio OpenSpec. Úsala cuando el prompt mencione "implementa el change <id>" o "trabaja sobre openspec/changes/<id>".
disable-model-invocation: false
allowed-tools: [Read, Edit, Write, Bash, Grep, Glob]
---

Cuando se te pida implementar un cambio OpenSpec:

1. Lee TODOS estos archivos en orden, sin excepción:
   - openspec/changes/<id>/proposal.md
   - openspec/changes/<id>/design.md (si existe)
   - openspec/changes/<id>/specs/**/*.md
   - openspec/changes/<id>/tasks.md
2. Para cada task de tasks.md, marca ☐ → en progreso, implementa, valida, marca ☑.
3. Si necesitas desviarte de algo en specs/, **detente y pregunta**. NO improvises.
4. Al terminar todas las tasks, ejecuta los tests del proyecto.
5. Cierra con un resumen: qué archivos cambiaron, qué tests pasan, qué quedó pendiente.

NUNCA modifiques archivos en openspec/. Ese directorio es input para ti, no output.