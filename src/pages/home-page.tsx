import { useQuery } from '@tanstack/react-query';
import { marketApi } from '@/services/market';
import { useAuthStore } from '@/stores/auth-store';
import { HomeHero } from '@/features/home/components/home-hero';
import { HomeMarketGrid } from '@/features/home/components/home-market-grid';
import { HomeFeaturesGrid } from '@/features/home/components/home-features-grid';
import { HomeCta } from '@/features/home/components/home-cta';

export function HomePage() {
  const { session } = useAuthStore();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['market', 'summary'],
    queryFn: () => marketApi.summary(),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="home-page w-full min-w-0 space-y-10 pb-10 md:space-y-14 md:pb-16">
      <HomeHero data={data} loading={isLoading} session={session} />
      <HomeMarketGrid
        data={data}
        loading={isLoading}
        error={isError}
        onRetry={() => void refetch()}
      />
      <HomeFeaturesGrid session={session} />
      <HomeCta session={session} />
    </div>
  );
}
