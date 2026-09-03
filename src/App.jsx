import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QuizProvider } from './context/QuizContext'
import Landing from './pages/Landing'
import Quiz from './pages/Quiz'
import Result from './pages/Result'

function App() {
  return (
    <BrowserRouter>
      <QuizProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/test" element={<Quiz />} />
          <Route path="/result" element={<Result />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </QuizProvider>
    </BrowserRouter>
  )
}

export default App
