"use client";
import {
  Briefcase, Stethoscope, Hospital, Pill, Home, GraduationCap, BookOpen, Wrench, Hammer, Truck, Car, Bus, ShoppingBag, Store,
  HeartHandshake, Baby, PawPrint, Utensils, Landmark, Sprout, Tractor, Shield, Users, Accessibility, Scissors, Shirt, Bed,
  Dumbbell, Palette, MapPin, Phone, Bike, Fuel, Siren, type LucideIcon,
} from "lucide-react";

export const SECTOR_ICONS: Record<string, LucideIcon> = {
  briefcase: Briefcase, stethoscope: Stethoscope, hospital: Hospital, pill: Pill, home: Home, "graduation-cap": GraduationCap,
  book: BookOpen, wrench: Wrench, hammer: Hammer, truck: Truck, car: Car, bus: Bus, "shopping-bag": ShoppingBag, store: Store,
  "heart-handshake": HeartHandshake, baby: Baby, "paw-print": PawPrint, utensils: Utensils, landmark: Landmark, sprout: Sprout,
  tractor: Tractor, shield: Shield, users: Users, accessibility: Accessibility, scissors: Scissors, shirt: Shirt, bed: Bed,
  dumbbell: Dumbbell, palette: Palette, "map-pin": MapPin, phone: Phone, bike: Bike, fuel: Fuel, siren: Siren,
};

export function SectorIcon({ name, className }: { name: string; className?: string }) {
  const I = SECTOR_ICONS[name] ?? MapPin;
  return <I className={className} aria-hidden />;
}

// The Blue Dots wordmark only (white text, no circle mark), cut from EkStep's logo file.
export function BrandChip({ compact = false }: { compact?: boolean }) {
  return <img src="/blue-dots-wordmark.png" alt="Blue Dots AI — Seeded by EkStep" width={647} height={176} className={compact ? "h-[22px] w-auto" : "h-7 w-auto"} />;
}

export function DotsMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#2563EB" />
      <circle cx="11" cy="12" r="3.2" fill="#fff" />
      <circle cx="21" cy="11" r="2.4" fill="#fff" opacity=".75" />
      <circle cx="16.5" cy="20.5" r="3.6" fill="#fff" />
      <circle cx="24" cy="20" r="1.8" fill="#fff" opacity=".6" />
    </svg>
  );
}

// Shown only on the UAT instance, so nobody mistakes it for production.
export function EnvBadge() {
  if (process.env.NEXT_PUBLIC_APP_ENV !== "uat") return null;
  return <span title="Test instance: changes are tried here before production" className="inline-flex h-5 items-center rounded-[4px] border border-[#5a3d12] bg-warn-soft px-1.5 text-[11px] font-semibold tracking-wide text-warn">UAT</span>;
}
