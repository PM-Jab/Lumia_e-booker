const SummaryPage = () => {
  return (
    <div className="flex">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Summary Page</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-8">
          In the chapter{" "}
          <span className="font-semibold">"No One's Crazy,"</span> the author
          highlights how people’s financial decisions are shaped by their unique
          life experiences, leading to behaviors that may seem irrational to
          outsiders but make perfect sense to those making the choices. <br />
          <br />
          Factors like generational influences, upbringing, economic conditions,
          and personal hardships create different perceptions of risk and
          reward. The author emphasizes that what appears "crazy" to one person
          is often rooted in deeply personal and contextual understanding of
          money. <br />
          <br />
          The chapter also touches on the role of luck and timing in financial
          success, illustrating that being born in certain economic eras can
          greatly influence financial outcomes. Moreover, the emotional impact
          of living through financial crises, like the Great Depression, leaves
          lasting scars that continue to shape decisions even decades later.{" "}
          <br />
          <br />
          The takeaway is that everyone’s relationship with money is complex and
          subjective, driven more by personal history than by pure logic or
          education.
        </p>

        <div className="flex space-x-4">
          <a
            href="/summary/keypoint"
            className="flex-1 text-center bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Key Points
          </a>
          <a
            href="/summary/uses-advantages"
            className="flex-1 text-center bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Uses and Advantages
          </a>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
