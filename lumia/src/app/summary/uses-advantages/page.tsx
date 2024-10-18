"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Item {
  title: string;
  use: string;
  advantage: string;
}

const items: Item[] = [
  {
    title: "Increased Empathy for Others' Financial Decisions",
    use: "The chapter encourages readers to understand that people make financial decisions based on their unique life experiences.",
    advantage:
      "This understanding helps reduce judgment of others' financial choices, allowing for more open-mindedness in personal relationships and discussions about money.",
  },
  {
    title: "Better Self-Awareness",
    use: "By recognizing that your own financial decisions are shaped by your personal experiences, the chapter encourages self-reflection on how your past influences your present behavior with money.",
    advantage:
      "Increased self-awareness can lead to better financial decision-making, as you identify biases or tendencies rooted in past experiences rather than rational analysis.",
  },
  {
    title: "Understanding the Role of Luck",
    use: "The chapter discusses how financial success is often influenced by timing and luck, not just skill or effort.",
    advantage:
      "Recognizing the role of luck can prevent overconfidence when things go well or excessive self-blame when they don't, leading to a healthier emotional approach to financial outcomes.",
  },
  {
    title: "Preparation for Financial Crises",
    use: "The chapter's discussion on emotional scars from financial crises provides insights into the importance of mental and emotional resilience in times of economic downturn.",
    advantage:
      "Readers gain awareness of the importance of preparing for financial crises not only practically but also emotionally, helping them make better decisions when faced with difficult economic situations.",
  },
  {
    title: "Appreciation for Generational Differences",
    use: "It highlights how different generations view risk, reward, and financial security, helping readers understand why younger or older people might behave differently with money.",
    advantage:
      "This understanding is useful in intergenerational communication, especially within families, financial planning, and managing expectations across age groups.",
  },
];

const ReadingUsesAdvantages: React.FC = () => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Reading Uses and Advantages
      </h2>
      {items.map((item, index) => (
        <Card
          key={index}
          className="mb-4 hover:shadow-lg transition-shadow duration-300"
        >
          <CardHeader
            className="cursor-pointer flex justify-between items-center"
            onClick={() => toggleItem(index)}
          >
            <CardTitle>
              {index + 1}. {item.title}
            </CardTitle>
            {expandedItem === index ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} />
            )}
          </CardHeader>
          {expandedItem === index && (
            <CardContent>
              <p className="mb-2">
                <span className="font-semibold">Use:</span> {item.use}
              </p>
              <p>
                <span className="font-semibold">Advantage:</span>{" "}
                {item.advantage}
              </p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ReadingUsesAdvantages;
