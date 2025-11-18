# CypherPass - Frontend

React TypeScript frontend for event ticket purchase.

## Features

- Event search by code
- Event details display (name, date, price)
- Personal information form (name, age, email, document number)
- Ticket purchase simulation
- JSON download with purchase data (merkleTree, merkleTreeRoot, transactionID)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── EventCodeInput.tsx      # Initial screen - code input
│   │   ├── EventDetails.tsx        # Event details and form
│   │   ├── PersonalDataForm.tsx    # Personal information form
│   │   └── PurchaseComplete.tsx    # Successful purchase screen
│   ├── App.tsx                      # Main component
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── index.html
├── package.json
└── vite.config.ts
```

