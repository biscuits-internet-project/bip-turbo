import type { ReviewMinimal } from "@bip/domain";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

interface ReviewCardProps {
  review: ReviewMinimal;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="border-gray-800 bg-gradient-to-br from-gray-900 to-gray-900/80 overflow-hidden transition-all duration-300 hover:shadow-md hover:shadow-purple-900/20">
      <CardHeader className="border-b border-gray-800/50 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 font-medium shadow-inner shadow-purple-950/50">
              {review.user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium text-gray-200">{review.user.username}</h3>
              <p className="text-sm text-gray-400">{format(new Date(review.createdAt), "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <div className="prose prose-invert prose-sm max-w-none text-gray-300">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              h1: ({ children }) => <h1 className="text-xl font-bold mb-4 text-white">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-bold mb-3 text-white">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-bold mb-2 text-white">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-purple-700 pl-4 italic text-gray-400 mb-4">
                  {children}
                </blockquote>
              ),
            }}
          >
            {review.content}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
