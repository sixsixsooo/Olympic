import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MainPage from './Pages/MainPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Profile from './Pages/Profile'
import Accounts from './Pages/Accounts'
import Start from './Pages/Start'
import { AppProvider } from './Components/AppContext'
import Pools from './Pages/Pools'
import Router from './Pages/Router'
import Stacking from './Pages/Stacking'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Start/>}/>
          <Route path="/main" element={<MainPage/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/accounts" element={<Accounts/>}/>
          <Route path="/pools" element={<Pools/>}/>
          <Route path="/router" element={<Router/>}/>
          <Route path="/stacking" element={<Router/>}/>
        </Routes>
      </AppProvider>
      
    </BrowserRouter>
  </StrictMode>,
)
