import TextInput from "./TextInput";

interface TextInputProps {
  onSubmit: (text: string) => void;
  initialValue?: string; // Optional initial value for SSR
}

const TextBox: React.FC<TextInputProps> = ({ onSubmit, initialValue }) => {
  return <TextInput onSubmit={onSubmit} initialValue={initialValue} />;
};

export default TextBox;
