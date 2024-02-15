import SessionProvider from "@/components/auth/context/CustomSessionProvider"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                {/* Layout UI */}
                <main>{children}</main>
            </body>
        </html>
    )
}