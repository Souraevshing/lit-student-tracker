# LIT - Student Management System

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## For Testing payment

## For Testing Payment

| Card Type             | Card Number      | CVV          | Expiry Date       |
|-----------------------|------------------|--------------|-------------------|
| Visa                  | 4242424242424242 | Any 3 digits | Any future date   |
| Mastercard            | 5555555555554444 | Any 3 digits | Any future date   |
| Mastercard (2-series) | 2223003122003222 | Any 3 digits | Any future date   |
| Mastercard (debit)    | 5200828282828210 | Any 3 digits | Any future date   |
| Mastercard (prepaid)  | 5105105105105100 | Any 3 digits | Any future date   |
| American Express      | 378282246310005  | Any 4 digits | Any future date   |
| American Express      | 371449635398431  | Any 4 digits | Any future date   |
| Discover              | 6011111111111117 | Any 3 digits | Any future date   |
| Visa (debit)          | 4000056655665556 | Any 3 digits | Any future date   |

### Admission Panel (/admission page)

- **All-in-one approach**: Shows the entire admission process in a single page
- **Sequential flow**: Displays different sections based on your current application status
- **Streamlined experience**: Guides you through each step in order
- **Best for**: New users going through the process for the first time

### Dashboard Quick Links

- **Direct access**: Provides individual links to specific steps
- **Flexible navigation**: Jump directly to any part of the process
- **Convenient shortcuts**: Quickly access what you need without navigating through multiple pages
- **Best for**: Returning users who need to complete a specific step

Both approaches connect to the same backend APIs and perform the same functions - they're just different ways to access the same features.

The Quick Links in the dashboard are especially useful for users who:

- Need to return to a specific step
- Want to check their application status
- Need to quickly access a particular function without going through the full flow

This dual approach gives users flexibility in how they interact with the admission process!
