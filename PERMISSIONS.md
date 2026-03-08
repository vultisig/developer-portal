# Permissions & Role-Based Access Control

This document describes the two authorization systems used by the developer portal and how the frontend enforces them.

## 1. Plugin-Level Roles (per-plugin)

Stored in the `plugin_owners` table. Retrieved via `GET /plugins/:id/my-role` which returns `{ role, canEdit }`.

**Hierarchy:** `admin > staff > editor > viewer`

### Frontend Hook

```ts
import { usePluginRole } from "@/hooks/usePluginRole";

const { role, canEdit, isAdmin, isStaff, loading } = usePluginRole(pluginId);
```

### Permissions by Role

| Feature | admin | staff | editor | viewer |
|---------|-------|-------|--------|--------|
| View plugin details | yes | yes | yes | yes |
| Edit title / description | yes | yes | yes | no |
| Edit `serverEndpoint` | yes | yes | no | no |
| Edit `payoutAddress` | yes | no | no | no |
| View earnings | yes | yes | yes | no |
| Manage team members | yes | no | no | no |
| Invite members | yes | no | no | no |
| Remove members | yes (not admin/staff) | no | no | no |
| View/manage API keys | yes | no | no | no |
| Kill switch | yes | yes | no | no |
| Upload/manage images | yes | yes | yes | no |
| View hidden images | yes | yes | yes | no |
| View deleted images | yes | no | no | no |

### Page-Level Enforcement

- **PluginUpdate**: Viewers are redirected. Editors see disabled `serverEndpoint` and `payoutAddress` fields. Info banner shown for editors.
- **PluginMembers**: Non-admins are redirected. Only admins see invite button and delete actions.
- **PluginEarnings**: Viewers are redirected. "Update Plugin" button hidden for non-editors.

## 2. System-Wide Listing Approver

Stored in the `portal_approvers` table. This is NOT a plugin role — it is a separate system-wide permission for managing plugin proposals.

### Frontend Hook

```ts
import { useIsApprover } from "@/hooks/useIsApprover";

const { isApprover, loading } = useIsApprover();
```

Detection: Attempts `GET /admin/plugin-proposals`. If it returns 403, the user is not an approver.

### Approver-Only Features

| Feature | Approver | Non-Approver |
|---------|----------|--------------|
| "Review" nav link | visible | hidden |
| `/admin/proposals` page | accessible | redirected |
| Approve proposals | yes | no |
| Publish proposals | yes | no |

### Approver-Only Endpoints

- `GET /admin/plugin-proposals`
- `GET /admin/plugin-proposals/:id`
- `POST /admin/plugin-proposals/:id/approve`
- `POST /admin/plugin-proposals/:id/publish`

## 3. Endpoint Permissions Matrix (Full)

### Public (no auth)
- `GET /healthz`
- `POST /auth`
- `GET /plugins/:id/pricings`
- `GET /invite/validate`

### Any Authenticated User
- `GET /plugins` — user's own plugins
- `GET /plugins/:id` — must be team member
- `GET /plugins/:id/my-role`
- `POST /plugins/:id/team/accept`
- `GET /earnings`
- `GET /earnings/summary`
- `GET /plugin-proposals/validate/:id`
- `POST /plugin-proposals`
- `GET /plugin-proposals` — own only
- `GET /plugin-proposals/:id` — own only

### Plugin Role: admin, editor, staff (NOT viewer)
- `POST /plugins/:id/images/upload-url`
- `POST /plugins/:id/images/:imageId/confirm`
- `PATCH /plugins/:id/images/:imageId`
- `DELETE /plugins/:id/images/:imageId`
- `PUT /plugins/:id/images/order`

### Plugin Role: admin, editor only
- `PUT /plugins/:id` — with field restrictions (editor cannot change `serverEndpoint`; only admin can change `payoutAddress`)

### Plugin Role: admin, staff only
- `GET /plugins/:id/kill-switch`
- `PUT /plugins/:id/kill-switch`

### Plugin Role: admin only
- `GET /plugins/:id/api-keys`
- `POST /plugins/:id/api-keys`
- `PUT /plugins/:id/api-keys/:keyId`
- `DELETE /plugins/:id/api-keys/:keyId`
- `GET /plugins/:id/team`
- `POST /plugins/:id/team/invite`
- `DELETE /plugins/:id/team/:publicKey` (cannot remove admin/staff members)

### Listing Approver only
- `GET /admin/plugin-proposals`
- `GET /admin/plugin-proposals/:id`
- `POST /admin/plugin-proposals/:id/approve`
- `POST /admin/plugin-proposals/:id/publish`
