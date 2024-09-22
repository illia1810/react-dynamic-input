import React from "react";
import "./App.css";
import { DynamicInput } from "./components/DynamicInput";

function App() {
  const tagsArr = ["React", "Next.js", "Tailwind", "JavaScript", "CSS"];
  return <DynamicInput suggestedTags={tagsArr} />;
}

export default App;
