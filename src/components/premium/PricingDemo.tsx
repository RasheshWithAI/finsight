
import { PricingCard } from "@/components/ui/dark-gradient-pricing"

function PricingDemo() {
  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-20 md:px-8">
        <div className="mb-12 space-y-3">
          <h2 className="text-center text-3xl font-semibold leading-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
            Premium Features
          </h2>
          <p className="text-center text-base text-muted-foreground md:text-lg">
            Upgrade to Arya Pro for advanced financial analysis and personalized insights
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <PricingCard
            tier="Basic"
            price="$0/mo"
            bestFor="For personal finance management"
            CTA="Current Plan"
            benefits={[
              { text: "Basic financial summary", checked: true },
              { text: "Simple market data", checked: true },
              { text: "Stock watchlist", checked: true },
              { text: "Basic AI insights", checked: true },
              { text: "Advanced portfolio analytics", checked: false },
              { text: "Premium AI assistant", checked: false },
            ]}
          />
          <PricingCard
            tier="Pro"
            price="$19.99/mo"
            bestFor="For active investors"
            CTA="Upgrade Now"
            benefits={[
              { text: "Advanced financial analytics", checked: true },
              { text: "Real-time market data", checked: true },
              { text: "Unlimited watchlists", checked: true },
              { text: "Advanced AI insights", checked: true },
              { text: "Portfolio optimization", checked: true },
              { text: "Priority customer support", checked: false },
            ]}
          />
          <PricingCard
            tier="Enterprise"
            price="$49.99/mo"
            bestFor="For professional traders"
            CTA="Contact Us"
            benefits={[
              { text: "Complete financial suite", checked: true },
              { text: "Level 2 market data", checked: true },
              { text: "Custom investment strategies", checked: true },
              { text: "Premium AI research assistant", checked: true },
              { text: "Advanced tax optimization", checked: true },
              { text: "Dedicated account manager", checked: true },
            ]}
          />
        </div>
      </div>
    </section>
  )
}

export { PricingDemo }
