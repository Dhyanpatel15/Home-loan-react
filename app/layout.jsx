import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'LoanHub - Compare Home Loans',
  description: 'Compare home loan options, calculate repayments, and submit loan enquiries.',
  keywords: 'home loans, compare home loans, mortgage calculator, Australia loans',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
