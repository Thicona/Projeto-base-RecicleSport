// src/app/index.tsx
import React, { useState, useEffect } from 'react';
import AppNavigator from '../navigation/AppNavigator';

export default function Index() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <AppNavigator />;
}
