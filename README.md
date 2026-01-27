# Vultisig Developer Portal

A web application for developers to manage plugins in the Vultisig ecosystem.

## Features

- **Plugin Management**: Register, view, and edit plugins
- **Team Collaboration**: Invite team members with role-based access control
- **API Key Management**: Create and manage API keys for plugin authentication
- **Earnings Dashboard**: Track plugin earnings and transaction history
- **Secure Authentication**: Vultisig wallet integration with EIP-712 signatures

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Vultisig browser extension (for authentication)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Language | TypeScript |
| Build | Vite 7 |
| Styling | styled-components |
| UI Library | Ant Design v6 |
| State | React Context + React Query |
| Routing | react-router-dom v7 |
| HTTP | Axios |
| Crypto | ethers.js v6 |

### Project Structure

```
src/
├── api/           # API client and endpoint functions
├── components/    # Reusable UI components
├── context/       # React Context definitions
├── hooks/         # Custom React hooks
├── icons/         # SVG icon components
├── layouts/       # Page layout components
├── pages/         # Route page components
│   ├── AcceptInvite.tsx
│   ├── Earnings.tsx
│   ├── NewPlugin.tsx
│   ├── PluginEdit.tsx
│   └── Plugins.tsx
├── providers/     # Context providers
├── storage/       # Local storage utilities
├── styles/        # Global SCSS styles
├── toolkits/      # Core UI primitives
└── utils/         # Utility functions and types
```

## Authentication

The portal uses Vultisig wallet authentication:

1. Connect your Vultisig wallet via the browser extension
2. Sign a message to authenticate
3. Receive a JWT token for API access
4. Token is automatically included in all API requests

## Role-Based Access Control

### Roles

| Role | Description |
|------|-------------|
| **Admin** | Full access to all plugin features |
| **Staff** | Internal Vultisig staff (hidden from regular admins) |
| **Editor** | Can edit plugin title and description |
| **Viewer** | Read-only access |

### Permissions Matrix

| Action | Admin | Editor | Viewer |
|--------|-------|--------|--------|
| View plugin details | Yes | Yes | Yes |
| Edit title/description | Yes | Yes | No |
| Edit server endpoint | Yes | No | No |
| Manage API keys | Yes | No | No |
| Manage team members | Yes | No | No |
| View earnings | Yes | Yes | Yes |

## Team Management

Admins can invite team members via magic links:

1. Navigate to a plugin's edit page
2. Scroll to "Team Members" section
3. Click "Invite Member"
4. Select a role (Editor or Viewer)
5. Share the generated link (valid for 8 hours, single use)

Invited users:
1. Open the invite link
2. Connect their Vultisig wallet
3. Accept the invitation

## API Keys

Admins can create API keys for plugin authentication:

1. Navigate to a plugin's edit page
2. Find the "API Keys" section
3. Click "Create New Key"
4. Optionally set an expiry date
5. Copy the key immediately (shown only once)

API keys can be:
- Enabled/disabled via toggle
- Deleted (immediately expired)

## Plugin Updates

All plugin metadata changes require EIP-712 signatures:

1. Make changes to plugin fields
2. Click "Save Changes"
3. Review the changes in the signing modal
4. Sign with your Vultisig wallet
5. Changes are submitted to the backend

This ensures an auditable trail of who made what changes.

## Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run typecheck  # Run TypeScript type checking
npm run lint       # Run ESLint
npm run lint:fix   # Run ESLint with auto-fix
```

### Code Style

- TypeScript strict mode
- ESLint with React hooks plugin
- Automatic import sorting

### UI Guidelines

- Use `Stack`, `HStack`, `VStack` for layouts
- Use `$style` prop for inline styles (not `style`)
- Access theme colors via `useTheme()` hook
- Use `.toHex()` method on color tokens
- Use Ant Design components for forms and modals
- Use custom `Button` component for actions

## API Integration

The portal communicates with the Vultisig Verifier backend:

- **Base URL**: Configured via `VITE_API_BASE_URL`
- **Authentication**: JWT Bearer token in Authorization header
- **Content Type**: application/json

### Key Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /auth` | Authenticate with wallet signature |
| `GET /plugins` | List user's plugins |
| `GET /plugins/:id` | Get plugin details |
| `PUT /plugins/:id` | Update plugin (requires signature) |
| `GET /plugins/:id/my-role` | Get user's role for plugin |
| `GET /plugins/:id/team` | List team members (admin only) |
| `POST /plugins/:id/team/invite` | Create invite link (admin only) |
| `POST /plugins/:id/team/accept` | Accept team invite |
| `GET /plugins/:id/api-keys` | List API keys (admin only) |
| `POST /plugins/:id/api-keys` | Create API key (admin only) |
| `GET /earnings` | List earnings transactions |

## License

Proprietary - Vultisig
