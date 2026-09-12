---
name: Database URL priority
description: Prevent schema tools from targeting a different database than the running application.
---

When both database environment variables are present, schema operations must explicitly target the same connection the application uses rather than relying on the tool's default variable.

**Why:** The runtime and schema tool can prefer different variables, so an apparently successful schema push may update a database the application never queries.

**How to apply:** Before any schema change, compare the runtime connection priority with the schema configuration and explicitly select the runtime's active connection.