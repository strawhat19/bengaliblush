'use client';

import { createContext } from 'react';
import type { Service } from '@/shared/types/storefront';

export const BookingContext = createContext<((service?: Service) => void) | null>(null);
