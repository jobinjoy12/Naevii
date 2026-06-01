import { Hero } from '@/components/marketing/hero';
import { HomeSections } from '@/components/marketing/sections';

export default function HomePage() {
  return (
    <main className="overflow-x-clip bg-pearl">
      <Hero />
      <HomeSections />
    </main>
  );
}