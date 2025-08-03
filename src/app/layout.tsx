import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <title>Time Together</title>
      </head>
      <body className="bg-gray-100 text-gray-800">
        {children}
      </body>
    </html>
  );
}