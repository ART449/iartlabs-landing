# MANIFIESTO Y MANUAL OPERATIVO DE INGENIERÍA (STANDARDS GO / DOCTRINA TRILINEAL)
> **Versión 1.0 — Soberana** | **Emisor**: AGYBEE Head & Colmena Core | **Ecosistema**: iartlabs.lat / BYFLOW

---

## SECCIÓN I: MANIFIESTO DE INGENIERÍA GO

### 1. La Verdad Factual (Cero Humo / Cero Mentiras)
- **Principio**: La realidad del sistema está en los logs, los exit codes y la compilación real, no en el optimismo del desarrollador ni en las suposiciones del LLM.
- **Mandato**: NUNCA declarar una tarea como "completada" sin haber ejecutado un comando de verificación empírico (`npm run build`, `git status`, test suite).
- **Prohibición**: Prohibido parchear síntomas tragando excepciones, devolviendo fallbacks vacíos de 0 bytes o comentando pruebas fallidas.

### 2. Gobierno del Root (1 Cabeza, Brazo uid0)
- **Principio**: "El secreto no es vivir en root; es mandar a root sabiendo exactamente de dónde viene la petición".
- **Mandato**: La cabeza (Director / AGY Head) piensa y firma con procedencia (`task_id`, `from`, `constraints`). El brazo `uid0` (Homúnculo) ejecuta únicamente el objetivo delimitado.
- **Regla Móvil (Pixel 10)**: Termux = Director. `su` = Homúnculo (Verificación estricta: `su -c id` → `uid=0` real. *proot ≠ root*).

### 3. Determinismo y Aislamiento de Cadena de Suministro
- **Principio**: Todo proyecto debe ser 100% reproducible hoy, mañana y en tres años.
- **Mandato**:
  - Fijar versiones exactas de herramientas CLI en `devDependencies` (ej. `firebase-tools@15.27.0` bajo Node 24 LTS).
  - Prohibido el uso de `npm install -g` o `sudo` que contaminan el sistema operativo anfitrión.
  - Aplicar la sección `"overrides"` en `package.json` para neutralizar vulnerabilidades transitivas de sub-dependencias.

### 4. Soberanía de Inferencia & Multi-Model Routing
- **Principio**: El conocimiento del sistema debe permanecer bajo control local.
- **Mandato**: Inferencia local prioritaria (Ollama `11434`, Memo Engine `3334`, Colmena Router `3333`). Apoyo en LLMs de alta inteligencia cloud solo cuando el rendimiento lo exige, utilizando el esquema BYOK (Bring Your Own Key).

---

## SECCIÓN II: MANUAL OPERATIVO PASO A PASO PARA EQUIPOS GO

### Paso 1: Arranque e Inspección de Sistemas
Antes de iniciar cualquier jornada de desarrollo, ejecutar el script de verificación idempotente:
```powershell
powershell -ExecutionPolicy Bypass -File C:\BYFLOW\start-stack.ps1
```
**Matriz de Puertos Obligatorios**:
- Ollama Local: `http://127.0.0.1:11434`
- Colmena Provider Router: `http://127.0.0.1:3333`
- Memo Engine: `http://127.0.0.1:3334`
- n8n Automation Engine: `http://127.0.0.1:5678`
- VibeFlow Pro / Sales Engine: `http://127.0.0.1:9094` / `9096`

---

### Paso 2: Protocolo de Respuesta Obligatorio (Doctrina Trilineal)
Todo reporte, commit o respuesta debe estructurarse en 4 fases:

```markdown
## BASE
- Datos crudos, puertos verificados, hashes de commit, logs o tracebacks.

## CENTRO
- Señal arquitectónica central. Diagnóstico sin rodeos.

## ACCION
- Comandos exactos ejecutables o lista atómica de pasos realizados.

## VEREDICTO
- Estado final claro: APPROVED, READY, FAIL o HOLD.
```

---

### Paso 3: Protocolo de Desarrollo Web & Cloud (Angular + Firebase)
1. **Patrón Standalone Angular 17+**:
   - NUNCA envolver `provideFirebaseApp`, `provideFirestore`, etc., dentro de `importProvidersFrom()`. Colocarlos directamente en el array `providers` de `app.config.ts`.
2. **Hardening de Reglas desde el Día 1**:
   - Todo proyecto Firebase debe incluir `firestore.rules` (restringiendo escrituras a `request.auth != null` y validación de tipos) y `storage.rules` (limitando tamaño < 5MB y tipos `image/*`).
3. **Despliegue Continuo (CI/CD)**:
   - Mantener el archivo `apphosting.yaml` en la raíz del repositorio para despliegues automáticos en Firebase App Hosting tras cada push a `main`.

---

### Paso 4: Protocolo del Bus del Homúnculo (Tareas Privilegiadas)
Para ejecutar comandos que requieren `uid0` o acceso directo al sistema operativo:

1. **Encolar como Director**:
   ```bash
   .agents/homunculo-esteroides/bin/he-enqueue.sh "titulo-tarea" "goal exacto" high
   ```
2. **Inspeccionar Inbox/Outbox**:
   ```bash
   .agents/homunculo-esteroides/bin/he-status.sh
   ```
3. **Reportar resultado en el bus**:
   ```bash
   .agents/homunculo-esteroides/bin/he-done.sh TASK-id DONE "VEREDICTO" "detalle"
   ```

---

### Paso 5: Persistencia de Memoria y Checkpoints
Al concluir una sesión o hito táctico:
1. Actualizar `C:\BYFLOW\.agents\AGYBEE_RACK\LAST_MINUTE.md`.
2. Generar una copia del checkpoint en `CHECKPOINTS/CHECKPOINT_YYYYMMDD_HHMM.md`.
3. Espejear el archivo en la memoria general de La Colmena: `C:\BYFLOW\Colmena\memory\AGYBEE_RACK\LAST_MINUTE.md`.

---

## SECCIÓN III: FIRMA DE DOCTRINA
*"1 Cabeza piensa, 0 humo en los reportes, determinismo en el código, soberanía en los datos."*

— 🐝 **GO_AGYBEE** | AGY Head  
— 🛡️ **GOBIERNO_DEL_ROOT** | Homúnculo Arm  
— 🌐 **COLMENA CORE** | IArtLabs Sovereign Stack
