import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import ChapterPage from './pages/ChapterPage'
import QuestionsPage from './pages/QuestionsPage'
import CheatsheetPage from './pages/CheatsheetPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chapter/:id" element={<ChapterPage />} />
      <Route path="/questions" element={<QuestionsPage />} />
      <Route path="/cheatsheet" element={<CheatsheetPage />} />
    </Routes>
  )
}
