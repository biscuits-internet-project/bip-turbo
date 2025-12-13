import { Heart, Server, Key, Globe, Code, Pencil } from "lucide-react";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

const REDIS_KEY = "support:donations-received";

export function meta() {
  return [
    { title: "Support BIP | Biscuits Internet Project" },
    {
      name: "description",
      content: "Support the Biscuits Internet Project - see our running costs and help keep BIP alive.",
    },
  ];
}

export const loader = publicLoader(async () => {
  const donationsReceived = (await services.redis.get<number>(REDIS_KEY)) ?? 0;
  return { donationsReceived };
});

const MONTHLY_COSTS = [
  { name: "Fly.io", description: "Hosting & compute", amount: 25, icon: Server },
  { name: "Doppler", description: "Secrets management", amount: 15, icon: Key },
  { name: "Domain", description: "discobiscuits.net", amount: 1.25, icon: Globe },
  { name: "Development", description: "Built with love", amount: 0, icon: Code, priceless: true },
];

const TOTAL_MONTHLY = MONTHLY_COSTS.filter((c) => !("priceless" in c)).reduce((sum, cost) => sum + cost.amount, 0);

export default function Support() {
  const { donationsReceived: initialDonations } = useLoaderData<typeof loader>();
  const [donationsReceived, setDonationsReceived] = useState(initialDonations);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(initialDonations));
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(editValue) }),
      });
      if (response.ok) {
        const data = await response.json();
        setDonationsReceived(data.donationsReceived);
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="page-heading">SUPPORT BIP</h1>
        <p className="text-content-text-secondary mt-2">
          BIP is a labor of love, run by fans for fans. Here's what it costs to keep the lights on.
        </p>
      </div>

      <Card className="glass-content">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-content-text-primary mb-4">Monthly Costs</h2>
          <div className="space-y-3">
            {MONTHLY_COSTS.map((cost) => (
              <div
                key={cost.name}
                className="flex items-center justify-between py-2 border-b border-glass-border/30 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <cost.icon className="h-5 w-5 text-brand-primary" />
                  <div>
                    <div className="text-content-text-primary font-medium">{cost.name}</div>
                    <div className="text-content-text-tertiary text-sm">{cost.description}</div>
                  </div>
                </div>
                <div className="text-content-text-primary font-mono">
                  {"priceless" in cost && cost.priceless ? (
                    <span className="text-brand-secondary italic">priceless</span>
                  ) : (
                    `$${cost.amount.toFixed(2)}`
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-glass-border">
            <div className="text-content-text-primary font-semibold">Total</div>
            <div className="text-brand-primary font-mono font-semibold text-lg">${TOTAL_MONTHLY.toFixed(2)}/mo</div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-content">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-content-text-primary mb-4">Donations Received</h2>
          <div className="flex items-center justify-between">
            <div className="text-content-text-secondary">Total donations this month</div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-24 text-right font-mono"
                    min="0"
                    step="0.01"
                  />
                  <Button size="sm" onClick={handleSave} disabled={isSaving} className="btn-primary">
                    {isSaving ? "..." : "Save"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-content-text-primary font-mono text-lg">${donationsReceived.toFixed(2)}</span>
                  <AdminOnly>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditValue(String(donationsReceived));
                        setIsEditing(true);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </AdminOnly>
                </>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-glass-border/30">
            <div className="flex items-center justify-between">
              <div className="text-content-text-secondary">Monthly shortfall</div>
              <div
                className={`font-mono font-semibold text-lg ${donationsReceived >= TOTAL_MONTHLY ? "text-green-400" : "text-red-400"}`}
              >
                {donationsReceived >= TOTAL_MONTHLY
                  ? `+$${(donationsReceived - TOTAL_MONTHLY).toFixed(2)}`
                  : `-$${(TOTAL_MONTHLY - donationsReceived).toFixed(2)}`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-content border-brand-primary/30">
        <CardContent className="p-6 text-center">
          <Heart className="h-8 w-8 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-content-text-primary mb-2">Help Keep BIP Running</h2>
          <p className="text-content-text-secondary mb-4">
            Every dollar helps cover hosting costs and keeps this resource free for the community.
          </p>
          <Button asChild className="btn-primary">
            <a
              href="https://www.paypal.com/donate/?business=coteflakes@gmail.com&item_name=BIP+Support"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Heart className="h-4 w-4 mr-2" />
              Donate via PayPal
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
