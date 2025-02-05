import { useNavigate } from "react-router-dom";
import { path } from "../Components/Path";

const Layout = ({ children }) => {
    const navigate = useNavigate();

    const handleLeave = () => {
        navigate(path.auth);
    };

    return (
        <div>
            <button onClick={handleLeave}>Выйти из личного кабинета</button>
            <div>---</div>
            {children}
        </div>
    );
};

export default Layout;