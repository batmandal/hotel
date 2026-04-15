# Role-Based Access Control (RBAC) Specification

# Project: Integrated Hotel Management System (HMS)

## 1. User Roles Definition

- **GUEST:** Public user, authenticated. Can book and manage own data.
- **STAFF:** Hotel receptionist/operator. Manages daily operations.
- **ADMIN:** System owner. Full access to finances, staff, and configuration.

## 2. Functional Requirements Matrix

| Module         | Action                                  |  Guest   | Staff | Admin |
| :------------- | :-------------------------------------- | :------: | :---: | :---: |
| **Auth**       | Sign Up / Login / Reset Password        |    ✅    |  ✅   |  ✅   |
|                | Manage Own Profile                      |    ✅    |  ✅   |  ✅   |
| **Search**     | Filter Rooms & View Details             |    ✅    |  ✅   |  ✅   |
| **Booking**    | Create New Booking (Own)                |    ✅    |  ✅   |  ✅   |
|                | View Booking History                    | Own Only |  All  |  All  |
|                | Request/Perform Cancellation            |    ✅    |  ✅   |  ✅   |
|                | Change Booking Status (e.g., Confirmed) |    ❌    |  ✅   |  ✅   |
| **Payment**    | Pay via QPay / View Invoice             |    ✅    |  ✅   |  ✅   |
|                | View Payment Audit Logs                 |    ❌    |  ✅   |  ✅   |
| **Front Desk** | Check-in / Check-out Guests             |    ❌    |  ✅   |  ✅   |
|                | Toggle Room Cleaning Status             |    ❌    |  ✅   |  ✅   |
| **Admin**      | CRUD Rooms & Pricing                    |    ❌    |  ❌   |  ✅   |
|                | Manage Staff Accounts                   |    ❌    |  ❌   |  ✅   |
| **Reports**    | Daily Summary Dashboard                 |    ❌    |  ✅   |  ✅   |
|                | Financial Reports (Excel/PDF)           |    ❌    |  ❌   |  ✅   |

## 3. Implementation Rules for AI (Cursor/Antigravity)

- **Middleware:** Protect `/admin/**` routes for ADMIN only. Protect `/dashboard/**` for STAFF & ADMIN.
- **API Security:** Every API request must validate the user's role from the session/token. Do not trust client-side role checks only.
- **UI Logic:** - Hide "Delete" or "Edit Price" buttons if `user.role !== 'ADMIN'`.
  - Guests should never see the "Staff Dashboard" sidebar items.
- **Data Access:** - Queries for `bookings` must include `where: { userId: currentUserId }` for GUEST role.
  - STAFF and ADMIN queries should not have this restriction.

## 4. Database Schema Hint (Prisma/SQL)

- `User` table must have a `role` field: `enum Role { GUEST, STAFF, ADMIN }`.
- `Booking` table must link to `User` via `userId`.
