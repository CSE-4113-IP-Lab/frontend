# Fee Management System

This module implements a comprehensive fee management system with role-based access control.

## Features

### For Students:

- View payment history
- Check unpaid fees
- Make payments online
- View payment receipts
- Transaction confirmations

### For Admins:

- Create new fees
- Edit existing fees
- Delete fees
- View all payments across the system
- Update payment statuses
- Export payment data

## Components

### Main Components:

- `Fee.tsx` - Main fee management dashboard with role-based content
- `CreateFee.tsx` - Admin-only component to create new fees
- `EditFee.tsx` - Admin-only component to edit existing fees
- `UnpaidFees.tsx` - Student view of outstanding fees
- `MakePayment.tsx` - Student payment form
- `PaymentSuccess.tsx` - Payment confirmation page
- `PaymentDetails.tsx` - Detailed view of payment transactions
- `AllPayments.tsx` - Admin view of all system payments

### Service:

- `paymentService.ts` - API service layer for all payment-related operations

## Role-Based Access

The system implements role-based access control similar to the Assignments module:

### Student Access:

- Can view their own payment history
- Can see unpaid fees
- Can make payments
- Can view payment receipts

### Admin Access:

- Can view all payments in the system
- Can create, edit, and delete fees
- Can update payment statuses
- Can export payment data

### Authentication:

All components check `localStorage.getItem("role")` to determine user permissions and redirect unauthorized users.

## API Integration

The system integrates with the following API endpoints:

1. `GET /api/v1/payments` - Get all payments (admin only)
2. `POST /api/v1/payments` - Create new payment
3. `GET /api/v1/payments/me` - Get current user's payments
4. `GET /api/v1/payments/fees` - Get all fees
5. `POST /api/v1/payments/fees` - Create new fee (admin only)
6. `GET /api/v1/payments/{payment_id}` - Get payment by ID
7. `PUT /api/v1/payments/{payment_id}` - Update payment status
8. `GET /api/v1/payments/fees/{fee_id}` - Get fee by ID
9. `PUT /api/v1/payments/fees/{fee_id}` - Update fee
10. `DELETE /api/v1/payments/fees/{fee_id}` - Delete fee
11. `GET /api/v1/payments/fees/me/unpaid` - Get user's unpaid fees
12. `GET /api/v1/payments/fees/student/{student_id}/unpaid` - Get student's unpaid fees

## Usage

To use these components in your router:

```tsx
import Fee from './pages/Fee/Fee';
import CreateFee from './pages/Fee/CreateFee';
import EditFee from './pages/Fee/EditFee';
import UnpaidFees from './pages/Fee/UnpaidFees';
import MakePayment from './pages/Fee/MakePayment';
import PaymentSuccess from './pages/Fee/PaymentSuccess';
import PaymentDetails from './pages/Fee/PaymentDetails';
import AllPayments from './pages/Fee/AllPayments';

// Add routes
<Route path="/fee" element={<Fee />} />
<Route path="/fee/create" element={<CreateFee />} />
<Route path="/fee/edit/:feeId" element={<EditFee />} />
<Route path="/fee/unpaid" element={<UnpaidFees />} />
<Route path="/fee/payment/new" element={<MakePayment />} />
<Route path="/fee/payment/success" element={<PaymentSuccess />} />
<Route path="/fee/payment/:paymentId" element={<PaymentDetails />} />
<Route path="/fee/payments" element={<AllPayments />} />
```

## Security Features

- JWT token authentication via Authorization header
- Role-based component access
- Input validation and sanitization
- Secure payment processing simulation
- CSRF protection via ngrok-skip-browser-warning header

## Dependencies

- React Router for navigation
- Axios for API calls (via apiClient)
- Lucide React for icons
- Tailwind CSS for styling (via existing component system)

## Error Handling

All components include comprehensive error handling:

- Network error recovery
- Invalid data handling
- Unauthorized access redirects
- User-friendly error messages
