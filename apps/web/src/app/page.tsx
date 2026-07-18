import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export default function Home() {
  const steps = [
    {
      title: 'Monorepo & pnpm',
      desc: 'Workspace estruturado e otimizado com pnpm.',
      status: 'success',
    },
    {
      title: 'Next.js App Router',
      desc: 'Infraestrutura moderna com Server Components e roteamento flexível.',
      status: 'success',
    },
    {
      title: 'Tailwind CSS & Poppins',
      desc: 'Estilização v4 de alta performance com a identidade visual oficial.',
      status: 'success',
    },
    {
      title: 'shadcn/ui',
      desc: 'Componentização baseada no Radix/Base UI integrada na pasta Shared.',
      status: 'success',
    },
    {
      title: 'Qualidade de Código',
      desc: 'Linter, formatador, Husky hooks e Commitlint configurados e ativos.',
      status: 'success',
    },
    {
      title: 'Arquitetura Feature-First',
      desc: 'Pastas de domínio isoladas e preparadas para escalabilidade do MVP.',
      status: 'success',
    },
  ];

  return (
    <div className="flex flex-col flex-1 bg-[#0F2849] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1d3557] via-[#0F2849] to-[#08182d] text-white">
      {/* Header */}
      <header className="border-b border-[#2B3A55] bg-[#0F2849]/80 backdrop-blur-md sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-gradient-to-tr from-[#003870] to-[#33B458] flex items-center justify-center font-bold text-lg tracking-tight text-white shadow-lg shadow-[#003870]/20">
              P
            </div>
            <span className="font-semibold tracking-tight text-lg">PM Sessions</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#33B458]/10 text-[#33B458] border border-[#33B458]/20 font-medium">
              Sprint 1 Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 md:py-20 flex flex-col gap-12 justify-center">
        <div className="max-w-3xl flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Bootstrap técnico concluído com{' '}
            <span className="bg-gradient-to-r from-[#33B458] to-emerald-400 bg-clip-text text-transparent">
              sucesso!
            </span>
          </h1>
          <p className="text-[#AEB8C5] text-lg md:text-xl leading-relaxed max-w-2xl">
            A fundação da aplicação PM Sessions está pronta e estruturada de acordo com as
            especificações de design e arquitetura da Pulse.
          </p>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#162133] hover:bg-[#1D2A40] border border-[#2B3A55] rounded-[20px] p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 size-24 bg-gradient-to-bl from-[#33B458]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-lg tracking-tight text-white group-hover:text-white transition-colors">
                  {step.title}
                </h3>
                <CheckCircle2 className="size-5 text-[#33B458] shrink-0" />
              </div>
              <p className="text-[#AEB8C5] text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Actions / Next Steps */}
        <div className="bg-[#162133] border border-[#2B3A55] rounded-[24px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Prontos para o próximo passo?</h2>
            <p className="text-[#AEB8C5] text-sm md:text-base leading-relaxed">
              O ambiente está pronto para iniciar a implementação da especificação{' '}
              <code className="text-[#33B458] bg-[#33B458]/10 px-1.5 py-0.5 rounded">
                001-public-scheduling.md
              </code>
              .
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button className="w-full md:w-auto bg-[#003870] hover:bg-[#003870]/80 text-white rounded-xl shadow-lg shadow-[#003870]/20 flex items-center justify-center gap-2 group cursor-pointer py-5 px-6">
              Iniciar Scheduling
              <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2B3A55] py-8 text-center text-xs text-[#AEB8C5]/60 bg-[#08182d]/50">
        <p>© 2026 PM Sessions — Pulse Architecture Foundation</p>
      </footer>
    </div>
  );
}
