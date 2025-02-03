import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DataProvider } from "./Components/DataProvider";
import Auth from "./Pages/Auth";
import Layout from "./Components/Layout";
import { BalanceList } from "./Pages/BalanceList";
import PoolsList from "./Pages/PoolsList";
import Stacking from "./Pages/Stacking";
import { path } from "./Components/Path";
import Router from "./Pages/Router";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <DataProvider>
                <Routes>
                    <Route path={path.auth} element={<Auth />} />
                    <Route path={path.app} element={<Layout><App /></Layout>} />
                    <Route path={path.poolsList} element={<Layout><PoolsList /></Layout>} />
                    <Route path={path.balanceList} element={<Layout><BalanceList /></Layout>} />
                    <Route path="*" element={<Layout><Auth /></Layout>} />
                    <Route path={path.stacking} element={<Layout><Stacking /></Layout>} />
                    <Route path={path.rooter} element={<Layout><Router /></Layout>} />
                </Routes>
            </DataProvider>
        </BrowserRouter>
    </React.StrictMode>
);