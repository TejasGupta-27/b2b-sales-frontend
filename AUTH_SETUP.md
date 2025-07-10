# B2B Sales Frontend - Authentication Setup

This document describes the authentication system implemented in the B2B Sales Frontend application.

## Overview

The authentication system provides:
- JWT-based authentication with cookie storage
- Role-based access control (Admin, Sales Manager, Sales Agent, Viewer)
- Protected routes with automatic redirection
- User profile management
- Organization-based user management
- Beautiful UI with form validation

## Authentication Flow

### 1. Registration
- Users can register at `/auth/register`
- Requires: email, password, first name, last name, role, organization ID
- Password validation with requirements display
- Automatic login after successful registration

### 2. Login
- Users can login at `/auth/login`
- Requires: email and password
- JWT token stored in cookies with 1-day expiration
- Automatic redirection to `/sales` dashboard

### 3. Protected Routes
- All routes under `/sales/*` are protected
- Unauthenticated users are redirected to `/auth/login`
- Role-based access control can be applied to specific routes

## File Structure

```
lib/
├── auth/
│   ├── api.ts          # API utilities and axios configuration
│   └── context.tsx     # React context for auth state management
├── types/
│   └── auth.ts         # TypeScript types for authentication
components/
├── auth/
│   └── ProtectedRoute.tsx  # Route protection wrapper
├── UserProfile.tsx     # User profile dropdown component
app/
├── auth/
│   ├── login/
│   │   └── page.tsx    # Login page
│   └── register/
│       └── page.tsx    # Registration page
├── sales/
│   └── page.tsx        # Protected sales dashboard
├── layout.tsx          # Root layout with AuthProvider
└── page.tsx            # Homepage with auth-aware navigation
```

## Environment Configuration

Create a `.env.local` file in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Backend API Endpoints Used

The frontend connects to these backend endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/me` - Update user info
- `GET /api/auth/usage` - Get usage statistics

## User Roles

The system supports 4 user roles:

1. **Admin** - Full system access
2. **Sales Manager** - Sales team management
3. **Sales Agent** - Sales operations
4. **Viewer** - Read-only access

## Key Features

### 1. Token Management
- Secure JWT token storage in HTTP-only cookies
- Automatic token refresh and validation
- Token expiration handling with redirect

### 2. Authentication Context
- Global auth state management with React Context
- Loading states and error handling
- Automatic user data synchronization

### 3. Form Validation
- Real-time password strength validation
- Email format validation
- Password confirmation matching
- Organization ID validation

### 4. User Profile Component
- Dropdown with user information
- Account status indicators
- Usage limits display
- Logout functionality

### 5. Protected Routes
- Automatic authentication checking
- Role-based access control
- Loading states during auth verification
- Clean error messages for unauthorized access

## Usage Examples

### Basic Protected Route
```tsx
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function SalesPage() {
  return (
    <ProtectedRoute>
      <div>Your protected content here</div>
    </ProtectedRoute>
  );
}
```

### Role-Based Protection
```tsx
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { UserRole } from '../../lib/types/auth';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <div>Admin-only content</div>
    </ProtectedRoute>
  );
}
```

### Using Auth Context
```tsx
import { useAuth } from '../lib/auth/context';

export default function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      Welcome, {user.first_name}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls
```tsx
import apiClient from '../lib/auth/api';

const fetchData = async () => {
  try {
    const response = await apiClient.get('/api/some-endpoint');
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
  }
};
```

## Security Features

1. **HTTP-Only Cookies** - Tokens stored securely in cookies
2. **Automatic Token Refresh** - Validates tokens on app initialization
3. **Request Interceptors** - Automatically adds auth headers
4. **Response Interceptors** - Handles token expiration
5. **CSRF Protection** - Secure cookie configuration
6. **Password Validation** - Strong password requirements

## Error Handling

The system handles various error scenarios:

- Invalid credentials
- Token expiration
- Network errors
- Server unavailability
- Organization not found
- User limit exceeded

## Styling

The authentication components use:
- Tailwind CSS for styling
- Lucide React for icons
- Gradient backgrounds
- Smooth animations
- Responsive design
- Accessibility features

## Testing the Authentication

1. Start the backend server on port 8000
2. Start the frontend: `npm run dev`
3. Visit `http://localhost:3000`
4. Register a new account or login with existing credentials
5. Navigate to protected routes to verify access control

## Troubleshooting

### Common Issues

1. **401 Unauthorized Errors**
   - Check if backend is running
   - Verify API URL in environment variables
   - Check token expiration

2. **CORS Errors**
   - Ensure backend allows frontend origin
   - Check CORS configuration in backend

3. **Registration Fails**
   - Verify organization ID exists in backend
   - Check organization user limits
   - Ensure email isn't already registered

4. **Login Redirect Issues**
   - Clear browser cookies
   - Check Next.js routing configuration
   - Verify AuthProvider is wrapping the app

### Debug Mode

Enable debug logging by adding to your component:

```tsx
const { user, isLoading, isAuthenticated } = useAuth();
console.log('Auth State:', { user, isLoading, isAuthenticated });
```

## Contributing

When adding new authentication features:

1. Update TypeScript types in `lib/types/auth.ts`
2. Add API functions to `lib/auth/api.ts`  
3. Update auth context if needed
4. Add proper error handling
5. Include loading states
6. Test with different user roles
7. Update this documentation 