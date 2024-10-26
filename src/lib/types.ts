import { icons } from 'lucide-svelte';

export type Icon = keyof typeof icons;

export interface NavGroup {
  icon?: Icon | null;
  title: string;
  items: NavItem[];
}

export interface NavItem {
  icon?: Icon | null;
  title: string;
  url: string;
}