import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X } from 'lucide-react';

export function SignUp({ onClose, onSwitchToLogin }) {
  const handleCardClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-sm bg-slate-900 border-slate-700 text-white animate-in zoom-in-95"
        onClick={handleCardClick}
      >
        <CardHeader className="relative text-center">
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Enter your details to get started.</CardDescription>
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="Your Name" 
              className="bg-slate-800 border-slate-600 focus:ring-blue-500/50" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              className="bg-slate-800 border-slate-600 focus:ring-blue-500/50" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              className="bg-slate-800 border-slate-600 focus:ring-blue-500/50" 
            />
          </div>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700">
            Create Account
          </Button>
          <div className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <button 
              onClick={onSwitchToLogin}
              className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2"
            >
              Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}