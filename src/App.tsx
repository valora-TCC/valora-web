import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { AuthProvider } from '@/features/auth/auth-provider';
import { ProtectedRoute } from '@/features/auth/protected-route';
import { AppLayout } from '@/layouts/app-layout';
import { AuthLayout } from '@/layouts/auth-layout';
import { HomeLayout } from '@/layouts/home-layout';
import { LoginPage } from '@/pages/login-page';
import { RegisterPage } from '@/pages/register-page';
import { ForgotPasswordPage } from '@/pages/forgot-password-page';
import { HomePage } from '@/pages/home-page';
import { DashboardPage } from '@/pages/dashboard-page';
import { CarteirasPage } from '@/pages/carteiras-page';
import { CategoriasPage } from '@/pages/categorias-page';
import { TransacoesPage } from '@/pages/transacoes-page';
import { MetasPage } from '@/pages/metas-page';
import { OrcamentosPage } from '@/pages/orcamentos-page';
import { InvestmentsPage } from '@/pages/investments-page';
import { HelpLayout } from '@/features/help/components/help-layout';
import {
  HelpHubPage,
  HelpGettingStartedPage,
  HelpFirstStepsPage,
  HelpUsageFlowPage,
  HelpFeaturesPage,
  HelpFeatureDetailPage,
  HelpExamplesPage,
  HelpGlossaryPage,
  HelpFaqPage,
  HelpComingSoonPage,
} from '@/pages/help-page';
import { ProfileBootstrap } from '@/features/auth/profile-bootstrap';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<HomeLayout />}>
              <Route index element={<HomePage />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<ProfileBootstrap />}>
                <Route element={<AppLayout />}>
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="carteiras" element={<CarteirasPage />} />
                  <Route path="categorias" element={<CategoriasPage />} />
                  <Route path="transacoes" element={<TransacoesPage />} />
                  <Route path="metas" element={<MetasPage />} />
                  <Route path="orcamentos" element={<OrcamentosPage />} />
                  <Route path="investments" element={<InvestmentsPage />} />
                  <Route path="ajuda" element={<HelpLayout />}>
                    <Route index element={<HelpHubPage />} />
                    <Route path="por-onde-comecar" element={<HelpGettingStartedPage />} />
                    <Route path="primeiros-passos" element={<HelpFirstStepsPage />} />
                    <Route path="como-utilizar" element={<HelpUsageFlowPage />} />
                    <Route path="funcionalidades" element={<HelpFeaturesPage />} />
                    <Route path="funcionalidades/:featureId" element={<HelpFeatureDetailPage />} />
                    <Route path="exemplos" element={<HelpExamplesPage />} />
                    <Route path="glossario" element={<HelpGlossaryPage />} />
                    <Route path="faq" element={<HelpFaqPage />} />
                    <Route path="em-breve" element={<HelpComingSoonPage />} />
                  </Route>
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
