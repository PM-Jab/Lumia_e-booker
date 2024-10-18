import React from "react";
import Link from "next/link";

const SummaryButton = () => {
  return (
    <Link href="/summary">
      <button className="summary-button">Summary</button>
    </Link>
  );
};

export default SummaryButton;
