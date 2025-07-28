import { Link } from "react-router-dom";
import { Card, CardContent } from "~/components/ui/card";

interface ResourceCardProps {
  title: string;
  content: string;
  image: string;
  url: string;
}

export default function ResourceCard({ title, content, image, url }: ResourceCardProps) {
  return (
    <Link to={url} className="block h-full no-underline">
      <Card className="h-full bg-content-bg border-content-bg-secondary hover:border-hover-accent transition-colors">
        <div className="overflow-hidden">
          <img
            className="w-full h-[250px] object-cover transition-transform duration-500 hover:scale-110"
            src={`/public/${image}`}
            alt={title}
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 text-white">{title}</h2>
          <p className="text-sm text-content-text-secondary">{content}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
