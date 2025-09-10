import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Footer from './components/footer/Footer'
import Navbar from './components/navbar/Navbar'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Cadastro from './pages/cadastro/Cadastro'
import { AuthProvider } from './contexts/AuthContext'
import ListaTemas from './components/tema/listatemas/ListaTemas'
import FormTema from './components/tema/formtema/FormTema'
import DeletarTema from './components/tema/deletartema/DeletarTema'
import ListaPostagens from './components/postagem/listapostagens/ListaPostagens'
import FormPostagem from './components/postagem/formpostagem/FormPostagem'
import DeletarPostagem from './components/postagem/deletarpostagem/DeletarPostagem'
import Perfil from './pages/perfil/Perfil'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'


function App() {
  return (
    <>
        <AuthProvider>
          <ToastContainer />
          <BrowserRouter>
            <Navbar />
              <div className="min-h-[80vh]">
                <Routes>
                  <Route path="/" element={<Login />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/cadastro" element={<Cadastro />} />
                  <Route path="/temas" element={<ListaTemas />} />
                  <Route path="/cadastrartema" element={<FormTema />} />
                  <Route path="/editartema/:id" element={<FormTema />} />
                  <Route path="/deletartema/:id" element={<DeletarTema />} />
                  <Route path="/postagens" element={<ListaPostagens />} />
                  <Route path="/cadastrarpostagem" element={<FormPostagem />} />
                  <Route path="/editarpostagem/:id" element={<FormPostagem />} />
                  <Route path="/deletarpostagem/:id" element={<DeletarPostagem />} />
                  <Route path="/perfil" element={<Perfil />} />
                </Routes>
              </div>
              <Footer />
          </BrowserRouter>
        </AuthProvider>
    </>
  )
}

export default App