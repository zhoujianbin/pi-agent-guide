import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import ChapterPage from './pages/ChapterPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chapter/:id" element={<ChapterPage />} />
    </Routes>
  )
}
