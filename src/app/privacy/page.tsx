import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | JKey SMP",
  description: "Read JKey SMP's privacy policy to understand how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: [
        "When you use JKey SMP's website or Minecraft server, we may collect the following information:",
      ],
      list: [
        "Minecraft username and UUID — used to identify you on the server and deliver purchased ranks or perks.",
        "Email address — collected only if you make a purchase through our store, for order confirmations and support.",
        "Payment information — processed securely by Stripe. We never store your card details directly.",
        "IP address — logged temporarily for server security, anti-cheat, and abuse prevention.",
        "Gameplay data — such as playtime, in-game economy balance, and chat messages for moderation purposes.",
      ],
    },
    {
      title: "2. How We Use Your Information",
      content: [
        "We use the information we collect to:",
      ],
      list: [
        "Provide, maintain, and improve the JKey SMP server and website.",
        "Process purchases and deliver digital goods (ranks, perks, etc.).",
        "Enforce our server rules and Terms of Service.",
        "Communicate with you about your account, purchases, or server updates.",
        "Protect against fraud, abuse, and unauthorised access.",
      ],
    },
    {
      title: "3. Data Sharing",
      content: [
        "We do not sell your personal information. We may share limited data with:",
      ],
      list: [
        "Stripe — for secure payment processing.",
        "Server hosting providers — for server operation and performance.",
        "Mojang/Microsoft — your Minecraft account data is subject to their own privacy policies.",
      ],
    },
    {
      title: "4. Data Retention",
      content: [
        "We retain your data for as long as your account is active on our server or as needed to provide services. Gameplay data such as chat logs may be periodically purged. You may request deletion of your data by contacting us on Discord.",
      ],
    },
    {
      title: "5. Cookies",
      content: [
        "Our website uses essential cookies for functionality such as theme preference and login sessions. We do not use third-party tracking or advertising cookies.",
      ],
    },
    {
      title: "6. Children's Privacy",
      content: [
        "JKey SMP does not knowingly collect personal information from children under the age of 13. If you are a parent or guardian and believe your child has provided us with personal data, please contact us and we will take steps to delete it.",
      ],
    },
    {
      title: "7. Your Rights",
      content: [
        "Depending on your location, you may have the right to:",
      ],
      list: [
        "Access the personal data we hold about you.",
        "Request correction or deletion of your data.",
        "Withdraw consent for data processing.",
      ],
      after: "To exercise any of these rights, please reach out to us via Discord.",
    },
    {
      title: "8. Changes to This Policy",
      content: [
        "We may update this privacy policy from time to time. Any changes will be posted on this page with an updated effective date. Continued use of our services after changes constitutes acceptance of the updated policy.",
      ],
    },
    {
      title: "9. Contact Us",
      content: [
        "If you have any questions or concerns about this privacy policy, please contact us through our Discord server.",
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
            <ShieldCheck className="w-4 h-4" />
            Legal
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-heading text-foreground mb-6 tracking-tight">
            Privacy Policy
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
              {section.after && (
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mt-4 text-sm">
                  {section.after}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 md:mt-16 text-center p-8 md:p-12 bg-card/50 border border-border rounded-2xl md:rounded-3xl backdrop-blur-sm">
          <p className="text-zinc-500 dark:text-zinc-400 font-medium italic">
            By using JKey SMP, you acknowledge that you have read and understood
            this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
