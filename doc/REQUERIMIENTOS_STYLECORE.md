# Requerimientos del Sistema StyleCore

## Información del Documento
- **Proyecto:** StyleCore - Sistema de Gestión para Barberías y Salones de Belleza
- **Versión:** 2.0
- **Fecha:** 25 de diciembre de 2025
- **Tipo:** SaaS Multi-tenant

---

## 📋 Índice
1. [Requerimientos Funcionales](#requerimientos-funcionales)
2. [Requerimientos No Funcionales](#requerimientos-no-funcionales)
3. [Matriz de Trazabilidad](#matriz-de-trazabilidad)

---

# REQUERIMIENTOS FUNCIONALES

## RF-1. GESTIÓN DE USUARIOS Y AUTENTICACIÓN

### RF-1.1 Registro de Usuarios
**ID:** RF-1.1  
**Prioridad:** Alta  
**Descripción:** El sistema debe permitir el registro de usuarios con diferentes roles.

**Criterios de Aceptación:**
- Usuario puede registrarse con email y contraseña
- Usuario puede registrarse con Google, Facebook 
- Usuario puede registrarse con número de teléfono y OTP
- Sistema envía email/SMS de verificación
- Sistema valida formato de datos (email válido, contraseña mínimo 8 caracteres)

### RF-1.2 Autenticación Multi-factor (2FA)
**ID:** RF-1.2  
**Prioridad:** Media  
**Descripción:** Establecimientos y empleados pueden activar autenticación de dos factores.

**Criterios de Aceptación:**
- Opción de activar/desactivar 2FA en configuración
- Soporte para SMS y apps authenticator
- Códigos de respaldo generados al activar

### RF-1.3 Gestión de Roles y Permisos
**ID:** RF-1.3  
**Prioridad:** Alta  
**Descripción:** Sistema debe soportar 6 roles con permisos específicos.

**Roles:**
1. Super Administrador (Platform Admin)
2. Encargado/Dueño del Establecimiento (Owner)
3. Administrador del Establecimiento (Manager)
4. Empleado/Estilista/Barbero (Staff)
5. Barbero/Estilista Independiente (Freelancer)
6. Cliente (Customer)
7. Cliente Invitado (Guest)

**Criterios de Aceptación:**
- Cada rol tiene permisos específicos definidos
- Owner puede asignar permisos granulares a empleados
- Sistema previene acceso no autorizado a funcionalidades

### RF-1.4 Recuperación de Contraseña
**ID:** RF-1.4  
**Prioridad:** Alta  
**Descripción:** Usuario puede recuperar su contraseña mediante email o SMS.

---

## RF-2. GESTIÓN DE ESTABLECIMIENTOS

### RF-2.1 Registro de Establecimiento
**ID:** RF-2.1  
**Prioridad:** Alta  
**Descripción:** Nuevos establecimientos pueden registrarse en la plataforma.

**Criterios de Aceptación:**
- Formulario con datos básicos (nombre, tipo, ubicación, contacto)
- Verificación de identidad con cédula jurídica/física (opcional)
- Aprobación por Super Admin antes de activación
- Selección de plan de suscripción

### RF-2.2 Configuración de Establecimiento
**ID:** RF-2.2  
**Prioridad:** Alta  
**Descripción:** Owner puede configurar todos los aspectos de su establecimiento.

**Configuraciones incluyen:**
- Logo y galería de fotos 
- Horarios de atención por día de la semana
- Políticas de cancelación personalizadas
- Tiempo mínimo de anticipación para citas
- Configuración de notificaciones
- Idiomas soportados
- Personalización de colores corporativos
- Subdominio personalizado (plan Business+)

### RF-2.3 Gestión Multi-Sucursal
**ID:** RF-2.3  
**Prioridad:** Media  
**Descripción:** Dueños con múltiples ubicaciones pueden gestionar todas desde un dashboard corporativo.

**Criterios de Aceptación:**
- Dashboard consolidado con métricas de todas las sucursales
- Selector de sucursal para ver datos individuales
- Gestión de empleados por sucursal o rotación entre sucursales
- Transferencia de empleados entre sucursales
- Reportes consolidados y por sucursal
- Inventario individual o compartido (configurable)
- Promociones globales o por sucursal

---

## RF-3. GESTIÓN DE EMPLEADOS Y PERFILES PROFESIONALES

### RF-3.1 Registro de Empleados
**ID:** RF-3.1  
**Prioridad:** Alta  
**Descripción:** Establecimiento puede agregar empleados mediante invitación.

**Criterios de Aceptación:**
- Buscar empleado por email, teléfono o username
- Enviar invitación con rol y condiciones propuestas
- Empleado acepta/rechaza/negocia términos
- Firma digital de acuerdo laboral
- Empleado puede trabajar en múltiples establecimientos diferentes

### RF-3.2 Perfil Profesional Independiente
**ID:** RF-3.2  
**Prioridad:** Alta  
**Descripción:** Barberos/estilistas tienen perfil profesional público independiente del establecimiento.

**Características del perfil:**
- Username único (@usuario)
- Biografía y años de experiencia
- Portafolio de trabajos (fotos/videos)
- Especialidades y certificaciones
- Establecimiento(s) actual(es) donde trabaja
- Historial laboral
- Calificación promedio y número de reseñas
- Seguidores (sistema de following)
- Badge de certificaciones StyleCore

**Criterios de Aceptación:**
- Perfil visible globalmente (cross-tenant)
- Perfil se mantiene al cambiar de establecimiento
- Seguidores reciben notificación de cambio de ubicación
- Sistema de búsqueda por barbero específico

### RF-3.3 Multi-Empleo
**ID:** RF-3.3  
**Prioridad:** Media  
**Descripción:** Empleados pueden trabajar en múltiples establecimientos de diferentes dueños simultáneamente.

**Criterios de Aceptación:**
- Calendario unificado que muestra todas las citas
- Sistema previene conflictos de horarios automáticamente
- Cada establecimiento ve solo su información (privacidad)
- Dashboard de comisiones separado por establecimiento
- Cliente ve en qué ubicaciones está disponible el barbero

### RF-3.4 Gestión de Comisiones Configurable
**ID:** RF-3.4  
**Prioridad:** Alta  
**Descripción:** Establecimiento configura modelo de comisiones individual por empleado.

**Modelos soportados:**
1. Porcentaje fijo (ej: 60/40)
2. Porcentaje escalonado (incentivo por volumen)
3. Monto fijo por servicio
4. Salario fijo + comisión reducida
5. Booth rental (renta de silla)
6. Sin comisión (solo salario)

**Criterios de Aceptación:**
- Configuración individual por empleado
- Diferente % para servicios vs productos
- Propinas 100% para el empleado (opcional incluir en comisión)
- Período de liquidación configurable (diario/semanal/quincenal/mensual)
- Dashboard de comisiones para empleado y administrador
- Historial de pagos con comprobantes

### RF-3.5 Portafolio de Trabajos
**ID:** RF-3.5  
**Prioridad:** Media  
**Descripción:** Barberos/estilistas pueden publicar trabajos en su perfil.

**Criterios de Aceptación:**
- Subir fotos antes/después
- Subir videos cortos (máximo 60 segundos)
- Agregar descripción y hashtags
- Categorizar por tipo de servicio
- Sistema de likes y comentarios
- Compartir en redes sociales externas
- Moderación de contenido inapropiado

---

## RF-4. MARKETPLACE Y BÚSQUEDA

### RF-4.1 Directorio Global de Establecimientos
**ID:** RF-4.1  
**Prioridad:** Alta  
**Descripción:** Usuarios pueden ver y buscar todos los establecimientos registrados en la plataforma.

**Criterios de Aceptación:**
- Vista de mapa interactivo con todos los establecimientos
- Vista de lista con filtros
- Vista de cuadrícula con fotos
- Incluye establecimientos físicos y barberos independientes
- Geolocalización del usuario para mostrar cercanos

### RF-4.2 Búsqueda Avanzada
**ID:** RF-4.2  
**Prioridad:** Alta  
**Descripción:** Sistema permite búsqueda con múltiples filtros.

**Filtros disponibles:**
- Ubicación geográfica (provincia, cantón, distrito)
- Distancia desde ubicación actual (radio en km)
- Tipo de establecimiento (barbería/salón/spa/mixto/independiente)
- Servicios específicos
- Rango de precios
- Calificación mínima
- Disponibilidad (inmediata, hoy, esta semana)
- Acepta walk-ins
- Con promociones activas
- Modalidad: Local / A domicilio / Ambos
- Certificaciones StyleCore
- Horario de atención

**Ordenamiento:**
- Más cercanos
- Mejor calificados
- Más populares (más reseñas)
- Precio menor a mayor
- Recién agregados

### RF-4.3 Búsqueda de Barberos/Estilistas
**ID:** RF-4.3  
**Prioridad:** Alta  
**Descripción:** Usuarios pueden buscar profesionales específicos independientemente del establecimiento.

**Criterios de Aceptación:**
- Búsqueda por nombre o @username
- Búsqueda por especialidad
- Filtro por ubicación actual del profesional
- Resultados muestran establecimiento(s) donde trabaja
- Opción de seguir al profesional
- Botón directo para reservar con ese profesional

### RF-4.4 Sistema de Favoritos
**ID:** RF-4.4  
**Prioridad:** Media  
**Descripción:** Usuarios pueden guardar establecimientos como favoritos.

**Criterios de Aceptación:**
- Agregar/quitar de favoritos con 1 clic
- Categorizar favoritos ("Cerca de casa", "Cerca del trabajo")
- Lista de favoritos accesible desde menú
- Notificaciones de promociones de favoritos
- Compartir favoritos con amigos

### RF-4.5 Sistema de Seguimiento (Following)
**ID:** RF-4.5  
**Prioridad:** Media  
**Descripción:** Usuarios pueden seguir a barberos/estilistas específicos.

**Criterios de Aceptación:**
- Seguir/dejar de seguir con 1 clic
- Ver lista de barberos seguidos
- Recibir notificaciones cuando publican trabajos
- Notificación cuando barbero cambia de establecimiento
- Notificación de disponibilidad de horarios
- Feed personalizado de trabajos de barberos seguidos

---

## RF-5. SISTEMA DE RESERVAS Y CITAS

### RF-5.1 Reserva de Citas en Local
**ID:** RF-5.1  
**Prioridad:** Alta  
**Descripción:** Cliente puede reservar cita para recibir servicio en el establecimiento.

**Flujo:**
1. Seleccionar establecimiento o profesional
2. Elegir servicio(s) (múltiples servicios en una cita)
3. Seleccionar profesional específico (o "El primero disponible")
4. Ver calendario con disponibilidad en tiempo real
5. Seleccionar fecha y hora
6. Confirmar reserva

**Criterios de Aceptación:**
- Calendario visual con horarios disponibles
- Bloqueo automático de horarios ocupados
- Tiempo mínimo de anticipación respetado
- Confirmación inmediata o pendiente según configuración
- Notificación al cliente y al profesional

### RF-5.2 Reserva de Citas a Domicilio
**ID:** RF-5.2  
**Prioridad:** Media  
**Descripción:** Cliente puede reservar para que el profesional vaya a su ubicación.

**Criterios de Aceptación:**
- Filtro para ver solo profesionales que ofrecen domicilio
- Cliente ingresa dirección de servicio
- Sistema verifica que esté en zona de cobertura del profesional
- Muestra precio con recargo por domicilio
- Pago anticipado requerido
- Horarios específicos para domicilio visibles

### RF-5.3 Gestión de Citas (Cliente)
**ID:** RF-5.3  
**Prioridad:** Alta  
**Descripción:** Cliente puede gestionar sus citas desde la app.

**Acciones disponibles:**
- Ver próximas citas
- Ver historial de citas
- Cancelar cita (respetando políticas)
- Reprogramar cita
- Agregar notas para el profesional
- Recordatorios automáticos (24h y 2h antes)

### RF-5.4 Gestión de Citas (Profesional)
**ID:** RF-5.4  
**Prioridad:** Alta  
**Descripción:** Profesional gestiona sus citas desde la app.

**Acciones disponibles:**
- Ver citas del día/semana/mes
- Marcar cita como "En proceso"
- Marcar cita como "Completada"
- Marcar "No show" si cliente no asiste
- Agregar notas internas
- Bloquear horarios personales
- Configurar vacaciones

### RF-5.5 Estados de Citas
**ID:** RF-5.5  
**Prioridad:** Alta  
**Descripción:** Sistema gestiona diferentes estados de citas con transiciones válidas.

**Estados:**
- Pendiente (requiere confirmación)
- Confirmada
- En proceso
- Completada
- Cancelada (por cliente)
- Cancelada (por establecimiento)
- No show (cliente no asistió)

**Transiciones válidas definidas en lógica de negocio**

### RF-5.6 Políticas de Cancelación
**ID:** RF-5.6  
**Prioridad:** Media  
**Descripción:** Establecimiento configura políticas de cancelación personalizadas.

**Configuraciones:**
- Tiempo mínimo para cancelar sin penalización
- Penalizaciones por cancelación tardía
- Cargos por no-show
- Reembolso automático o manual
- Política diferente para servicios a domicilio

### RF-5.7 Lista de Espera
**ID:** RF-5.7  
**Prioridad:** Baja  
**Descripción:** Cliente se registra en lista de espera si no hay horario disponible.

**Criterios de Aceptación:**
- Cliente indica horarios preferidos
- Notificación automática si hay cancelación
- Cliente confirma en X tiempo o pierde turno
- Orden de lista de espera respetado

---

## RF-6. SISTEMA DE PAGOS Y FACTURACIÓN

### RF-6.1 Métodos de Pago
**ID:** RF-6.1  
**Prioridad:** Alta  
**Descripción:** Sistema soporta múltiples métodos de pago.

**Métodos soportados:**
- Efectivo
- SINPE Móvil (Costa Rica) - integración nativa
- Tarjetas de crédito/débito (Stripe, BAC Credomatic)
- Transferencia bancaria
- Apple Pay / Google Pay / Samsung Pay
- Puntos de fidelidad
- Pago mixto (combinación de métodos)

### RF-6.2 Flujo de Cobro Configurable
**ID:** RF-6.2  
**Prioridad:** Alta  
**Descripción:** Establecimiento configura quién realiza el cobro.

**Modelos:**
- A) Administrador cobra todo (centralizado)
- B) Barbero cobra directamente (descentralizado)
- C) Mixto (según método de pago)

**Criterios de Aceptación:**
- Configuración a nivel de establecimiento
- Restricciones según el modelo elegido
- Registro automático de todas las transacciones
- Conciliación diaria automática

### RF-6.3 Sistema de Propinas
**ID:** RF-6.3  
**Prioridad:** Media  
**Descripción:** Cliente puede dejar propina al profesional.

**Criterios de Aceptación:**
- Sugerencias automáticas (10%, 15%, 20%)
- Monto personalizado
- Propina opcional u obligatoria (configurable)
- 100% de propina va al profesional
- Registro separado en transacción
- Split automático si múltiples profesionales

### RF-6.4 Facturación Electrónica (funcionalidad a futoro esto auno implementar )
**ID:** RF-6.4  
**Prioridad:** Alta  
**Descripción:** Sistema genera facturas electrónicas cumpliendo normativa local.

**Criterios de Aceptación:**
- Generación automática al confirmar pago
- Cumplimiento con Hacienda (Costa Rica) o normativa local
- Incluye todos los datos fiscales requeridos
- Clave numérica de validación
- Código QR de verificación
- Envío automático por email
- Disponible en historial del cliente
- Almacenamiento por 5+ años

### RF-6.5 Cierre de Caja
**ID:** RF-6.5  
**Prioridad:** Alta  
**Descripción:** Administrador realiza cierre de caja diario.

**Criterios de Aceptación:**
- Cálculo automático de efectivo esperado
- Ingreso de efectivo real contado
- Cálculo de diferencia
- Reporte de métodos de pago del día
- Registro de notas explicativas
- Alerta si diferencia > umbral configurable
- Histórico de cierres con auditoría

### RF-6.6 Procesamiento de Reembolsos
**ID:** RF-6.6  
**Prioridad:** Media  
**Descripción:** Sistema permite procesar reembolsos al cliente.

**Criterios de Aceptación:**
- Solicitud de reembolso con motivo
- Aprobación/rechazo por administrador
- Reembolso a método original o crédito en cuenta
- Proceso automático según método (tarjeta 5-10 días, SINPE inmediato)
- Ajuste automático de comisiones si fueron pagadas
- Registro en historial con auditoría

---

## RF-7. PROGRAMA DE FIDELIZACIÓN

### RF-7.1 Sistema de Puntos
**ID:** RF-7.1  
**Prioridad:** Alta  
**Descripción:** Cliente acumula puntos por servicios y productos.

**Criterios de Aceptación:** (de forma dinamica )
- Ratio de acumulación configurable por establecimiento
- Puntos por servicios (ej: ₡1 = 1 punto)
- Puntos por productos comprados
- Bonos por cumpleaños (validado con cédula)
- Bonos por referidos exitosos
- Bonos por primera visita
- Puntos por publicar reseñas
- Puntos válidos por establecimiento
- Fecha de expiración configurable

### RF-7.2 Canje de Puntos
**ID:** RF-7.2  
**Prioridad:** Alta  
**Descripción:** Cliente canjea puntos acumulados por beneficios.

**Opciones de canje:**
- Descuentos en servicios
- Productos gratuitos o con descuento
- Servicios exclusivos
- Prioridad en reservas
- Conversión a dinero para pago (ratio configurable)

### RF-7.3 Niveles VIP
**ID:** RF-7.3  
**Prioridad:** Media  
**Descripción:** Sistema de niveles basado en puntos acumulados.

**Niveles:**
- Bronce: 0-500 puntos
- Plata: 501-1500 puntos
- Oro: 1501-3000 puntos
- Platino: 3001+ puntos

**Beneficios por nivel:**
- Multiplicador de puntos (ej: Platino gana 1.5x puntos)
- Descuentos exclusivos
- Prioridad en reservas
- Regalos especiales en cumpleaños
- Acceso a eventos VIP

### RF-7.4 Programa de Referidos
**ID:** RF-7.4  
**Prioridad:** Media  
**Descripción:** Cliente invita amigos y ambos reciben beneficios.

**Criterios de Aceptación:**
- Código único personalizado por cliente
- Tracking de referidos exitosos
- Recompensa para referente y referido
- Recompensas escalables (más referidos = mayor recompensa)
- Leaderboard mensual de mejores referentes
- Referidos bidireccionales

---

## RF-8. SERVICIOS Y PRODUCTOS

### RF-8.1 Catálogo de Servicios
**ID:** RF-8.1  
**Prioridad:** Alta  
**Descripción:** Establecimiento gestiona catálogo de servicios.

**Información por servicio:**
- Nombre y descripción
- Duración estimada (minutos)
- Precio base
- Precio por profesional (si varía)
- Categoría (corte, tinte, peinado, barba, etc.)
- Imágenes de referencia
- Disponible para cita online (sí/no)
- Disponible para domicilio (sí/no)
- Requisitos especiales

**Tipos de servicios:**
- Servicios simples
- Servicios combinados (paquetes)
- Servicios por evento (bodas, XV años)

### RF-8.2 Tienda Online
**ID:** RF-8.2  
**Prioridad:** Media  
**Descripción:** Establecimiento vende productos a través de la plataforma.

**Funcionalidades:**
- Catálogo de productos con fotos
- Gestión de inventario
- Categorías y filtros
- Carrito de compras
- Opciones de entrega (retiro en local / envío)
- Tracking de pedidos
- Historial de compras
- Puntos por compras

### RF-8.3 Gestión de Inventario
**ID:** RF-8.3  
**Prioridad:** Media  
**Descripción:** Establecimiento gestiona inventario de productos.

**Criterios de Aceptación:**
- Registro de productos con stock
- Alertas de stock bajo (configurable)
- Registro de entradas y salidas
- Historial de movimientos
- Inventario individual por sucursal (multi-sucursal)
- Transferencias entre sucursales
- Reportes de inventario

---

## RF-9. NOTIFICACIONES Y COMUNICACIONES

### RF-9.1 Sistema de Notificaciones
**ID:** RF-9.1  
**Prioridad:** Alta  
**Descripción:** Sistema envía notificaciones por múltiples canales.

**Canales:**
- Push notifications (app móvil)
- SMS (módulo premium)
- Email
- WhatsApp Business API (módulo premium)

**Tipos de notificaciones para clientes:**
- Confirmación de reserva
- Recordatorio de cita (24h y 2h antes)
- Cambios/cancelación de cita
- Puntos acumulados/canjeados
- Ofertas y promociones
- Cumpleaños y beneficios especiales
- Barbero seguido publicó nuevo trabajo
- Barbero seguido cambió de establecimiento
- Establecimiento favorito tiene promoción

**Tipos de notificaciones para empleados:**
- Nueva cita asignada
- Cancelación de cita
- Recordatorio de próxima cita
- Mensaje del cliente
- Liquidación de comisiones procesada

**Tipos de notificaciones para administradores:**
- Nueva reserva pendiente
- Reseña nueva publicada
- Inventario bajo
- Reportes diarios/semanales automáticos
- Alertas de sistema

### RF-9.2 Preferencias de Notificaciones
**ID:** RF-9.2  
**Prioridad:** Media  
**Descripción:** Usuario configura sus preferencias de notificaciones.

**Criterios de Aceptación:**
- Activar/desactivar por tipo de notificación
- Seleccionar canales preferidos
- Horarios de no molestar
- Frecuencia de notificaciones agrupadas
- Opt-out de marketing

---

## RF-10. REPORTES Y ANALYTICS

### RF-10.1 Dashboard del Establecimiento
**ID:** RF-10.1  
**Prioridad:** Alta  
**Descripción:** Owner/Manager ve métricas en tiempo real de su negocio.

**Métricas principales:**
- Citas del día/semana/mes
- Ingresos del día/semana/mes
- Ocupación por empleado (%)
- Productos vendidos
- Nuevos clientes vs recurrentes
- Calificación promedio
- Puntos otorgados

**Gráficos:**
- Tendencias de ingresos
- Servicios más populares
- Horarios pico
- Tasa de cancelación
- Satisfacción del cliente

### RF-10.2 Reportes de Empleados
**ID:** RF-10.2  
**Prioridad:** Media  
**Descripción:** Administrador genera reportes de desempeño de empleados.

**Información incluida:**
- Servicios realizados por empleado
- Ingresos generados
- Comisiones ganadas
- Calificación promedio
- Horas trabajadas
- Tasa de repetición de clientes
- Propinas recibidas

### RF-10.3 Reportes de Clientes
**ID:** RF-10.3  
**Prioridad:** Media  
**Descripción:** Análisis del comportamiento y segmentación de clientes.

**Información incluida:**
- Clientes nuevos vs recurrentes
- Frecuencia de visita
- Ticket promedio
- Lifetime value (LTV)
- Clientes en riesgo (sin visitar hace tiempo)
- Top clientes VIP
- Distribución por nivel de fidelidad

### RF-10.4 Reportes Financieros
**ID:** RF-10.4  
**Prioridad:** Alta  
**Descripción:** Reportes detallados de ingresos y gastos.

**Información incluida:**
- Ingresos por servicios
- Ingresos por productos
- Métodos de pago utilizados
- Comisiones pagadas a empleados
- Descuentos aplicados
- Proyecciones basadas en histórico
- Comparativas mes a mes / año a año

### RF-10.5 Exportación de Datos
**ID:** RF-10.5  
**Prioridad:** Media  
**Descripción:** Exportar reportes en múltiples formatos.

**Formatos soportados:**
- Excel (.xlsx)
- CSV
- PDF
- JSON (vía API)

---

## RF-11. RESEÑAS Y CALIFICACIONES

### RF-11.1 Sistema de Reseñas
**ID:** RF-11.1  
**Prioridad:** Alta  
**Descripción:** Cliente puede calificar y reseñar servicios recibidos.

**Criterios de Aceptación:**
- Calificación de 1 a 5 estrellas
- Comentario de texto (opcional)
- Subir fotos del resultado (opcional, con consentimiento)
- Solo clientes que recibieron servicio pueden reseñar (verificado)
- Una reseña por cita
- Reseña a establecimiento y/o profesional específico

### RF-11.2 Respuesta a Reseñas
**ID:** RF-11.2  
**Prioridad:** Media  
**Descripción:** Establecimiento o profesional puede responder reseñas.

**Criterios de Aceptación:**
- Una respuesta por reseña
- Visible públicamente
- Notificación al cliente cuando hay respuesta
- Opción de editar respuesta

### RF-11.3 Moderación de Reseñas
**ID:** RF-11.3  
**Prioridad:** Media  
**Descripción:** Sistema modera reseñas inapropiadas.

**Criterios de Aceptación:**
- Filtro automático de lenguaje ofensivo
- Reporte de reseñas por usuarios
- Revisión manual por plataforma
- Eliminación de reseñas falsas o spam
- Penalización por reseñas fraudulentas

---

## RF-12. CARACTERÍSTICAS MULTI-TENANT

### RF-12.1 Aislamiento de Datos
**ID:** RF-12.1  
**Prioridad:** Alta (Crítico)  
**Descripción:** Datos de cada tenant completamente aislados.

**Criterios de Aceptación:**
- Todas las tablas incluyen tenant_id
- Queries automáticas filtran por tenant
- Imposible acceder a datos de otro tenant
- Índices optimizados por tenant
- Backups individuales por tenant (Enterprise)

### RF-12.2 Personalización por Tenant
**ID:** RF-12.2  
**Prioridad:** Media  
**Descripción:** Cada establecimiento personaliza su espacio.

**Personalizaciones:**
- Logo y colores corporativos
- Dominio/subdominio personalizado
- Plantillas de email branded
- Moneda y zona horaria
- Idioma predeterminado
- Políticas específicas del negocio

### RF-12.3 Gestión de Suscripciones
**ID:** RF-12.3  
**Prioridad:** Alta  
**Descripción:** Sistema gestiona planes de suscripción por tenant.

**Planes:**
- Básico (Gratuito): hasta 2 empleados, 50 citas/mes
- Professional (₡15,000/mes): 5 empleados, ilimitado
- Business (₡35,000/mes): empleados ilimitados, 3 ubicaciones
- Enterprise (Custom): ubicaciones ilimitadas, white-label

**Criterios de Aceptación:**
- Upgrade/downgrade de plan
- Prorrateo automático
- Facturación mensual automática
- Suspensión por falta de pago
- Reactivación al pagar

---

## RF-13. INTEGRACIONES

### RF-13.1 Integración con Google Calendar
**ID:** RF-13.1  
**Prioridad:** Media  
**Descripción:** Citas se sincronizan con calendario personal del usuario.

### RF-13.2 Integración con Redes Sociales
**ID:** RF-13.2  
**Prioridad:** Media  
**Descripción:** Compartir contenido directamente a Instagram, Facebook, TikTok.

### RF-13.3 API Pública
**ID:** RF-13.3  
**Prioridad:** Media  
**Descripción:** API REST para integraciones de terceros (Plan Business+).

**Endpoints principales:**
- Gestión de citas
- Consulta de disponibilidad
- Información de establecimientos
- Catálogo de servicios
- Autenticación OAuth 2.0
- Rate limiting
- Documentación completa

---

# REQUERIMIENTOS NO FUNCIONALES

## RNF-1. RENDIMIENTO

### RNF-1.1 Tiempo de Respuesta
**ID:** RNF-1.1  
**Prioridad:** Alta  
**Descripción:** Tiempos de respuesta deben ser óptimos para buena experiencia.

**Métricas:**
- Carga inicial de la app: < 2 segundos
- Búsqueda de establecimientos: < 1 segundo
- Reserva de cita: < 3 segundos (todo el flujo)
- Carga de perfil: < 1 segundo
- Queries de base de datos: < 200ms (p95)
- APIs REST: < 500ms (p95)

### RNF-1.2 Capacidad de Concurrencia
**ID:** RNF-1.2  
**Prioridad:** Alta  
**Descripción:** Sistema soporta múltiples usuarios simultáneos.

**Métricas:**
- Usuarios concurrentes: 10,000+ sin degradación
- Transacciones por segundo (TPS): 500+
- Reservas simultáneas: 100+ sin conflictos

### RNF-1.3 Optimización de Base de Datos
**ID:** RNF-1.3  
**Prioridad:** Alta  
**Descripción:** Base de datos optimizada para consultas frecuentes.

**Implementaciones:**
- Índices en columnas críticas (tenant_id, user_id, fecha)
- Particionamiento de tablas grandes por tenant
- Caché con Redis para queries frecuentes
- Connection pooling
- Query optimization con EXPLAIN

---

## RNF-2. ESCALABILIDAD

### RNF-2.1 Escalabilidad Horizontal
**ID:** RNF-2.1  
**Prioridad:** Alta  
**Descripción:** Sistema puede escalar agregando más servidores.

**Implementaciones:**
- Arquitectura stateless
- Load balancer (Nginx, AWS ELB)
- Auto-scaling basado en métricas
- Contenedores Docker + Kubernetes

### RNF-2.2 Escalabilidad de Base de Datos
**ID:** RNF-2.2  
**Prioridad:** Media  
**Descripción:** Base de datos escala según crecimiento.

**Implementaciones:**
- Read replicas para queries de lectura
- Sharding por tenant_id (grandes clientes)
- Archivado de datos históricos (> 2 años)

### RNF-2.3 CDN para Contenido Estático
**ID:** RNF-2.3  
**Prioridad:** Media  
**Descripción:** Imágenes y assets servidos por CDN.

**Implementaciones:**
- CloudFlare o AWS CloudFront
- Compresión de imágenes automática
- Lazy loading de imágenes
- Formatos modernos (WebP, AVIF)

---

## RNF-3. SEGURIDAD

### RNF-3.1 Autenticación y Autorización
**ID:** RNF-3.1  
**Prioridad:** Alta (Crítico)  
**Descripción:** Sistema seguro contra accesos no autorizados.

**Implementaciones:**
- JWT con refresh tokens
- OAuth 2.0 para third-party
- Passwords hasheados con bcrypt (cost 12+)
- Rate limiting en endpoints de auth
- Account lockout después de N intentos fallidos
- 2FA opcional para roles críticos

### RNF-3.2 Encriptación
**ID:** RNF-3.2  
**Prioridad:** Alta (Crítico)  
**Descripción:** Datos sensibles encriptados.

**Implementaciones:**
- SSL/TLS en tránsito (HTTPS obligatorio)
- Encriptación at-rest para datos sensibles
- Datos de pago tokenizados (nunca almacenar completos)
- Encriptación de cédulas y datos personales
- Certificados SSL renovados automáticamente

### RNF-3.3 Protección contra Ataques
**ID:** RNF-3.3  
**Prioridad:** Alta  
**Descripción:** Sistema protegido contra ataques comunes.

**Implementaciones:**
- Protección contra SQL Injection (prepared statements)
- Protección contra XSS (sanitización de inputs)
- Protección contra CSRF (tokens)
- Rate limiting global y por usuario
- WAF (Web Application Firewall)
- CAPTCHA en formularios públicos

### RNF-3.4 Cumplimiento Normativo
**ID:** RNF-3.4  
**Prioridad:** Alta  
**Descripción:** Cumplimiento con leyes de protección de datos.

**Normativas:**
- GDPR (Europa)
- CCPA (California)
- Ley de protección de datos local (Costa Rica)
- PCI-DSS para manejo de tarjetas (si aplica)

### RNF-3.5 Auditoría y Logging
**ID:** RNF-3.5  
**Prioridad:** Media  
**Descripción:** Registro de acciones críticas para auditoría.

**Logs incluyen:**
- Todos los accesos a datos sensibles
- Cambios en configuraciones críticas
- Transacciones financieras
- Intentos de autenticación fallidos
- Cambios en roles y permisos
- Retención de logs: 1 año mínimo

---

## RNF-4. DISPONIBILIDAD

### RNF-4.1 Uptime
**ID:** RNF-4.1  
**Prioridad:** Alta  
**Descripción:** Sistema disponible la mayor parte del tiempo.

**SLA por plan:**
- Básico: 99% (7.2h downtime/mes)
- Professional: 99.5% (3.6h downtime/mes)
- Business: 99.9% (43min downtime/mes)
- Enterprise: 99.95% (21min downtime/mes)

### RNF-4.2 Backup y Recuperación
**ID:** RNF-4.2  
**Prioridad:** Alta (Crítico)  
**Descripción:** Datos respaldados regularmente con recuperación rápida.

**Implementaciones:**
- Backups automáticos diarios
- Backups incrementales cada 6 horas
- Retención: 30 días
- Backups en múltiples zonas geográficas
- RPO (Recovery Point Objective): < 6 horas
- RTO (Recovery Time Objective): < 2 horas
- Testing de recuperación mensual

### RNF-4.3 Monitoreo y Alertas
**ID:** RNF-4.3  
**Prioridad:** Alta  
**Descripción:** Monitoreo proactivo de salud del sistema.

**Implementaciones:**
- Herramientas: Sentry, DataDog, New Relic
- Métricas monitoreadas: CPU, memoria, disco, latencia, errores
- Alertas automáticas a equipo DevOps
- Status page público para clientes
- Incident management workflow

---

## RNF-5. USABILIDAD

### RNF-5.1 Diseño Mobile-First
**ID:** RNF-5.1  
**Prioridad:** Alta  
**Descripción:** Interfaz optimizada para dispositivos móviles primero.

**Criterios:**
- Diseño responsive (móvil → tablet → desktop)
- Touch targets mínimo 44x44px
- Navegación con pulgar accesible
- Carga rápida en redes 3G/4G

### RNF-5.2 Accesibilidad
**ID:** RNF-5.2  
**Prioridad:** Media  
**Descripción:** Aplicación accesible para personas con discapacidades.

**Estándares:**
- Cumplimiento WCAG 2.1 nivel AA
- Soporte para lectores de pantalla
- Contraste de colores adecuado (4.5:1 mínimo)
- Navegación por teclado
- Textos alternativos en imágenes
- Subtítulos en videos

### RNF-5.3 Internacionalización
**ID:** RNF-5.3  
**Prioridad:** Media  
**Descripción:** Soporte para múltiples idiomas y regiones.

**Idiomas iniciales:**
- Español (default)
- Inglés
- Portugués (para expansión Brasil)

**Consideraciones:**
- Formatos de fecha/hora por región
- Monedas por país
- Métodos de pago locales
- Zonas horarias

### RNF-5.4 Experiencia de Usuario
**ID:** RNF-5.4  
**Prioridad:** Alta  
**Descripción:** Flujos intuitivos que no requieren capacitación.

**Principios:**
- Máximo 3 clics para acciones principales
- Feedback visual inmediato en acciones
- Mensajes de error claros y accionables
- Confirmación antes de acciones destructivas
- Onboarding guiado para nuevos usuarios

---

## RNF-6. MANTENIBILIDAD

### RNF-6.1 Código Limpio
**ID:** RNF-6.1  
**Prioridad:** Media  
**Descripción:** Código mantenible y bien documentado.

**Estándares:**
- Guías de estilo (ESLint, Prettier, Black)
- Code reviews obligatorios
- Cobertura de tests: > 80%
- Documentación inline para lógica compleja
- Arquitectura modular y desacoplada

### RNF-6.2 Versionamiento
**ID:** RNF-6.2  
**Prioridad:** Media  
**Descripción:** Control de versiones y deploy controlado.

**Implementaciones:**
- Git con GitFlow o trunk-based
- Semantic versioning (MAJOR.MINOR.PATCH)
- Changelog actualizado
- Tags en releases
- Ambiente de staging antes de producción

### RNF-6.3 CI/CD
**ID:** RNF-6.3  
**Prioridad:** Media  
**Descripción:** Integración y despliegue continuo.

**Pipeline:**
- Tests automáticos en cada commit
- Linting y análisis estático
- Build automático
- Deploy a staging automático
- Deploy a producción manual con aprobación
- Rollback rápido si falla

---

## RNF-7. COMPATIBILIDAD

### RNF-7.1 Navegadores Web
**ID:** RNF-7.1  
**Prioridad:** Alta  
**Descripción:** Soporte para navegadores modernos.

**Navegadores soportados:**
- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)
- Versiones móviles de los anteriores

### RNF-7.2 Sistemas Operativos Móviles
**ID:** RNF-7.2  
**Prioridad:** Alta  
**Descripción:** Apps nativas para principales plataformas móviles.

**Plataformas:**
- iOS 14+
- Android 10+ (API level 29+)

### RNF-7.3 Resoluciones de Pantalla
**ID:** RNF-7.3  
**Prioridad:** Alta  
**Descripción:** Diseño responsivo para todas las resoluciones comunes.

**Breakpoints:**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+
- Large desktop: 1920px+

---

## RNF-8. OBSERVABILIDAD

### RNF-8.1 Logging
**ID:** RNF-8.1  
**Prioridad:** Alta  
**Descripción:** Logs estructurados para debugging y análisis.

**Niveles:**
- ERROR: Errores que requieren atención
- WARN: Situaciones anómalas no críticas
- INFO: Eventos importantes del sistema
- DEBUG: Información detallada para desarrollo

**Almacenamiento:**
- Logs centralizados (ELK stack, CloudWatch)
- Búsqueda y filtrado eficiente
- Retención: 90 días

### RNF-8.2 Métricas
**ID:** RNF-8.2  
**Prioridad:** Media  
**Descripción:** Métricas de negocio y técnicas.

**Métricas técnicas:**
- Request rate, error rate, duration (RED)
- CPU, memoria, disco, red (USE)
- Database performance

**Métricas de negocio:**
- Nuevos registros diarios
- Citas reservadas
- Ingresos procesados
- Usuarios activos (DAU, MAU)

### RNF-8.3 Tracing
**ID:** RNF-8.3  
**Prioridad:** Baja  
**Descripción:** Trazabilidad de requests entre microservicios.

**Implementación:**
- OpenTelemetry o similar
- Visualización de traces
- Identificación de cuellos de botella

---

## RNF-9. COSTO

### RNF-9.1 Eficiencia de Recursos
**ID:** RNF-9.1  
**Prioridad:** Media  
**Descripción:** Optimizar costos de infraestructura.

**Estrategias:**
- Auto-scaling para pagar solo lo necesario
- Uso de instancias spot/preemptible cuando sea posible
- Cache agresivo para reducir DB queries
- Compresión de assets
- CDN para reducir ancho de banda

### RNF-9.2 Optimización de Base de Datos
**ID:** RNF-9.2  
**Prioridad:** Media  
**Descripción:** Reducir costos de almacenamiento.

**Estrategias:**
- Archivado de datos antiguos a storage barato
- Compresión de imágenes antes de almacenar
- Eliminar datos duplicados
- Limpieza de datos no usados

---

# MATRIZ DE TRAZABILIDAD

| ID | Requerimiento | Módulo | Prioridad | Estado |
|----|---------------|---------|-----------|---------|
| RF-1.1 | Registro de Usuarios | Autenticación | Alta | Pendiente |
| RF-1.2 | 2FA | Autenticación | Media | Pendiente |
| RF-1.3 | Roles y Permisos | Autenticación | Alta | Pendiente |
| RF-2.1 | Registro Establecimiento | Establecimientos | Alta | Pendiente |
| RF-2.2 | Configuración Establecimiento | Establecimientos | Alta | Pendiente |
| RF-2.3 | Multi-Sucursal | Establecimientos | Media | Pendiente |
| RF-3.1 | Registro Empleados | Empleados | Alta | Pendiente |
| RF-3.2 | Perfil Profesional | Empleados | Alta | Pendiente |
| RF-3.3 | Multi-Empleo | Empleados | Media | Pendiente |
| RF-3.4 | Comisiones | Empleados | Alta | Pendiente |
| RF-4.1 | Directorio Global | Marketplace | Alta | Pendiente |
| RF-4.2 | Búsqueda Avanzada | Marketplace | Alta | Pendiente |
| RF-4.3 | Búsqueda Barberos | Marketplace | Alta | Pendiente |
| RF-4.4 | Favoritos | Marketplace | Media | Pendiente |
| RF-4.5 | Following | Marketplace | Media | Pendiente |
| RF-5.1 | Reserva en Local | Citas | Alta | Pendiente |
| RF-5.2 | Reserva a Domicilio | Citas | Media | Pendiente |
| RF-5.3 | Gestión Citas Cliente | Citas | Alta | Pendiente |
| RF-5.4 | Gestión Citas Profesional | Citas | Alta | Pendiente |
| RF-6.1 | Métodos de Pago | Pagos | Alta | Pendiente |
| RF-6.2 | Flujo de Cobro | Pagos | Alta | Pendiente |
| RF-6.4 | Facturación | Pagos | Alta | Pendiente |
| RF-7.1 | Sistema de Puntos | Fidelización | Alta | Pendiente |
| RF-7.2 | Canje de Puntos | Fidelización | Alta | Pendiente |
| RF-7.3 | Niveles VIP | Fidelización | Media | Pendiente |
| RF-8.1 | Catálogo Servicios | Servicios | Alta | Pendiente |
| RF-8.2 | Tienda Online | Productos | Media | Pendiente |
| RF-9.1 | Notificaciones | Comunicación | Alta | Pendiente |
| RF-10.1 | Dashboard | Analytics | Alta | Pendiente |
| RF-11.1 | Reseñas | Reseñas | Alta | Pendiente |
| RF-12.1 | Aislamiento Datos | Multi-tenant | Alta | Pendiente |
| RNF-1.1 | Tiempo Respuesta | Rendimiento | Alta | Pendiente |
| RNF-3.1 | Autenticación | Seguridad | Alta | Pendiente |
| RNF-3.2 | Encriptación | Seguridad | Alta | Pendiente |
| RNF-4.1 | Uptime | Disponibilidad | Alta | Pendiente |
| RNF-4.2 | Backups | Disponibilidad | Alta | Pendiente |
| RNF-5.1 | Mobile-First | Usabilidad | Alta | Pendiente |

---

## NOTAS FINALES

### Priorización para MVP:
**Fase 1 (MVP - 3-4 meses):**
- RF-1.1, RF-1.3 (Autenticación básica)
- RF-2.1, RF-2.2 (Establecimientos)
- RF-3.1, RF-3.2 (Empleados y perfiles)
- RF-4.1, RF-4.2 (Búsqueda básica)
- RF-5.1, RF-5.3, RF-5.4 (Reservas en local)
- RF-6.1, RF-6.4 (Pagos básicos)
- RF-8.1 (Catálogo servicios)
- RF-9.1 (Notificaciones email)
- RF-10.1 (Dashboard básico)
- Todos los RNF de prioridad Alta

**Fase 2 (Crecimiento - 3-4 meses):**
- RF-1.2 (2FA)
- RF-3.3, RF-3.4 (Multi-empleo, comisiones)
- RF-4.4, RF-4.5 (Favoritos, Following)
- RF-5.2 (Domicilio)
- RF-6.2 (Flujo cobro configurable)
- RF-7.1, RF-7.2 (Puntos básico)
- RF-11.1 (Reseñas)

**Fase 3 (Premium - 3-4 meses):**
- RF-2.3 (Multi-sucursal)
- RF-7.3 (Niveles VIP)
- RF-8.2 (Tienda online)
- RF-10.2, RF-10.3, RF-10.4 (Reportes avanzados)
- RF-13.1, RF-13.2, RF-13.3 (Integraciones)

### Dependencias Críticas:
- RF-12.1 (Multi-tenant) es base para todo
- RF-1.3 (Roles) requerido antes de RF-3.1
- RF-2.1 requerido antes de RF-5.1
- RF-6.1 requerido antes de RF-7.1

### Supuestos:
- Desarrollo con equipo de 4-6 personas
- Stack tecnológico: Laravel + Inertia + React/Vue + TypeScript
- Infraestructura cloud (AWS/GCP/Azure)
- Uso de servicios managed cuando sea posible

---

**Fin del documento de requerimientos**
