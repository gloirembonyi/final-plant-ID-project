import React from 'react'
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
  } from '@clerk/nextjs'

export default function page() {
  return (
    <div>
      <SignedIn>     
          <UserButton>
            <button>Signin</button>
          </UserButton>
      </SignedIn>
    </div>   
  )
}
