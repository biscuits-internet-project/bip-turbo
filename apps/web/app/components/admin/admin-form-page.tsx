import type { ReactNode } from "react";
import { AdminOnly } from "~/components/admin/admin-only";
import { Card, CardContent } from "~/components/ui/card";
import { PageHeader } from "~/components/ui/page-header";

interface AdminFormPageProps {
  title: string;
  backHref: string;
  backLabel: string;
  /** The form. */
  children: ReactNode;
  /** Optional below-the-form section, e.g. the delete control on edit pages. */
  footer?: ReactNode;
}

/**
 * Shared chrome for the admin create/edit pages (authors, instruments,
 * musicians): the admin gate, the standard PageHeader (a left back link above
 * the centered title), and the card the form sits in. Keeps every admin form
 * page visually identical so they only supply the form and an optional footer.
 */
export function AdminFormPage({ title, backHref, backLabel, children, footer }: AdminFormPageProps) {
  return (
    <AdminOnly>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <PageHeader title={title} backLink={{ to: backHref, label: backLabel }} />
        </div>

        <Card className="card-premium">
          <CardContent className="p-6 space-y-6">
            {children}
            {footer ? <div className="border-t border-glass-border pt-6">{footer}</div> : null}
          </CardContent>
        </Card>
      </div>
    </AdminOnly>
  );
}
