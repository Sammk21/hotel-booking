"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { getUserProfile } from "@/actions/allActions"
import { userMeResponse, UserResponse } from "@/types/types"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<userMeResponse>();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const getUserC = async () => {
       try {
         const token = localStorage.getItem("authToken"); // Replace with secure auth handling
         if (!token) {
           setIsLoggedIn(false);
           return;
         }
         const user = await getUserProfile(token);
         //@ts-ignore
         setUser(user);
         setIsLoggedIn(true);
       } catch (error) {
         console.error("Error booking hotel:", error);
         alert("Failed to book hotel. Please try again.");
       }
     };

     console.log()

     useEffect(() => {
  getUserC()
     },[])



  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-serif">
              Luxe<span className="font-medium">Stay</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/hotels" className="text-sm font-medium hover:text-primary transition-colors">
              Hotels
            </Link>
            <Link href="/check-in" className="text-sm font-medium hover:text-primary transition-colors">
              Web Check-in
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          {!isLoggedIn ? (
             <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="outline" size="sm" className="rounded-none">
              <Link href="/auth/login">Log In</Link>
            </Button>
            <Button asChild size="sm" className="rounded-none">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
          ):(
            <div>welcome : {user?.user.email}</div>
          )}
          

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu} aria-expanded={isMenuOpen} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-sm font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/hotels"
                className="text-sm font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Hotels
              </Link>
              <Link
                href="/check-in"
                className="text-sm font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Web Check-in
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                <Button asChild variant="outline" size="sm" className="rounded-none w-full">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    Log In
                  </Link>
                </Button>
                <Button asChild size="sm" className="rounded-none w-full">
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

