# GitHub Copilot Instructions for StyleCore

## Project Context
- **Framework**: Laravel 12.0 (PHP 8.2+)
- **Frontend**: Inertia.js + React + TypeScript + Vite
- **UI Library**: Radix UI (Headless), Tailwind CSS
- **Database**: Single Database Multi-tenancy (MySQL)
- **Testing**: Pest PHP

## Architecture & Patterns

### Multi-Tenancy (Single Database)
- **Strategy**: Single database where tenants are identified by `tenant_id`.
- **Models**: All tenant-specific models **MUST** use the `App\Traits\BelongsToTenant` trait.
  - This trait applies a global scope to filter by the current tenant.
  - It automatically assigns `tenant_id` when creating new records.
- **Identification**: Tenants are identified via domain/subdomain (configured in `routes/tenant.php`) or path (check `routes/web.php` for custom implementations).
- **Reference**: See `doc/MULTI_TENANT_SETUP.md` and `app/Traits/BelongsToTenant.php`.

### API & Controllers
- **Status Updates**: For changing the status of a resource (e.g., appointments, orders), prefer dedicated `PATCH` endpoints (e.g., `PATCH /resource/{id}/status`) over full `PUT` updates.
  - Create a specific method in the controller (e.g., `updateStatus`) that validates only the status field.
  - This avoids validation errors when other required fields are missing from the request payload.

### Frontend (Inertia + React)
- **Components**: Use Functional Components with Hooks.
- **UI**: Use Radix UI primitives (`@radix-ui/*`) styled with Tailwind CSS.
- **Visual Style & UI Patterns (Premium Aesthetic)**:
  - **Layout & Spacing**: 
    - **Main Containers**: ALWAYS apply `p-4` padding to the main content container of every page to ensure proper breathing room. Content should never touch the screen edges.
    - **Grid Systems**: Use responsive grids (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) for cards and dashboard widgets.
  - **Headers**: Use text gradients for main titles: `bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent`.
  - **Cards & Containers**: Implement "glass" or gradient effects: `bg-gradient-to-br from-card to-card/50`. Use deep shadows on hover: `hover:shadow-2xl hover:border-primary/50`.
  - **Status Indicators**: Prefer `GlowingBadge` (from `@/components/ui/glowing-badge`) over standard badges for statuses (e.g., pending, confirmed, error).
  - **Buttons**: 
    - Add depth with shadows: `shadow-lg hover:shadow-xl transition-all`.
    - **Action Buttons**: Prefer `variant="outline"` for secondary/destructive actions to avoid solid blocks of color. Use colored borders/text (e.g., `border-red-500/50 text-red-600`) with subtle background hovers.
  - **Navigation**:
    - **Mobile Menu**: Render navigation items as a **Grid (3 columns)** with large icons when in mobile view (Sidebar).
    - **User Menu**: Place user settings/profile in the **Top Right** of the header (`AppSidebarHeader`), not in the sidebar footer.
  - **Data Visualization**: Avoid solid heavy backgrounds for indicators. Use subtle gradients, outlines, or light backgrounds with colored text to maintain the "glass" aesthetic.
  - **Animations**: Use `framer-motion` for:
    - Staggered entry animations for lists/grids.
    - Hover effects on cards (`whileHover={{ y: -5 }}`).
    - Interactive elements.
- **State**: Use Inertia's `usePage` for shared data (auth, flash messages).
- **Routing**: Use `Link` from `@inertiajs/react` for internal navigation.
- **Forms**: Use `useForm` from `@inertiajs/react` for form handling and validation.
- **Dialogs & Confirmations**: 
  - NEVER use `window.confirm` or `alert`.
  - Use `AlertDialog` (from `@/components/ui/alert-dialog`) for destructive actions or critical confirmations.
  - Use `Dialog` or `Sheet` for forms and information.
  - Ensure consistent styling for destructive actions (red/destructive variant).

### Mobile & Touch Interaction (App-Wide)
- **Design Philosophy**: Mobile-first. Ensure all views are fully functional and aesthetically pleasing on small screens (< 768px).
- **Navigation & Layout**:
  - Use `Sheet` (Bottom Sheet/Drawer) for detailed views, filters, or complex actions on mobile instead of modals or inline expansion.
  - Stack columns vertically on mobile (`flex-col`).
  - Hide non-essential columns in tables or switch to Card views for data lists.
- **Touch Targets**: Ensure all interactive elements (buttons, inputs, icons) have a minimum touch target of 44x44px.
- **Complex Components (e.g., Calendar)**:
  - Simplify views: Show indicators/counts instead of full details in dense grids.
  - Use touch interactions (tap to view details) rather than hover.
  - Use Dropdowns for view switchers or actions to save screen real estate.
- **Libraries**: Use `framer-motion` for smooth transitions and `@radix-ui` primitives (Dialog, Sheet, Dropdown) for accessible overlays.
- **Swipe Gestures**: Implement "Swipe to Action" for list items using `framer-motion`.
  - **Visual Feedback**: Change background color/opacity based on drag direction (e.g., Green/Right for Accept, Red/Left for Reject).
  - **Safety**: **ALWAYS** trigger an `AlertDialog` confirmation before executing the action (especially for destructive or irreversible actions).
  - **Thresholds**: Use appropriate drag thresholds (e.g., 80px) to prevent accidental triggers.

### Authentication & Roles
- **Auth**: Handled by Laravel Fortify.
- **Roles**: Role-based redirection is implemented in `routes/web.php` (e.g., `customer`, `staff`, `owner`, `super_admin`).
- **Middleware**: Check `app/Http/Middleware` for role-specific access control.

## Development Workflow

### Critical Commands
- **Start Dev Server**: `npm run dev` (Vite) + `php artisan serve`
- **Run Tests**: `php artisan test` or `./vendor/bin/pest`
- **Lint/Format**: `npm run lint` (ESLint) and `npm run format` (Prettier)
- **Build**: `npm run build`

### Testing (Pest)
- **Location**: `tests/Feature` and `tests/Unit`.
- **Style**: Use the expectation API (`expect($value)->toBe(...)`).
- **Database**: Tests use `RefreshDatabase` trait (configured in `tests/Pest.php`).

## Coding Standards
- **PHP**: Follow PSR-12. Use strict types (`declare(strict_types=1);`).
- **TypeScript**: Use strict mode. Define interfaces for all props and API responses.
- **Naming**:
  - PHP Classes: PascalCase
  - React Components: PascalCase (`.tsx`)
  - Database Tables: snake_case (plural)

## Key Files & Directories
- `app/Traits/BelongsToTenant.php`: Core multi-tenancy logic.
- `routes/tenant.php`: Tenant-specific routes.
- `routes/web.php`: Central application and auth routes.
- `resources/js/app.tsx`: Frontend entry point.
- `config/tenancy.php`: Tenancy configuration.
