// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
import "./ERC20.sol";

contract Token is ERC20 {
    address public Owner;
    address public Tom = 0x6f5c8CFc8FC4fF2C003d5d4Dfe6673F23E17ee4c;
    address public Ben = 0xe40ec4fBd2Dd72CA3E9A825B570c2182370d0569;
    address public Rick = 0xB0c9eB3164E940df84FDdc65167AA00AA466AE5b;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address owner
    ) ERC20(name, symbol) {
        Owner = owner;
        //Выпуск токен
        mint(Owner, initialSupply * 10**decimals());
    }

    //Самописная функция для перевода токенов, принимает адрес от кого хотите передать, кому хотите, количество
    //Возвращает в случее успеха true
    function transferTokens(
        address from,
        address to,
        uint256 amount
    ) public returns (bool) {
        _transfer(from, to, amount);

        return true;
    }

    //Самописная функция для выпуска токенов принимает адрес кому на баланс токены попадут, и количество токенов
    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    //Функция для выдачи стартовых токенов 3 пользователям Tom,Rick, Ben .принимает количество токенов
    function giveStartTokensToUsers(uint256 amount) external {
        transferTokens(Owner, Tom, amount * 10**decimals());
        transferTokens(Owner, Ben, amount * 10**decimals());
        transferTokens(Owner, Rick, amount * 10**decimals());
    }

    //Функция для вывода количество десятичных знаков у токена по умолчанию 12, возвращает количество десятичных знаков
    function decimals() public pure override returns (uint8) {
        return 12;
    }
}
