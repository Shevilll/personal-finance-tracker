# Personal Finance Tracker

A comprehensive web application for tracking personal finances, managing budgets, and visualizing spending patterns. Built with modern technologies including Next.js, React, shadcn/ui, Recharts, and MongoDB.

![Personal Finance Tracker](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)

## Features

### **Transaction Management**

- Add, edit, and delete transactions with real-time updates
- Categorized expenses with predefined categories and icons
- Date-based transaction tracking with calendar picker
- Form validation with comprehensive error handling
- Optimistic updates for smooth user experience

### **Data Visualization**

- **Monthly Expenses Chart**: Bar chart showing spending trends over 6 months
- **Category Breakdown**: Interactive pie chart with spending by category
- **Budget vs Actual**: Comparative bar chart for budget tracking
- All charts are fully responsive and theme-aware

### **Budget Management**

- Set monthly budgets for each expense category
- Real-time budget progress tracking with visual indicators
- Budget vs actual spending comparison
- Smart budget alerts (under budget, near limit, over budget)

### **Smart Insights**

- Personalized spending insights and recommendations
- Month-over-month spending analysis
- Budget performance indicators
- Top spending category identification

### **User Experience**

- Fully responsive design (mobile, tablet, desktop)
- Real-time data updates across all components
- Loading states and error handling
- Toast notifications for user feedback
- Professional UI with shadcn/ui components

## Tech Stack

### **Frontend**

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **State Management**: React hooks with optimistic updates

### **Backend**

- **API**: Next.js API Routes
- **Database**: MongoDB with native driver
- **Validation**: Zod schemas
- **Date Handling**: date-fns

### **Development**

- **Package Manager**: npm/yarn/pnpm
- **Code Quality**: TypeScript strict mode
- **Styling**: Tailwind CSS with CSS variables
- **Icons**: Lucide React

## Getting Started

### **Prerequisites**

- Node.js 18+
- MongoDB (local installation or MongoDB Atlas)
- npm, yarn, or pnpm

### **Installation**

1. **Clone the repository**

   ```bash
   git clone https://github.com/Shevilll/personal-finance-tracker
   cd personal-finance-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env

   # Database

   MONGODB_URI=mongodb://localhost:27017/finance_tracker

   # For MongoDB Atlas:

   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance_tracker

   # Application

   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Start the development server**

   ```bash
   npm run dev


   # or

   yarn dev

   # or

   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

### **Transactions Collection**

```javascript
{
\_id: ObjectId,
amount: Number, // Negative for expenses, positive for income
date: Date, // Transaction date
description: String, // Transaction description
category: String, // Category ID (food, transportation, etc.)
createdAt: Date, // Record creation timestamp
updatedAt: Date // Last update timestamp
}
```

### **Budgets Collection**

```javascript
{
\_id: ObjectId,
category: String, // Category ID
amount: Number, // Monthly budget amount
createdAt: Date, // Budget creation timestamp
updatedAt: Date // Last update timestamp
}
```

## API Endpoints

### **Transactions**

- `GET /api/transactions` - Fetch all transactions (latest 50)
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions` - Update existing transaction
- `DELETE /api/transactions` - Delete transaction

### **Analytics**

- `GET /api/transactions/monthly` - Monthly expense data for charts
- `GET /api/transactions/categories` - Category-wise spending data
- `GET /api/transactions/summary` - Dashboard summary statistics

### **Budgets**

- `GET /api/budgets` - Fetch all budgets
- `POST /api/budgets` - Save/update budgets
- `GET /api/budgets/progress` - Budget progress tracking
- `GET /api/budgets/comparison` - Budget vs actual comparison
- `GET /api/budgets/insights` - Smart spending insights

## Project Structure

```
├── app/
│ ├── api/ # API routes
│ │ ├── transactions/ # Transaction endpoints
│ │ │ ├── route.ts # CRUD operations
│ │ │ ├── monthly/ # Monthly data
│ │ │ ├── categories/ # Category analytics
│ │ │ └── summary/ # Dashboard summary
│ │ └── budgets/ # Budget endpoints
│ │ ├── route.ts # Budget CRUD
│ │ ├── progress/ # Progress tracking
│ │ ├── comparison/ # Budget vs actual
│ │ └── insights/ # Smart insights
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page
│ └── globals.css # Global styles
├── components/
│ ├── ui/ # shadcn/ui components
│ ├── transaction-form.tsx # Add/Edit transaction form
│ ├── transaction-list.tsx # Transaction list with actions
│ ├── monthly-chart.tsx # Monthly expenses chart
│ ├── category-pie-chart.tsx # Category breakdown chart
│ ├── budget-vs-actual-chart.tsx # Budget comparison chart
│ ├── summary-cards.tsx # Dashboard summary cards
│ ├── budget-overview.tsx # Budget progress overview
│ ├── budget-manager.tsx # Budget management dialog
│ ├── spending-insights.tsx # Smart insights component
│ ├── edit-transaction-dialog.tsx # Edit transaction modal
│ └── delete-transaction-dialog.tsx # Delete confirmation modal
├── lib/
│ ├── utils.ts # Utility functions
│ └── categories.ts # Expense categories configuration
└── hooks/
└── use-toast.ts # Toast notification hook
```

## 🎨 Categories

The application includes 10 predefined expense categories:

| Category          | Icon | Color   | Description                             |
| ----------------- | ---- | ------- | --------------------------------------- |
| Food & Dining     | 🍽️   | #FF6B6B | Restaurants, groceries, food delivery   |
| Transportation    | 🚗   | #4ECDC4 | Gas, public transport, ride-sharing     |
| Shopping          | 🛍️   | #45B7D1 | Clothing, electronics, general shopping |
| Entertainment     | 🎬   | #96CEB4 | Movies, games, subscriptions            |
| Bills & Utilities | 💡   | #FFEAA7 | Electricity, water, internet, phone     |
| Healthcare        | 🏥   | #DDA0DD | Medical expenses, insurance             |
| Education         | 📚   | #98D8C8 | Books, courses, tuition                 |
| Travel            | ✈️   | #F7DC6F | Flights, hotels, vacation expenses      |
| Fitness & Sports  | 💪   | #BB8FCE | Gym, sports equipment, activities       |
| Other             | 📦   | #AEB6BF | Miscellaneous expenses                  |

## 🔧 Configuration

### **Customizing Categories**

Edit `lib/categories.ts` to modify expense categories:

```typescript
export const EXPENSE_CATEGORIES = [
  {
    id: "custom",
    name: "Custom Category",
    color: "#FF0000",
    icon: "🎯",
  },
  // ... other categories
];
```

### **Database Configuration**

The app automatically creates the required collections. No manual database setup needed.

### **Environment Variables**

| Variable               | Description               | Required |
| ---------------------- | ------------------------- | -------- |
| `MONGODB_URI`          | MongoDB connection string | Yes      |
| `NEXT_PUBLIC_BASE_URL` | Application base URL      | Yes      |

## 🚀 Deployment

### **Vercel (Recommended)**

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### **Other Platforms**

The application can be deployed to any platform supporting Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

### **Database Hosting**

For production, use MongoDB Atlas:

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update `MONGODB_URI` in your environment variables

## 📱 Features in Detail

### **Real-time Updates**

- All components automatically refresh when data changes
- Optimistic updates provide immediate feedback
- Charts and summaries update without page refresh

### **Responsive Design**

- **Mobile**: Stacked layout with touch-friendly interactions
- **Tablet**: Balanced grid layout with optimized spacing
- **Desktop**: Full multi-column layout with side-by-side charts

### **Data Visualization**

- **Interactive Charts**: Hover effects and detailed tooltips
- **Theme Integration**: Charts adapt to light/dark themes
- **Responsive Charts**: Automatically resize for different screens
- **Professional Styling**: Consistent colors and typography

### **Budget Management**

- **Visual Progress**: Color-coded progress bars
- **Smart Alerts**: Automatic notifications for budget status
- **Flexible Budgets**: Set different amounts for each category
- **Monthly Reset**: Budgets track current month spending

### **User Experience**

- **Loading States**: Skeleton loaders for better perceived performance
- **Error Handling**: Graceful error messages and retry options
- **Toast Notifications**: Success and error feedback
- **Form Validation**: Real-time validation with helpful messages

## Testing

### **Manual Testing Checklist**

- [ ] Add new transaction
- [ ] Edit existing transaction
- [ ] Delete transaction
- [ ] Set budgets for categories
- [ ] View all charts and ensure they update
- [ ] Test responsive design on different screen sizes
- [ ] Verify data persistence across page refreshes

### **API Testing**

Use tools like Postman or curl to test API endpoints:

```bash

# Get all transactions

curl http://localhost:3000/api/transactions

# Create new transaction

curl -X POST http://localhost:3000/api/transactions \
 -H "Content-Type: application/json" \
 -d '{"amount":-50,"date":"2024-01-15","description":"Lunch","category":"food"}'
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**

- Follow TypeScript best practices
- Use meaningful component and variable names
- Add proper error handling
- Ensure responsive design
- Test on multiple screen sizes

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Recharts](https://recharts.org/) for the charting library
- [Lucide](https://lucide.dev/) for the icon set
- [Next.js](https://nextjs.org/) for the amazing framework
- [MongoDB](https://www.mongodb.com/) for the database solution

## Future Enhancements

- [ ] **Income Tracking**: Add income categories and tracking
- [ ] **Savings Goals**: Set and track savings targets
- [ ] **Export Features**: Export data to CSV/PDF
- [ ] **Multi-currency Support**: Handle different currencies
- [ ] **Recurring Transactions**: Automatic recurring expense tracking
- [ ] **Advanced Analytics**: More detailed spending insights
- [ ] **Dark Mode**: Complete dark theme implementation
- [ ] **PWA Features**: Offline support and mobile app-like experience
- [ ] **Data Backup**: Automatic data backup and restore
- [ ] **Multi-user Support**: Family/shared account management

---

**Built with ❤️ using Next.js, TypeScript, and MongoDB**

_Happy budgeting!_
