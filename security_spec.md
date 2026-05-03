# Security Specification - Contact Form submissions

This specification outlines the security invariants and validation rules for the `contacts` collection in Firestore.

## Data Invariants
1. A contact submission must have a valid name, email, subject, and message.
2. The `createdAt` field must be a server-side timestamp.
3. Submissions are publicly writeable (for the contact form) but not readable or deletable by the public.
4. Document IDs must be structurally valid.

## The "Dirty Dozen" Payloads (Deny Cases)
1. **Empty Payload**: `{}`
2. **Missing Field**: `{"name": "John", "email": "j@test.com", "subject": "Other", "message": "Short"}` (Missing `createdAt`)
3. **Invalid Type**: `{"name": 123, ...}`
4. **Invalid Email**: `{"email": "not-an-email", ...}`
5. **Too Short Message**: `{"message": "hi", ...}`
6. **Client-side Timestamp**: `{"createdAt": "2023-01-01T00:00:00Z", ...}`
7. **Extra Field (Shadow field)**: `{"isAdmin": true, ...}`
8. **Invalid Subject**: `{"subject": "Hack", ...}`
9. **Too Long Name**: `{"name": "A".repeat(101), ...}`
10. **Zero Size Message**: `{"message": "", ...}`
11. **Malicious ID**: Attempting to write to `/contacts/../admins/root` (Handled by path matching)
12. **Update Attempt**: Any update to an existing submission.

## Test Runner Plan
Using `firestore.rules.test.ts` to verify these payloads are rejected.
