# Casos de Uso: Profesionales en StyleCore v2.0

## 🎯 Dos tipos de trabajadores

StyleCore simplifica la relación laboral en **dos categorías claras**:

---

### 1️⃣ Profesionales Independientes (Freelancers)

**Características:**
- Se registran como **independientes**
- **NO pertenecen** a ningún establecimiento
- Mantienen su autonomía total
- Gestionan sus propios clientes y precios

**Pueden:**
- ✅ Trabajar 100% a domicilio (sin ubicación fija)
- ✅ Agregar múltiples zonas de operación
- ✅ Tener una ubicación fija (ej: su casa/estudio)
- ✅ **Colaborar temporalmente** con múltiples establecimientos (solicitudes)
- ✅ Rechazar o aceptar solicitudes de establecimientos
- ✅ Establecer sus propias tarifas

**Ejemplo en DB:**
```sql
-- Usuario profesional independiente
users:
  id = 1
  role = 'freelancer'
  type = 'professional'

-- Zonas donde opera (puede tener múltiples)
professional_service_zones:
  id = 10
  professional_id = 1
  zone_type = 'fixed_location'
  zone_name = 'Mi estudio en Curridabat'
  address = 'Curridabat centro, 100m este del parque'
  available_walk_in = true
  available_home_service = true

professional_service_zones:
  id = 11
  professional_id = 1
  zone_type = 'service_area'
  zone_name = 'Zona GAM'
  coverage_areas = ["San José", "Heredia", "Cartago"]
  available_home_service = true

-- Colaboración TEMPORAL con establecimiento (NO es empleado)
establishment_user:
  establishment_id = 50
  user_id = 1
  employment_type = 'freelancer'  ← Sigue siendo independiente
  status = 'pending'  -- Esperando aprobación

-- Sus servicios son independientes
services:
  id = 100
  establishment_id = NULL
  professional_id = 1
  name = 'Corte fade'
  base_price = 15000

-- Citas sin establecimiento
appointments:
  establishment_id = NULL
  professional_id = 1
  location_type = 'home_service'
  home_address = 'Casa del cliente en Escazú'
```

---

### 2️⃣ Empleados de Establecimiento

**Características:**
- **Pertenecen directamente** al establecimiento
- Son contratados por el dueño del local
- Tienen contrato/acuerdo laboral
- Trabajan bajo las políticas del establecimiento

**Ejemplo en DB:**
```sql
-- Usuario empleado
users:
  id = 2
  role = 'staff'
  type = 'professional'

-- Empleado DIRECTO del establecimiento
establishment_user:
  establishment_id = 50
  user_id = 2
  employment_type = 'employee'  ← Empleado directo
  role = 'staff'
  commission_model = 'percentage'
  commission_percentage = 60.00
  status = 'active'
  start_date = '2025-01-01'

-- NO tiene zonas independientes (trabaja solo para el establecimiento)

-- Sus servicios están vinculados al establecimiento
services:
  id = 200
  establishment_id = 50
  professional_id = 2
  name = 'Corte clásico'

-- Citas en el establecimiento
appointments:
  establishment_id = 50
  professional_id = 2
  location_type = 'in_store'
```

---

## 📊 Comparación clara

| Aspecto | Independiente (Freelancer) | Empleado del Establecimiento |
|---------|---------------------------|------------------------------|
| **Pertenece al local** | ❌ NO | ✅ SÍ |
| **Contrato laboral** | ❌ NO | ✅ SÍ |
| **Comisiones al establecimiento** | Solo si colabora temporalmente | ✅ Siempre |
| **Define sus precios** | ✅ Siempre | ❌ El establecimiento decide |
| **Puede tener múltiples empleadores** | ✅ SÍ (colaboraciones) | ❌ Solo uno |
| **Zonas de operación** | ✅ Define las suyas | ❌ Solo del establecimiento |
| **Trabaja a domicilio** | ✅ Si quiere | Depende del establecimiento |
| **Ubicación fija propia** | Opcional | ❌ Solo del establecimiento |
| **Rechazar citas** | ✅ SÍ | Depende de políticas |
| **Gestiona su agenda** | ✅ Total | Compartida con establecimiento |

---

## 🔄 Flujos de colaboración

### Freelancer colabora con establecimiento

**Escenario:** Un barbero independiente acepta trabajar sábados en "Barbería El Clásico"

```sql
-- 1. El establecimiento envía solicitud
establishment_user:
  establishment_id = 50
  user_id = 1
  employment_type = 'freelancer'
  status = 'pending'
  commission_percentage = 40.00  -- Comisión propuesta

-- 2. El freelancer acepta
UPDATE establishment_user 
SET status = 'active', agreement_signed_at = NOW()
WHERE id = 10;

-- 3. El freelancer puede crear servicios para ese establecimiento
services:
  id = 150
  establishment_id = 50  ← Servicio ofrecido en el local
  professional_id = 1
  name = 'Corte fade en El Clásico'
  
-- 4. Clientes del establecimiento pueden reservar con él
appointments:
  establishment_id = 50
  professional_id = 1
  location_type = 'in_store'
  
-- 5. El freelancer SIGUE teniendo sus propios servicios independientes
services:
  id = 100
  establishment_id = NULL
  professional_id = 1
  name = 'Corte fade a domicilio'
```

**Importante:** El freelancer puede **terminar la colaboración** en cualquier momento:
```sql
UPDATE establishment_user 
SET status = 'inactive', end_date = '2025-12-26'
WHERE establishment_id = 50 AND user_id = 1;
```

---

## 🎨 Flujos de registro

### Para profesionales nuevos:

**Opción A: "Soy independiente"**
1. Se registra como `role = 'freelancer'`
2. Define si tiene ubicación fija o solo trabaja a domicilio
3. Agrega zonas donde opera
4. Crea sus servicios
5. **Opcionalmente** puede recibir solicitudes de colaboración de establecimientos

**Opción B: "Quiero trabajar en un establecimiento"**
1. Se registra como `role = 'staff'` (o similar)
2. Busca establecimientos en su zona
3. Envía solicitud de empleo
4. El dueño lo aprueba y configura comisiones
5. Queda vinculado como **empleado directo**

---

## 💡 Casos de uso reales

### Caso 1: Luis, barbero independiente

```typescript
// Luis se registra
const luis = {
  role: 'freelancer',
  type: 'professional',
  name: 'Luis Martínez'
};

// Agrega su estudio en Curridabat
const zona1 = {
  professional_id: luis.id,
  zone_type: 'fixed_location',
  zone_name: 'Estudio Luis - Curridabat',
  address: 'Frente al parque',
  available_walk_in: true,
  available_home_service: false
};

// También ofrece servicio a domicilio en otras zonas
const zona2 = {
  professional_id: luis.id,
  zone_type: 'home_service_only',
  zone_name: 'A domicilio GAM',
  coverage_areas: ['San José', 'Heredia', 'Alajuela']
};

// Luis recibe solicitud de "Barbería El Clásico"
// para trabajar los fines de semana
// Acepta, pero SIGUE siendo independiente
```

### Caso 2: Carlos, empleado de salón

```typescript
// Carlos aplica a "Salón Elegancia"
const carlos = {
  role: 'staff',
  type: 'professional',
  name: 'Carlos Rojas'
};

// El dueño lo contrata
const empleo = {
  establishment_id: salonElegancia.id,
  user_id: carlos.id,
  employment_type: 'employee',  // ← Empleado directo
  commission_model: 'percentage',
  commission_percentage: 60,
  status: 'active'
};

// Carlos NO puede crear servicios independientes
// Solo trabaja en el salón
```

### Caso 3: María, freelancer con múltiples colaboraciones

```typescript
// María es independiente pero colabora con 3 establecimientos
const maria = {
  role: 'freelancer',
  zones: [
    {type: 'fixed_location', name: 'Mi estudio en Escazú'},
    {type: 'service_area', coverage: ['Santa Ana', 'Escazú']}
  ]
};

// Colaboraciones activas (NO es empleada de ninguno)
const colaboraciones = [
  {
    establishment: 'Salón Belleza',
    employment_type: 'freelancer',
    days: ['lunes', 'martes'],
    commission: 35
  },
  {
    establishment: 'Spa Relax',
    employment_type: 'freelancer',
    days: ['jueves'],
    commission: 40
  },
  {
    establishment: 'Salón Premium',
    employment_type: 'freelancer',
    days: ['sábado'],
    commission: 30
  }
];

// Y ADEMÁS tiene sus propios clientes los miércoles, viernes y domingo
```

---

## ✅ Validaciones necesarias

```php
// Al crear establecimiento, NO puede tener type='independent'
$allowedTypes = ['barbershop', 'salon', 'spa', 'mixed'];

// Al vincular profesional a establecimiento
if ($request->employment_type === 'employee') {
    // Es empleado directo
    // Validar contrato, términos, etc.
    // NO puede tener employment_type='employee' en múltiples establecimientos
    $existingEmployment = EstablishmentUser::where('user_id', $userId)
        ->where('employment_type', 'employee')
        ->where('status', 'active')
        ->exists();
    
    if ($existingEmployment) {
        throw new Exception('Ya es empleado de otro establecimiento');
    }
}

if ($request->employment_type === 'freelancer') {
    // Colaboración temporal
    // PUEDE tener múltiples colaboraciones activas
    // El freelancer puede cancelar en cualquier momento
}

// Al crear servicio
if ($service->establishment_id === null) {
    // Servicio independiente
    // DEBE tener professional_id
    // El profesional DEBE tener role='freelancer'
    assert($professional->role === 'freelancer');
}

if ($service->establishment_id !== null) {
    // Servicio del establecimiento
    // Verificar que el profesional esté vinculado
    $isLinked = EstablishmentUser::where('establishment_id', $establishmentId)
        ->where('user_id', $professionalId)
        ->where('status', 'active')
        ->exists();
    
    assert($isLinked);
}
```

---

## 📝 Cambios respecto a versión anterior

### ❌ Eliminado:
- `establishments.type = 'independent'` (ya no existe)
- Profesionales NO crean establecimientos virtuales
- Concepto de "establecimiento del profesional"

### ✅ Agregado:
- Tabla `professional_service_zones` para zonas de operación
- Campo `employment_type` en `establishment_user` (employee vs freelancer)
- Claridad en relación laboral: pertenece al local O es independiente

### 🔄 Simplificado:
- Solo 2 tipos de trabajadores (no 3)
- Colaboraciones temporales vs empleo directo
- Profesionales independientes definen sus zonas, no crean establecimientos

---

## 💰 Análisis Financiero

### Para Profesionales Independientes

El sistema permite registrar **todos los gastos** para calcular ganancias netas:

```typescript
// Ejemplo: Luis alquila silla en 2 establecimientos
const luisGastos = [
  {
    expense_type: 'booth_rental',
    establishment_id: 50,
    description: 'Alquiler silla en Barbería El Clásico',
    amount: 20000,  // ₡20,000/mes
    is_recurring: true,
    recurrence_period: 'monthly'
  },
  {
    expense_type: 'booth_rental',
    establishment_id: 51,
    description: 'Alquiler silla en Salón Premium',
    amount: 25000,  // ₡25,000/mes
    is_recurring: true,
    recurrence_period: 'monthly'
  },
  {
    expense_type: 'product_supplies',
    description: 'Shampoo, gel, cera',
    amount: 15000,
    expense_date: '2025-12-15'
  },
  {
    expense_type: 'transportation',
    description: 'Gasolina servicios a domicilio',
    amount: 30000,
    is_recurring: true,
    recurrence_period: 'monthly'
  }
];

// El sistema calcula automáticamente:
const reporte = {
  period: 'Diciembre 2025',
  total_revenue: 450000,        // ₡450,000 en servicios
  total_appointments: 45,
  average_ticket: 10000,
  
  // Gastos
  booth_rental_expenses: 45000,      // ₡45,000 (2 sillas)
  product_expenses: 15000,           // ₡15,000
  transportation_expenses: 30000,    // ₡30,000
  total_expenses: 90000,             // ₡90,000 total
  
  // Resultado
  net_profit: 360000,               // ₡360,000 ganancia neta
  profit_margin: 80                 // 80% de margen
};
```

**Dashboard del profesional mostraría:**
```
📊 Diciembre 2025

Ingresos:           ₡450,000
Gastos:             -₡90,000
  - Alquiler sillas:  ₡45,000
  - Productos:        ₡15,000
  - Transporte:       ₡30,000

═══════════════════════════
Ganancia neta:      ₡360,000 (80%)
```

---

### Para Establecimientos

Los dueños pueden registrar **todos sus gastos operativos**:

```typescript
// Ejemplo: Barbería "El Clásico"
const establecimientoGastos = [
  {
    expense_type: 'rent',
    description: 'Alquiler del local',
    amount: 350000,  // ₡350,000/mes
    is_recurring: true,
    recurrence_period: 'monthly'
  },
  {
    expense_type: 'utilities',
    description: 'Luz, agua, internet',
    amount: 85000,
    is_recurring: true,
    recurrence_period: 'monthly'
  },
  {
    expense_type: 'salaries',
    description: 'Salarios base empleados (3 barberos)',
    amount: 450000,
    is_recurring: true,
    recurrence_period: 'monthly'
  },
  {
    expense_type: 'commissions',
    description: 'Comisiones pagadas a profesionales',
    amount: 720000,  // Calculado automáticamente
    auto_calculated: true
  },
  {
    expense_type: 'product_inventory',
    description: 'Inventario productos',
    amount: 120000
  },
  {
    expense_type: 'software',
    description: 'Suscripción StyleCore',
    amount: 25000,
    is_recurring: true,
    recurrence_period: 'monthly'
  }
];

// Ingresos del mes
const ingresos = {
  // Servicios de empleados (40% para el establecimiento)
  employee_services: 1200000,      // ₡1,200,000 generados
  establishment_cut: 480000,       // ₡480,000 (40%)
  
  // Servicios de freelancers colaborando (20% comisión)
  freelancer_services: 600000,     // ₡600,000 generados
  freelancer_commission: 120000,   // ₡120,000 (20%)
  
  // Alquiler de sillas
  booth_rentals: 90000,            // ₡90,000 (3 sillas x ₡30,000)
  
  // Venta de productos
  product_sales: 150000,           // ₡150,000
  
  total_revenue: 840000            // ₡840,000 total
};

// Reporte financiero
const reporte = {
  period: 'Diciembre 2025',
  
  // Ingresos
  total_revenue: 840000,
  breakdown: {
    employee_commission: 480000,
    freelancer_commission: 120000,
    booth_rentals: 90000,
    product_sales: 150000
  },
  
  // Gastos
  total_expenses: 1750000,
  breakdown: {
    rent: 350000,
    utilities: 85000,
    salaries: 450000,
    commissions: 720000,
    products: 120000,
    software: 25000
  },
  
  // Resultado
  gross_profit: 840000,
  net_profit: -910000,             // Pérdida
  profit_margin: -108              // -108%
};
```

**Dashboard del dueño mostraría:**
```
📊 Barbería "El Clásico" - Diciembre 2025

INGRESOS:                          ₡840,000
  - Comisiones empleados:            ₡480,000
  - Comisiones freelancers:          ₡120,000
  - Alquiler de sillas:               ₡90,000
  - Venta productos:                 ₡150,000

GASTOS:                           -₡1,750,000
  - Alquiler local:                  ₡350,000
  - Servicios (luz, agua):            ₡85,000
  - Salarios base:                   ₡450,000
  - Comisiones pagadas:              ₡720,000
  - Inventario productos:            ₡120,000
  - Software StyleCore:               ₡25,000

═══════════════════════════════════════════
Resultado:                        -₡910,000 ⚠️

⚠️ ALERTA: Gastos superan ingresos
💡 Sugerencia: Ajustar comisiones o aumentar precios
```

---

### Modelos de Comisión Soportados

La tabla `establishment_user` ya soporta **6 modelos**:

#### 1. **Percentage** (Porcentaje)
```sql
commission_model = 'percentage'
commission_percentage = 60.00

-- Ejemplo:
-- Servicio: ₡10,000
-- Profesional recibe: ₡6,000 (60%)
-- Establecimiento recibe: ₡4,000 (40%)
```

#### 2. **Tiered** (Por escalas)
```sql
commission_model = 'tiered'
commission_tiers = [
  {min: 0, max: 500000, rate: 50},
  {min: 500001, max: 1000000, rate: 60},
  {min: 1000001, max: null, rate: 70}
]

-- Ejemplo mes con ₡1,200,000:
-- Primeros ₡500,000 → 50% = ₡250,000
-- Siguientes ₡500,000 → 60% = ₡300,000
-- Siguientes ₡200,000 → 70% = ₡140,000
-- Total profesional: ₡690,000
```

#### 3. **Fixed per service** (Monto fijo)
```sql
commission_model = 'fixed_per_service'
fixed_amount_per_service = 5000

-- Por cada servicio el profesional recibe ₡5,000
-- Sin importar el precio
```

#### 4. **Salary plus** (Salario + comisión)
```sql
commission_model = 'salary_plus'
base_salary = 250000
commission_percentage = 20.00

-- Ejemplo:
-- Salario base: ₡250,000
-- Ventas del mes: ₡800,000
-- Comisión: ₡160,000 (20%)
-- Total: ₡410,000
```

#### 5. **Booth rental** (Alquiler de silla) ⭐
```sql
commission_model = 'booth_rental'
booth_rental_fee = 30000

-- El profesional paga ₡30,000/mes
-- Se queda con el 100% de sus ventas
-- No hay comisiones al establecimiento

-- Registro en professional_expenses:
{
  expense_type: 'booth_rental',
  establishment_id: 50,
  amount: 30000,
  is_recurring: true
}
```

#### 6. **Salary only** (Solo salario)
```sql
commission_model = 'salary_only'
base_salary = 400000

-- Salario fijo sin comisiones
-- Todas las ventas son del establecimiento
```

---

### Comparación: Freelancer vs Empleado vs Alquiler de silla

**Escenario:** Luis genera ₡500,000 en ventas al mes

| Modelo | Luis recibe | Establecimiento recibe | Luis paga | Observaciones |
|--------|-------------|------------------------|-----------|---------------|
| **Freelancer independiente** | ₡500,000 | ₡0 | ₡0 al local | 100% para Luis |
| **Empleado (60% comisión)** | ₡300,000 | ₡200,000 | ₡0 | Luis es empleado |
| **Alquiler silla** | ₡500,000 | ₡30,000 (renta) | ₡30,000/mes | Luis gana más |
| **Colaboración temporal (20%)** | ₡400,000 | ₡100,000 | ₡0 | Luis es independiente |
| **Salario + comisión (₡250k + 20%)** | ₡350,000 | ₡150,000 | ₡0 | Más estable |

**Conclusión:** Para profesionales con alto volumen, **alquiler de silla** es más rentable.

---

### Reportes automáticos

El sistema genera reportes en `financial_reports`:

```php
// Job que corre diariamente
GenerateFinancialReports::dispatch();

// Genera reportes para:
// - Cada profesional (daily, weekly, monthly)
// - Cada establecimiento (daily, weekly, monthly)

// Ejemplo de consulta rápida:
$reporte = FinancialReport::where('entity_type', 'professional')
    ->where('entity_id', $professionalId)
    ->where('period_type', 'monthly')
    ->where('period_start', '2025-12-01')
    ->first();

// Dashboard muestra:
echo "Ganaste: ₡{$reporte->net_profit}";
echo "Margen: {$reporte->profit_margin}%";
```

---

**Fecha:** 26 de diciembre de 2025  
**Versión:** 2.1 (Simplificada + Análisis Financiero)  
**Estado:** ✅ Esquema actualizado, pendiente migrar
