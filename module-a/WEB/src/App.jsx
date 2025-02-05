import { useNavigate } from "react-router-dom";
import { useData } from "./Components/DataProvider";
import { path } from "./Components/Path";

function App() {
  const navigate = useNavigate();
  const { selectedAccount } = useData() || {};

  const handleClickPoolsList = () => {
    navigate(path.poolsList);
  };

  const handleClickBalanceList = () => {
    navigate(path.balanceList);
  };

  const handleClickStacking = () => {
    navigate(path.stacking);
  };

  const handleClickRouter = () => {
    navigate(path.rooter);
  };

  return (
    <div>
      <h1>Приложение для обмена токенов</h1>
      <div className="forAuthorization">
        <button onClick={handleClickPoolsList}>
          Информация о существующих пулах в системе
        </button>
        <div>---</div>
        <button onClick={handleClickBalanceList}>
          Информация о вашем балансе токенов в системе
        </button>
        <div>---</div>
        <button onClick={handleClickStacking}>
          Информация о стейкинге токенов в системе
        </button>
        <div>---</div>
        <button onClick={handleClickRouter}>
          Информация о роутере в системе
        </button>
      </div>
    </div>
  );
}

export default App;
