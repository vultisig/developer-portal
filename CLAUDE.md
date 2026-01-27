# CLAUDE.md - Vultisig Developer Portal

This file contains key information about the codebase for AI assistants.

## Project Overview

The Vultisig Developer Portal is a React-based web application for managing plugins in the Vultisig ecosystem. It allows developers to register, configure, and manage plugins that integrate with the Vultisig wallet system.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: styled-components with a custom theme system
- **UI Components**: Ant Design (antd) v6 for modals, inputs, date pickers, etc.
- **State Management**: React Context (CoreProvider) + React Query for server state
- **Routing**: react-router-dom v7
- **HTTP Client**: Axios with interceptors for JWT authentication
- **Crypto**: ethers.js v6 for EIP-712 signing

## Directory Structure

```
src/
├── api/           # API client and endpoint functions
├── components/    # Reusable UI components
├── context/       # React Context definitions
├── hooks/         # Custom React hooks
├── icons/         # SVG icon components
├── layouts/       # Page layout components
├── pages/         # Route page components
├── providers/     # Context providers
├── storage/       # Local storage utilities
├── styles/        # Global SCSS styles
├── toolkits/      # Core UI primitives (Button, Stack, Spin)
└── utils/         # Utility functions and types
```

## Key Design Patterns

### 1. Stack-Based Layout System

All layouts use `Stack`, `HStack`, and `VStack` components from `@/toolkits/Stack`:

```tsx
import { HStack, VStack, Stack } from "@/toolkits/Stack";

// Vertical stack with gap
<VStack $style={{ gap: "16px", padding: "24px" }}>
  <Stack>Title</Stack>
  <Stack>Content</Stack>
</VStack>

// Horizontal stack with alignment
<HStack $style={{ justifyContent: "space-between", alignItems: "center" }}>
  <Stack>Left</Stack>
  <Stack>Right</Stack>
</HStack>
```

**Key points:**
- Use `$style` prop for inline CSS (not `style`)
- Supports `$hover`, `$before`, `$after` for pseudo-elements
- Supports `$media` for responsive breakpoints

### 2. Theme System

Colors are accessed via `useTheme()` from styled-components:

```tsx
import { useTheme } from "styled-components";

const colors = useTheme();

// Use .toHex() to get color strings
<Stack $style={{
  backgroundColor: colors.bgSecondary.toHex(),
  color: colors.textPrimary.toHex(),
  border: `1px solid ${colors.borderLight.toHex()}`
}}>
```

**Available theme colors:**
- Backgrounds: `bgPrimary`, `bgSecondary`, `bgTertiary`, `bgAlert`, `bgError`, `bgSuccess`, `bgNeutral`
- Text: `textPrimary`, `textSecondary`, `textTertiary`
- Borders: `borderLight`, `borderNormal`
- Buttons: `buttonPrimary`, `buttonPrimaryHover`, `buttonSecondary`, `buttonSecondaryHover`, `buttonText`, `buttonDisabled`, `buttonDisabledText`
- Semantic: `error`, `warning`, `success`, `info`
- Neutrals: `neutral50`, `neutral900`, etc.

**Important:** There is NO `colors.primary` - use `colors.buttonPrimary` for primary actions.

### 3. Button Component

```tsx
import { Button } from "@/toolkits/Button";

// Primary button (default)
<Button onClick={handleClick}>Save</Button>

// Secondary button
<Button kind="secondary" onClick={handleCancel}>Cancel</Button>

// Loading state
<Button loading={isLoading}>Submitting</Button>

// Disabled state
<Button disabled={!canEdit}>Save</Button>

// Available kinds: "primary" | "secondary" | "danger" | "success" | "warning" | "info"
// Also supports: ghost, href (for links), icon
```

### 4. Card/Section Pattern

Sections use consistent styling:

```tsx
<VStack
  $style={{
    backgroundColor: colors.bgSecondary.toHex(),
    borderRadius: "12px",
    border: `1px solid ${colors.borderLight.toHex()}`,
    padding: "24px",
    gap: "16px",
  }}
>
  <Stack $style={{ fontSize: "16px", fontWeight: "600" }}>
    Section Title
  </Stack>
  {/* Content */}
</VStack>
```

### 5. Role Badge Pattern

For displaying user roles:

```tsx
const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "admin": return colors.buttonPrimary.toHex();
    case "editor": return colors.info.toHex();
    case "viewer": return colors.success.toHex();
    default: return colors.textTertiary.toHex();
  }
};

<Stack
  $style={{
    backgroundColor: getRoleBadgeColor(role),
    color: colors.neutral50.toHex(),
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    textTransform: "capitalize",
  }}
>
  {role}
</Stack>
```

### 6. Status Badge Pattern

For showing status (active/inactive/expired):

```tsx
<Stack
  $style={{
    backgroundColor: expired
      ? colors.textTertiary.toHex()
      : status === 1
      ? colors.success.toHex()
      : colors.error.toHex(),
    color: colors.neutral50.toHex(),
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    minWidth: "70px",
    textAlign: "center",
  }}
>
  {expired ? "Expired" : status === 1 ? "Active" : "Inactive"}
</Stack>
```

## Authentication Flow

1. User clicks "Connect Wallet"
2. Vultisig browser extension is invoked via `connectToExtension()`
3. User signs a message with their wallet (`personalSign`)
4. Frontend sends signature + public key to `/auth` endpoint
5. Backend returns JWT token
6. Token stored in localStorage, attached to all API requests via Axios interceptor

## Role-Based Access Control

Roles hierarchy: `admin` > `staff` > `editor` > `viewer`

**Permissions:**
- **Admin**: Full access - can edit all fields, manage API keys, manage team
- **Staff**: Internal Vultisig staff (not visible to admins)
- **Editor**: Can edit title/description, cannot edit server_endpoint or manage API keys
- **Viewer**: Read-only access, cannot edit anything

**UI patterns for restrictions:**
- Show info banner explaining restrictions
- Disable form fields with `disabled={!canEdit}` or `disabled={userRole === "editor"}`
- Hide sections entirely with `{isAdmin && (<Section />)}`

## EIP-712 Signing

Plugin updates require EIP-712 typed data signatures:

```tsx
import { createPluginUpdateTypedData, computeFieldUpdates, generateNonce } from "@/utils/eip712";
import { signTypedData } from "@/utils/extension";

const updateMessage = {
  pluginId: id,
  signer: address,
  nonce: generateNonce(),
  timestamp: Math.floor(Date.now() / 1000),
  updates: computeFieldUpdates(original, updated),
};

const typedData = createPluginUpdateTypedData(updateMessage);
const signature = await signTypedData(address, typedData);
```

## API Patterns

API functions in `@/api/plugins.ts`:
- Transform snake_case backend responses to camelCase frontend types
- Use async/await with try/catch
- Throw errors that are caught and displayed via `message.error()`

```tsx
// Example API call with error handling
try {
  const result = await apiFunction(params);
  message.success("Success!");
} catch (error) {
  if (error instanceof Error) {
    message.error(error.message);
  } else {
    message.error("An error occurred");
  }
}
```

## Modal Patterns

Using Ant Design modals:

```tsx
import { Modal, message } from "antd";

// Confirmation dialog
Modal.confirm({
  title: "Delete Item?",
  content: "This action cannot be undone.",
  okText: "Delete",
  okType: "danger",
  cancelText: "Cancel",
  onOk: () => handleDelete(),
});

// Custom modal with state
const [showModal, setShowModal] = useState(false);

<Modal
  title="Modal Title"
  open={showModal}
  onCancel={() => setShowModal(false)}
  footer={[
    <Button key="cancel" kind="secondary" onClick={() => setShowModal(false)}>
      Cancel
    </Button>,
    <Button key="submit" onClick={handleSubmit} loading={isLoading}>
      Submit
    </Button>,
  ]}
>
  {/* Modal content */}
</Modal>
```

## Common Imports

```tsx
// Styling
import { useTheme } from "styled-components";
import { HStack, VStack, Stack } from "@/toolkits/Stack";
import { Button } from "@/toolkits/Button";
import { Spin } from "@/toolkits/Spin";

// Routing
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { routeTree } from "@/utils/routes";

// State & Effects
import { useState, useEffect } from "react";
import { useCore } from "@/hooks/useCore";

// UI Components (Ant Design)
import { Input, Modal, Switch, DatePicker, message } from "antd";

// Utils
import { formatDate, formatCurrency } from "@/utils/functions";
```

## Environment Variables

- `VITE_API_BASE_URL` - Backend API URL (default: `http://localhost:8080`)

## Build Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run typecheck  # TypeScript check
npm run lint       # ESLint
npm run lint:fix   # ESLint with auto-fix
```
