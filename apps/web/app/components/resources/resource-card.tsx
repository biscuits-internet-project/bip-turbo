import { Link } from "react-router-dom";
import { Card } from "~/components/ui/card";

interface ResourceCardProps {
  title: string;
  content: string;
  image: string;
  url: string;
}

export default function ResourceCard({ title, content, image, url }: ResourceCardProps) {
  return (
    <Link to={url} className="block h-full no-underline">
      <Card className="h-full card-premium hover:border-brand-primary/60 transition-all duration-300 overflow-hidden">
        <div className="relative h-[400px] overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            src={`/public/${image}`}
            alt={title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-2xl font-bold mb-3 text-white">{title}</h2>
            <p className="text-sm text-white/90 line-clamp-4">{content}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
