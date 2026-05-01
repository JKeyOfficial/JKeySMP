import { Scale } from "lucide-react";

export const metadata = {
  title: "Terms of Service | JKey SMP",
  description: "Read JKey SMP's terms of service to understand the rules and guidelines for using our server and website.",
};

export default function TermsOfServicePage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: [
        "By accessing or using the JKey SMP Minecraft server, website, or any associated services, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services.",
      ],
    },
    {
      title: "2. Server Rules",
      content: [
        "All players must follow the rules of JKey SMP at all times. Failure to comply may result in warnings, temporary bans, or permanent bans at the discretion of the staff team.",
      ],
      list: [
        "No cheating, hacking, or using exploits of any kind.",
        "No harassment, bullying, hate speech, or toxic behaviour.",
        "No spamming, advertising, or promoting other servers in chat.",
        "No impersonating staff members or other players.",
        "Respect all players and staff at all times.",
        "Use common sense — if you think something might be against the rules, it probably is.",
      ],
    },
    {
      title: "3. Accounts",
      content: [
        "You are responsible for the security and activity of your Minecraft account on our server. We are not responsible for any actions taken on your account by unauthorised users. Sharing accounts is permitted but any actions taken on shared accounts are the responsibility of the account owner.",
      ],
    },
    {
      title: "4. Purchases & Refunds",
      content: [
        "All purchases made through the JKey SMP store are final. Digital goods such as ranks and perks are delivered immediately upon payment and are non-refundable.",
      ],
      list: [
        "Purchases are tied to your Minecraft account and cannot be transferred.",
        "Chargebacks or payment disputes will result in an immediate and permanent ban.",
        "We reserve the right to modify, remove, or update perks and features associated with purchased ranks at any time.",
        "If the server shuts down permanently, no refunds will be issued for previously purchased items.",
      ],
    },
    {
      title: "5. Bans & Moderation",
      content: [
        "The JKey SMP staff team reserves the right to ban, mute, or restrict any player at any time for any reason, including but not limited to rule violations.",
      ],
      list: [
        "Bans may be temporary or permanent depending on severity.",
        "Purchasing a rank or perk does not exempt you from server rules.",
        "Banned players are not entitled to refunds for any purchases.",
        "Ban appeals may be submitted through our Discord server.",
      ],
    },
    {
      title: "6. Intellectual Property",
      content: [
        "All content on the JKey SMP website, including logos, graphics, text, and design, is the property of JKey SMP and may not be reproduced without permission. Minecraft is a trademark of Mojang Studios / Microsoft. JKey SMP is not affiliated with or endorsed by Mojang or Microsoft.",
      ],
    },
    {
      title: "7. Limitation of Liability",
      content: [
        "JKey SMP is provided \"as is\" without warranties of any kind. We are not liable for any loss of data, in-game items, progress, or any other damages resulting from the use of our services. Server downtime, data loss, or resets may occur and are outside our control.",
      ],
    },
    {
      title: "8. Modifications to Terms",
      content: [
        "We reserve the right to update or modify these Terms of Service at any time. Changes will be posted on this page with an updated effective date. Continued use of JKey SMP after changes are posted constitutes acceptance of the updated terms.",
      ],
    },
    {
      title: "9. Contact Us",
      content: [
        "If you have any questions about these Terms of Service, please reach out to us through our Discord server.",
      ],
    },
  ];

  return (
    <div className="flex-1 bg-background py-28 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-[0.15em] mb-6">
            <Scale className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-heading text-foreground mb-6 tracking-tight">
            Terms of Service
          </h1>
          <div className="section-line mx-auto mb-6 md:mb-8"></div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Last updated: April 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 md:space-y-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-card border border-border rounded-xl md:rounded-2xl p-6 md:p-8 hover:border-primary/20 transition-all duration-300"
            >
              <h2 className="text-xl font-bold font-heading text-foreground mb-4">
                {section.title}
              </h2>
              {section.content.map((paragraph, i) => (
                <p
                  key={i}
                  className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4"
                >
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="space-y-2 ml-1">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2"></span>
                      <span className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 md:mt-16 text-center p-8 md:p-12 bg-card/50 border border-border rounded-2xl md:rounded-3xl backdrop-blur-sm">
          <p className="text-zinc-500 dark:text-zinc-400 font-medium italic">
            By using JKey SMP, you agree to these Terms of Service. If you do
            not agree, please discontinue use of our services.
          </p>
        </div>
      </div>
    </div>
  );
}
