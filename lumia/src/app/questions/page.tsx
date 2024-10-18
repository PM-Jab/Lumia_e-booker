"use client";

const questionsPage = () => {
  const questions = [
    "Why does the author say that 'no one is crazy' with money?",
    "How do personal experiences shape financial decisions?",
    "How do generational differences impact attitudes towards money?",
  ];

  const handleSubmit = (event: React.FormEvent, questionIndex: number) => {
    event.preventDefault();
    // Identify which question was submitted
    console.log(`Form submitted for question: ${questions[questionIndex]}`);
    const form = event.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;
    console.log("Submitted answer:", input.value);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Questions Page</h1>

      <div className="w-full max-w-lg">
        {questions.map((question, index) => (
          <form
            key={index}
            onSubmit={(e) => handleSubmit(e, index)}
            className="mb-6"
          >
            <div>
              <p className="mb-2 text-lg font-medium">{question}</p>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        ))}
      </div>
    </main>
  );
};

export default questionsPage;
