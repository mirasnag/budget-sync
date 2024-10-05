# Personal Budget App

## Overview

The Personal Budget App is a simple, user-friendly application designed to help users manage their finances effectively. It allows users to track income, expenses, and savings, giving them a clear overview of their financial situation. The app is built using modern web technologies, providing a fast, responsive, and scalable solution.

- **GitHub Repository**: [Personal Budget App Repository](https://github.com/mirasnag/personal_budget)
- **Live Demo**: [Personal Budget App](https://budget-sync.netlify.app/)

## Features

- **Multi-Asset Support**: Manage different types of assets including cash, bank accounts, and investments.
- **Transactions Sort and Filter**: Easily sort and filter transactions by date, category, or amount for better organization and analysis.
- **Spending Analysis**: Visualize your spending habits with detailed charts and graphs to better understand where your money goes.
- **Currency Conversion**: Automatically convert transactions in different currencies to your preferred currency for accurate financial tracking.

## Tech Stack

- **Vite**: For a fast development experience, leveraging Vite's bundling and dev server capabilities.
- **TypeScript**: Ensures type safety and enhanced development experience with type-checking.
- **React Router DOM (RRD)**: Manages the routing in the application, allowing for seamless navigation between different views.

## Data Models

### Asset

Represents a financial asset such as cash, a bank account, or an investment. Each asset tracks its initial balance and associated currency.

- **id** (string): Unique identifier for the asset.
- **name** (string): The name of the asset (e.g., "Bank Account", "Cash").
- **initBalance** (number): The initial balance of the asset.
- **currency** (string): The currency in which the asset is held.

### Category

Represents a category of expenses with a defined monthly budget. Categories are only relevant for expense transactions and help organize spending.

- **id** (string): Unique identifier for the category.
- **name** (string): The name of the category (e.g., "Groceries", "Utilities").
- **totalBudgeted** (number): The monthly budget allocated to this category.
- **currency** (string): The currency used for budgeting.

### Transaction

Represents a financial transaction. Transactions are categorized into three types: Expense, Transfer, and Income. The relationship between assets and transactions changes depending on the type.

- **id** (string): Unique identifier for the transaction.
- **name** (string): A description or name for the transaction.
- **asset_id** (string): The associated asset. For expenses, it's the asset from which the expense is paid. For transfers, it's the destination asset. For income, it's the asset receiving the income.
- **category_id** (string | null): Relevant only for Expense transactions. Identifies the category of the expense.
- **asset_from_id** (string | null): Relevant only for Transfer transactions. Identifies the asset from which the transfer originated.
- **source** (string | null): Relevant only for Income transactions. Describes the source of the income (e.g., "Salary").
- **amount** (number): The amount of the transaction.
- **currency** (string): The currency in which the transaction was made.
- **date** (Date): The date of the transaction.
- **createdAt** (Date): The date and time when the transaction was created.
- **type** (string): The type of the transaction, which can be "Expense", "Transfer", or "Income".

### Relationships

- **Asset-Transaction**: Each transaction is linked to an asset through `asset_id`. Depending on the type of transaction, this asset serves different roles:
  - For an **Expense**, it is the asset from which the payment is made.
  - For a **Transfer**, it is the destination asset, with the source asset linked by `asset_from_id`.
  - For **Income**, it is the asset receiving the income.
- **Category-Transaction**: Expense transactions are linked to a `Category` via `category_id`, which helps categorize and budget expenses.

## Installation

To get started with the project, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/mirasnag/personal_budget.git
cd personal_budget
npm install
```
