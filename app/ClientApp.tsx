"use client";
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import { AppProviders } from '@/providers';

export default function ClientApp() {
  return (
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>
  );
}
