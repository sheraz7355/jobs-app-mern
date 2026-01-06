import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateJob from './pages/CreateJob';
import SearchResults from './pages/SearchResults';
import TagResults from './pages/TagResults';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs/create" element={<CreateJob />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/tags/:name" element={<TagResults />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;

