import { Inter} from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { experimental__brutalist, neobrutalism } from "@clerk/themes";
import { Toaster } from "@/components/ui/sonner";

const inter= Inter({subsets:["latin"]});



export const metadata = {
  title: "Culinara – Where Ingredients Become Inspiration",
  description:
    "From pantry scan to plated perfection, Culinara delivers intelligent recipe generation, global cuisine discovery, and personalized culinary experiences.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
  appearance={{
    baseTheme: neobrutalism,
    variables: {
      colorPrimary: "#3F8E4F ",
      hover:"#3A5F3C"
      
         // Your olive
    },
  }}
>

    
    <html lang="en" suppressContentEditableWarning>
      <body
        className={`${inter.variable}`}>
        <Header/>
        <main className="min-h-screen">{children}</main> 
        <Toaster richColors/>
        <footer className="py-8 px-4 border-t">
          <div className="max-w-6xl mx-auto flex justify-center items-center">
            <p className="text-stone-500 text-sm items-center">
               Where ingredients meet intelligence 🥗 | Designed by Diya
            </p>
          </div>
        </footer>
      </body>
    </html>
    </ClerkProvider>
  );
}
