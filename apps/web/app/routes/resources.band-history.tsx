import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "~/components/ui/card";
import { publicLoader } from "~/lib/base-loaders";

// Define types for our data
interface BandMember {
  name: string;
  instrument: string;
  twitter: string;
}

interface BandHistoryData {
  currentMembers: BandMember[];
}

// Add a loader function
export const loader = publicLoader<void>(async () => {});

// Define metadata for the route
export function meta() {
  return [
    { title: "Band History" },
    {
      name: "description",
      content:
        "From their early days in Philadelphia as Zex Sea to their current lineup as The Disco Biscuits, read more about the band members, who they are, and how they came together.",
    },
  ];
}

const BandHistory: React.FC = () => {
  const [data, setData] = useState<BandHistoryData>({
    currentMembers: [
      { name: "Jon Gutwillig", instrument: "Guitar", twitter: "https://twitter.com/BarberShreds" },
      { name: "Marc Brownstein", instrument: "Bass", twitter: "https://twitter.com/Marc_Brownstein" },
      { name: "Aron Magner", instrument: "Keys", twitter: "https://twitter.com/aronmagner" },
      { name: "Allen Aucoin", instrument: "Drums", twitter: "https://twitter.com/DrFameus" },
    ],
  });

  const TwitterIcon = ({ url }: { url: string }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block ml-2 pt-1">
      <img src="/twitter.png" alt="twitter" className="inline-block" />
    </a>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Band History</h1>
    </div>
  );
};

export default BandHistory;
