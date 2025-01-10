
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "./Token.sol";
import "./Pool.sol";
import "./Stacking.sol";
import "./Router.sol";

contract Factory {
    address public Owner;
    address public Tom = 0xf70A2E63F514fd1333E1Aa0B4Bcbb7D5F441b74f;
    address public Ben = 0x041A30878139321eE2E325E469d5D6e784A8b26d;
    address public Rick = 0xA7aD00977357963Cce7D3445E0843cE23E0F4838;
    Token public Gerda;
    Token public Krendel;
    Token public RTK;
    Token public Profi;
    Pool public GerdaKrendel;
    Stacking public stacking;
    Router public router;
    Pool public KrendelRTK;
    uint256 private gerdaKrendelRatio = 1500;
    uint256 private KrendelRTKRatio = 3000;
    uint256 private gerdaPrice = 10;
    uint256 private krendelPrice = 15;
    uint256 private RTKprice = 30;
    address[] public Pools;
    address[] public Tokens;
    mapping(address => string) users;

    constructor() {
        Owner = msg.sender;
        users[Owner] = "Owner";
        users[Tom] = "Tom";
        users[Ben] = "Ben";
        users[Rick] = "Rick";
        //Создание контрактов токенов
        Gerda = new Token("GerdaCoin", "GERDA", 100000, Owner);
        Krendel = new Token("KrendelCoin", "KRENDEL", 150000, Owner);
        RTK = new Token("RTKCoin", "RTK", 300000, Owner);
        Profi = new Token("Professional", "PROFI", 0, Owner);
        Tokens.push(address(Gerda));
        Tokens.push(address(Krendel));
        Tokens.push(address(RTK));
        //Создание контактов пулов
        GerdaKrendel = new Pool(
            "Gerda-Krendel",
            address(Gerda),
            address(Krendel),
            gerdaPrice,
            krendelPrice,
            address(Profi),
            Tom
        );
        KrendelRTK = new Pool(
            "Krendel-RTK",
            address(Krendel),
            address(RTK),
            krendelPrice,
            RTKprice,
            address(Profi),
            Ben
        );
        //Создание контракта стейкинга
        stacking = new Stacking(address(Profi));
        //Добавляю в пулы стартовое количество ликвидности по соотношению
        Gerda.mint(
            address(GerdaKrendel),
            ((gerdaKrendelRatio * 1 ether) / ((gerdaPrice * 1 ether) / 10)) *
                10**Gerda.decimals()
        );
        Krendel.mint(
            address(GerdaKrendel),
            ((gerdaKrendelRatio * 1 ether) / ((krendelPrice * 1 ether) / 10)) *
                10**Krendel.decimals()
        );
        Krendel.mint(
            address(KrendelRTK),
            ((KrendelRTKRatio * 1 ether) / ((krendelPrice * 1 ether) / 10)) *
                10**Krendel.decimals()
        );
        RTK.mint(
            address(KrendelRTK),
            ((KrendelRTKRatio * 1 ether) / ((RTKprice * 1 ether) / 10)) *
                10**RTK.decimals()
        );
        Pools.push(address(GerdaKrendel));
        Pools.push(address(KrendelRTK));
        router = new Router(Pools, Tokens);

    }

    //Функция для возвращения имени пользователя по адресу
    function returnUserName(address userAddr)
        external
        view
        returns (string memory)
    {
        return users[userAddr];
    }



    //Функция для создания пула принимает имя пула желательно чтобы было  в формате "Gerda-Krendel" , адрес первого токена и адрес второго токена
    //какие хотите чтобы менялись, цена первого и второго токена в формате чтобы подходила для деления на 10, адрес лп токена профи, стартовое соотношение в eth
    //На выходе создается новый пул
    function createPool(
        string memory poolName,
        address firstTokenAddress,
        address secondTokenAddress,
        uint256 firstTokenPrice,
        uint256 secondTokenPrice,
        address lpAddress,
        uint256 startingEthRatio
    ) public {
        Pool newPool = new Pool(
            poolName,
            firstTokenAddress,
            secondTokenAddress,
            firstTokenPrice,
            secondTokenPrice,
            lpAddress,
            msg.sender
        );
        Token firstToken = Token(firstTokenAddress);
        Token secondToken = Token(secondTokenAddress);
        firstToken.mint(
            address(newPool),
            ((startingEthRatio * 1 ether) /
                ((firstTokenPrice * 1 ether) / 10)) * 10**firstToken.decimals()
        );
        secondToken.mint(
            address(newPool),
            ((startingEthRatio * 1 ether) /
                ((secondTokenPrice * 1 ether) / 10)) *
                10**secondToken.decimals()
        );
        Pools.push(address(newPool));
        router = new Router(Pools, Tokens);
    }

    //Функция позволяет распределить какое то количество стартовых токенов нашим пользователям,  от Owner, принимает количество токенов, вызывает методы из интерфейса Token
    function giveStartTokensToUsers(uint256 amount) public {
        Gerda.giveStartTokensToUsers(amount);
        Krendel.giveStartTokensToUsers(amount);
        RTK.giveStartTokensToUsers(amount);
    }

    //Функция геттер для получения массивов адресов пулов
    function getAllPoolsAddress() external view returns (address[] memory) {
        return Pools;
    }

    //Функция для показа баланса пользователя который не лежит на стейкинге, возвращает число токенов
    function showNonStackedTokens(address sender)
        external
        view
        returns (uint256)
    {
        return stacking.showNonStackedTokens(sender);
    }

    //Функция для того чтобы положить лп токены на стейкинг контракт, принимает количество токенов
    function putLPProfi(uint256 amount, address sender) external {
        stacking.putLPProfi(amount, sender);
    }

    function getPoolName(address poolAddress)
        external
        view
        returns (string memory)
    {
        Pool pool = Pool(poolAddress);
        return pool.poolName();
    }

    //Функция для получения имени пула по адресу
    function getPoolNames(address[] calldata poolAddresses)
        external
        view
        returns (string[] memory)
    {
        string[] memory poolNames = new string[](poolAddresses.length);

        for (uint256 i = 0; i < poolAddresses.length; i++) {
            Pool pool = Pool(poolAddresses[i]);
            poolNames[i] = pool.poolName();
        }

        return poolNames;
    }

    //Функция для получения адреса владельца пула по адресу пула
    function getPoolOwner(address poolAddress) external view returns (address) {
        Pool pool = Pool(poolAddress);
        return pool.poolOwner();
    }

    //Функция для забирания награды со стейкинга
    function takeReward(address sender) external {
        stacking.takeReward(sender);
    }

    //Функция позволяет добавить ликвидность в пул на первый токен, принимает количество первого токена  которое заберется и попадет в пул
    function addFirstTokenLiquidity(
        address poolAddress,
        uint256 amount,
        address sender
    ) external {
        Pool pool = Pool(poolAddress);
        pool.addFirstTokenLiquidity(amount, sender);
    }

    //Функция позволяет добавить ликвидность в пул на второй токен, принимает количество второго токена которое заберется и попадет в пул
    function addSecondTokenLiquidity(
        address poolAddress,
        uint256 amount,
        address sender
    ) external {
        Pool pool = Pool(poolAddress);
        pool.addSecondTokenLiquidity(amount, sender);
    }

    //Функция для получения количество лп токенов на стейкинге
    function getValueAllStackingLP(address sender)
        external
        view
        returns (uint256)
    {
        return stacking.getValueAllStackingLP(sender);
    }

    //Функция для того чтобы забрать свои лп токены со стейкинга
    function returnMyStack(address sender) external {
        stacking.returnMyStack(sender);
    }

    //Функция для обмена токенов
    function tradeFirstToSecond(
        address poolAddress,
        uint256 amount,
        address sender
    ) external returns (uint256) {
        Pool pool = Pool(poolAddress);
        return pool.tradeFirstToSecond(amount, sender);
    }

    //Функция для обмена токенов
    function tradeSecondToFirst(
        address poolAddress,
        uint256 amount,
        address sender
    ) external returns (uint256) {
        Pool pool = Pool(poolAddress);
        return pool.tradeSecondToFirst(amount, sender);
    }

    //Функция для получения  резерва первого токена
    function getFirstTokenReserve(address poolAddress)
        external
        view
        returns (uint256)
    {
        Pool pool = Pool(poolAddress);
        return pool.getFirstTokenReserve();
    }

    //Функция для получения  резерва второго токена
    function getSecondTokenReserve(address poolAddress)
        public
        view
        returns (uint256)
    {
        Pool pool = Pool(poolAddress);
        return pool.getSecondTokenReserve();
    }

    //Функция для получения баланса токена, по адресу токена
    function getBalances(address sender)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory balances = new uint256[](4);
        balances[0] = Gerda.balanceOf(sender);
        balances[1] = Krendel.balanceOf(sender);
        balances[2] = RTK.balanceOf(sender);
        balances[3] = Profi.balanceOf(sender);
        return balances;
    }
    function multiSwap(address tokenFrom, address tokenTo, uint256 amount, address sender) external {
       return router.multiSwap( tokenFrom,  tokenTo,  amount, sender);
    }
     function findPath(address tokenFrom, address tokenTo) external view returns(address[] memory) {
       return router.findPath( tokenFrom,  tokenTo);
    }
        function getCorrespondanceMatrix() external view returns(address[][] memory) {
       return router.getCorrespondanceMatrix();
    }
    //Функция для возврата количества токенов которые пользователь положил на стейк
    function getMyStackingBalance(address sender)
        external
        view
        returns (uint256)
    {
        return stacking.getMyStackingBalance(sender);
    }
}
