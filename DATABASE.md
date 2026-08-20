# DATABASE SCHEMA (DigiiState)

## Authoritative Schemas
Managed in `/Users/lydiai/Desktop/Lori Home/ventures/DigiiState/database/`

1. **[SUPABASE_SCHEMA.sql](../database/SUPABASE_SCHEMA.sql)**: Core system tables.
2. **[ROBUST_EMPIRE_SCHEMA.sql](../database/ROBUST_EMPIRE_SCHEMA.sql)**: Portfolio and scaling definitions.
3. **[MIGRATION_PHASE_2_5.sql](../database/MIGRATION_PHASE_2_5.sql)**: Relational mapping.

## State Management
- `src/lib/db.ts`: Current JS-based data layer. To be refactored into a Supabase Client wrapper.
