import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import ChapterPage from './pages/ChapterPage'
import QuestionsPage from './pages/QuestionsPage'
import CheatsheetPage from './pages/CheatsheetPage'
import EcosystemPage from './pages/EcosystemPage'
import LabPage from './pages/LabPage'
import LabStepPage from './pages/LabStepPage'
import ChangelogPage from './pages/ChangelogPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chapter/:id" element={<ChapterPage />} />
      <Route path="/questions" element={<QuestionsPage />} />
      <Route path="/cheatsheet" element={<CheatsheetPage />} />
      <Route path="/ecosystem" element={<EcosystemPage />} />
      <Route path="/lab" element={<LabPage />} />
      <Route path="/lab/:step" element={<LabStepPage />} />
      <Route path="/changelog" element={<ChangelogPage />} />
    </Routes>
  )
}
