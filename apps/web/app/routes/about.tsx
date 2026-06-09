import { ContactDialog } from "~/components/contact/contact-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { LinkButton } from "~/components/ui/link-button";

export function meta() {
  return [
    { title: "About | Biscuits Internet Project" },
    {
      name: "description",
      content: "Learn about the Biscuits Internet Project - the ultimate fan resource for the Disco Biscuits.",
    },
  ];
}

export default function About() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="page-heading">ABOUT BIP</h1>
      </div>

      <div className="grid gap-6 md:gap-8">
        <Card className="glass-content">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-content-text-primary mb-4">The Biscuits Internet Project</h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-content-text-secondary">
                The Biscuits Internet Project (BIP) is the premier online destination for Disco Biscuits fans. We're a
                community-driven platform dedicated to preserving and sharing the rich history of one of the most
                innovative bands in the jam scene.
              </p>
              <p className="text-content-text-secondary">
                Since our inception, we've been committed to providing comprehensive show information, setlists, audio
                recordings, and fan reviews. Our mission is to connect the global Disco Biscuits community and ensure
                that every show, every song, and every magical moment is documented and accessible to fans worldwide.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-content">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-content-text-primary mb-4">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-content-text-primary mb-2">Show Database</h3>
                <p className="text-content-text-secondary text-sm">
                  Comprehensive collection of Disco Biscuits shows with detailed setlists, venue information, and
                  performance notes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-content-text-primary mb-2">Song Library</h3>
                <p className="text-content-text-secondary text-sm">
                  Complete catalog of original compositions and covers with performance history and statistical
                  analysis.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-content-text-primary mb-2">Fan Reviews</h3>
                <p className="text-content-text-secondary text-sm">
                  Community-driven reviews and ratings that capture the magic and energy of each performance.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-content-text-primary mb-2">Resources</h3>
                <p className="text-content-text-secondary text-sm">
                  Curated collection of band history, podcasts, mixes, and other fan-created content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-content">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-content-text-primary mb-4">Community Driven</h2>
            <p className="text-content-text-secondary mb-4">
              BIP thrives because of contributions from fans like you. Whether you're sharing setlists, writing reviews,
              or helping to improve our data, every contribution makes the community stronger.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton to="/auth/register">Join the Community</LinkButton>
              <ContactDialog>
                <Button className="btn-secondary">Get Involved</Button>
              </ContactDialog>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-content">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-content-text-primary mb-4">Disclaimer</h2>
            <p className="text-content-text-secondary text-sm">
              The Biscuits Internet Project is an unofficial fan site and is not affiliated with the Disco Biscuits,
              their management, or record label. All content is created by fans for fans, with deep respect and
              appreciation for the band and their music.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
