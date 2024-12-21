import { useNavigate } from "react-router-dom"

const MainPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h1>Добро пожаловать!</h1>
      <button onClick={() => handleNavigate("/profile")}>Профиль</button>
      <button onClick={() => handleNavigate("/accounts")}>Контракт</button>
      <button onClick={() => handleNavigate("/pools")}>Пулы</button>
      <button onClick={() => handleNavigate("/router")}>Роутер</button>
      <button onClick={() => handleNavigate("/stacking")}>Стейкинг</button>
    </div>
  )
}
export default MainPage
