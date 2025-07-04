# Personal Finance Tracker

A simple web application for tracking personal finances built with Next.js, React, shadcn/ui, Recharts, and MongoDB.

## Features (Stage 1)

- Add/Edit/Delete transactions with amount, date, and description
- Transaction list view with sorting by date
- Monthly expenses bar chart visualization
- Form validation with error handling
- Responsive design
- Error states and loading indicators

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB
- **Form Handling**: React Hook Form + Zod validation
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Shevilll/personal-finance-tracker
   cd personal-finance-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017
   ```

# or for MongoDB Atlas:

# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/

NEXT_PUBLIC_BASE_URL=http://localhost:3000

````

4. Run the development server:
   ```bash
   npm run dev
````

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Transactions Collection

```javascript
{
\_id: ObjectId,
amount: Number, // Negative for expenses, positive for income
date: Date,
description: String,
createdAt: Date,
updatedAt: Date
}
```

## API Endpoints

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions` - Update existing transaction
- `DELETE /api/transactions` - Delete transaction
- `GET /api/transactions/monthly` - Get monthly expense data for chart

## Project Structure

```
├── app/
│ ├── api/transactions/ # API routes
│ ├── layout.tsx # Root layout
│ └── page.tsx # Home page
├── components/
│ ├── ui/ # shadcn/ui components
│ ├── transaction-form.tsx # Add/Edit transaction form
│ ├── transaction-list.tsx # Transaction list display
│ ├── monthly-chart.tsx # Monthly expenses chart
│ ├── edit-transaction-dialog.tsx
│ └── delete-transaction-dialog.tsx
└── lib/
└── utils.ts # Utility functions
```

## Features in Detail

### Transaction Management

- Add new transactions with amount, date, and description
- Edit existing transactions through modal dialog
- Delete transactions with confirmation dialog
- Form validation with real-time error messages

### Data Visualization

- Monthly expenses bar chart showing last 6 months
- Responsive chart that adapts to screen size
- Tooltip showing exact amounts

### User Experience

- Responsive design works on mobile and desktop
- Loading states for all async operations
- Error handling with user-friendly messages
- Toast notifications for user feedback

## Future Enhancements (Stage 2 & 3)

- Transaction categories
- Category-wise pie charts
- Budget setting and tracking
- Spending insights and analytics
- Income vs expense comparison

## Deployment

The application can be deployed to Vercel, Netlify, or any platform supporting Next.js.

For Vercel deployment:

1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Contributing

This is a submission for a coding challenge. The project is structured to be easily extensible for additional features in later stages.
