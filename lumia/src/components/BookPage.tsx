import { exampleBookPage } from "@/constants/book";

const BookPage = (pageNum = 0) => {
  return <div className="w-73">{exampleBookPage[pageNum]}</div>;
};

export default BookPage;
