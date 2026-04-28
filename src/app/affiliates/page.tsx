import { ExternalLink, Server, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Affiliates | JKey SMP",
  description: "Meet our official partners and sponsors who help make JKey SMP possible.",
};

export default function AffiliatesPage() {
  const affiliates = [
    {
      name: "PaperNodes",
      description: "Experience the next level of Minecraft hosting. PaperNodes provides blazing fast performance, 99.9% uptime, and dedicated support for communities of all sizes.",
      link: "https://papernodes.com",
      icon: <Server className="w-12 h-12 text-primary" />,
      tag: "Hosting Partner",
      gradient: "from-blue-500/10 to-primary/10"
    },
    {
      name: "HabiTick",
      description: "Level up your daily routine. HabiTick is a powerful habit tracker that combines gamification with beautiful design to help you reach your goals faster.",
      link: "https://habitick.pro",
      icon: <CheckCircle2 className="w-12 h-12 text-primary" />,
      tag: "Productivity Partner",
      gradient: "from-green-500/10 to-primary/10"
    }
  ];

  return (
    <div className="flex-1 bg-background py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-6xl font-black font-heading text-foreground mb-6 tracking-tight">
            Our Affiliates
          </h1>
          <div className="section-line mx-auto mb-8"></div>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            We are proud to collaborate with industry-leading partners who share our commitment to quality and community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {affiliates.map((affiliate) => (
            <div
              key={affiliate.name}
              className="group relative bg-card border border-border rounded-3xl p-10 hover:border-primary/50 hover:shadow-[0_30px_60px_rgba(0,0,0,0.25)] transition-all duration-500 flex flex-col items-center text-center"
            >
              {/* Card Hover Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${affiliate.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>

              <div className="relative z-10 mb-8 p-6 bg-primary/5 rounded-2xl group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                {affiliate.icon}
              </div>

              <div className="relative z-10 inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6">
                {affiliate.tag}
              </div>

              <h2 className="relative z-10 text-3xl font-black font-heading text-foreground mb-4">
                {affiliate.name}
              </h2>

              <p className="relative z-10 text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-12 flex-1">
                {affiliate.description}
              </p>

              <a
                href={affiliate.link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center justify-center w-full py-4.5 bg-foreground text-background font-black rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 group-hover:scale-[1.02] shadow-xl"
              >
                Visit {affiliate.name}
                <ExternalLink className="ml-3 w-5 h-5" />
              </a>
            </div>
          ))}
        </div>

        {/* Support Note */}
        <div className="mt-24 text-center p-12 bg-card/50 border border-border rounded-3xl backdrop-blur-sm">
          <p className="text-zinc-500 dark:text-zinc-400 font-medium italic">
            "Supporting our affiliates helps sustain the JKey SMP community. We only partner with services we personally use and trust."
          </p>
        </div>
      </div>
    </div>
  );
}
