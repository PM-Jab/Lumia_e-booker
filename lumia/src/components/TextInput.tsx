import React from "react";

interface TextInputProps {
  onSubmit: (text: string) => void;
  initialValue?: string; // Optional initial value for SSR
}

const TextInput: React.FC<TextInputProps> = ({
  onSubmit,
  initialValue = "",
}) => {
  const [text, setText] = React.useState(initialValue);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(text);
    setText(""); // Clear the textarea after submission
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center bg-slate-500 p-8"
    >
      <textarea
        className="bg-white p-4 rounded resize-none text-lg shadow-md mb-4"
        style={{ width: "600px", height: "400px" }}
        placeholder="Start typing or paste your content here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex w-full justify-between">
        <button>file</button>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default TextInput;
