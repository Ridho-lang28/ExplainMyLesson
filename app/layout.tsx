import '../src/styles/globals.css';

export const metadata = {
  title: 'ExplainMyLesson AI',
  description: 'Platform Pembelajaran Adaptif',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
