# Manual Test Plan: DPPS End-to-End Verification

Follow these steps to verify that all core functionalities of the Duplicate Payment Prevention System (DPPS) are working correctly.

## 1. Dashboard & KPI Verification
- **Navigate to**: `http://localhost:3000/`
- **Check**: 
    - [ ] Do the metrics (Total Prevented Value, Open Cases, etc.) load?
    - [ ] Do the charts (Prevented Value trend, Vendor Risk) render correctly?
    - [ ] Verify there are no "Hydration Mismatch" errors in the browser console.

## 2. Payment Gate (Proposal Analysis)
- **Navigate to**: `http://localhost:3000/gate`
- **Actions**:
    - [ ] **Upload**: Drag and drop `public/sample_proposal.csv` OR cycle through the provided demo files.
    - [ ] **Analysis**: Wait for the "AI Analysis" progress bar to finish.
    - [ ] **Detection**: Verify that high-risk duplicates are detected (e.g., INV-2024-001).
- **Functionality - Hold Payment**:
    - [ ] Click the **"Hold Payment"** button on a detected duplicate.
    - [ ] **Expected Result**: A success toast appears saying "Payment Held".
    - [ ] **Technical Check**: This should now succeed without database constraint errors.

## 3. Recovery Workflow
- **Navigate to**: `http://localhost:3000/recovery`
- **Check**:
    - [ ] Does the page load without crashing? (Fixed the `useEffect` import issue).
    - [ ] Does the item you just "Held" in the Payment Gate appear in the list?
    - [ ] Verify the **"Status"** shows as "Initiated".
- **Actions**:
    - [ ] Click the **"Mail"** icon to simulate a recovery email.
    - [ ] **Expected Result**: Success toast appears.

## 4. Pre-Pay Cockpit (Open Cases)
- **Navigate to**: `http://localhost:3000/pre-pay`
- **Check**:
    - [ ] Does the page load without a "vendorName is undefined" crash?
    - [ ] Do the **Risk Score** filters (Exact Match, Fuzzy, etc.) update the table?
- **Actions**:
    - [ ] Click on a **Vendor Name** to open the "Vendor Intelligence" hover card.
    - [ ] Click on the **"AI Forensics"** badge to open the detailed analysis slide-out.
    - [ ] Select multiple rows and test the **Bulk Actions** (Flag Duplicate / Dismiss) at the top.

## 5. System Settings & DB
- **Navigate to**: `http://localhost:3000/settings`
- **Action**:
    - [ ] Click **"Refresh Demo Data"**.
    - [ ] **Expected Result**: System clears existing cases and re-seeds with fresh realistic data.
    - [ ] Verify that navigating back to the Dashboard shows updated numbers.

---
**Note**: If any step fails, please check the terminal running `npm run dev` for server-side errors or the browser console (F12) for client-side issues.
