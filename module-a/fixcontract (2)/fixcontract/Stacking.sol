// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;
import "./Token.sol";

contract Stacking {
    address public Tom = 0xf70A2E63F514fd1333E1Aa0B4Bcbb7D5F441b74f;
    address public Ben = 0x041A30878139321eE2E325E469d5D6e784A8b26d;
    address public Rick = 0xA7aD00977357963Cce7D3445E0843cE23E0F4838;
    Token LPProfi;
    uint256 public rewardPerSecond = 13 * 6 ether;
    uint256 public TomLastReward;
    uint256 public BenLastReward;
    uint256 public RickLastReward;
    uint256 public TomLPBalance;
    uint256 public BenLPBalance;
    uint256 public RickLPBalance;

    constructor(
        address _lptokenAddress
    ) {

        LPProfi = Token(_lptokenAddress);
    }

    //Функция для показа баланса пользователя который не лежит на стейкинге, возвращает число токенов
    function showNonStackedTokens(address sender)
        external
        view
        returns (uint256)
    {
        return LPProfi.balanceOf(sender);
    }

    //Функция для того чтобы положить лп токены на стейкинг контракт, принимает количество токенов
    function putLPProfi(uint256 amount, address sender) external {
        if (sender == Ben) {
            BenLPBalance += amount;
            LPProfi.transferTokens(
                Ben,
                address(this),
                amount * 10**LPProfi.decimals()
            );
        }
        if (sender == Tom) {
            TomLPBalance += amount;
            LPProfi.transferTokens(
                Tom,
                address(this),
                amount * 10**LPProfi.decimals()
            );
        }
        if (sender == Rick) {
            RickLPBalance += amount;
            LPProfi.transferTokens(
                Rick,
                address(this),
                amount * 10**LPProfi.decimals()
            );
        }
    }

    //Функция для забирания награды со стейкинга
    function takeReward(address sender) external {
        uint256 reward;
        if (sender == Ben) {
            reward = (BenLPBalance *
                (block.timestamp - BenLastReward) *
                rewardPerSecond *
                (BenLPBalance /
                    (TomLPBalance + RickLPBalance + BenLPBalance + 1)) *
                ((((block.timestamp - BenLastReward) / 30 days) * 5) / 100) +
                1);

            BenLastReward = block.timestamp;
        }
        if (sender == Tom) {
            reward = (TomLPBalance *
                (block.timestamp - TomLastReward) *
                rewardPerSecond *
                (TomLPBalance /
                    (TomLPBalance + RickLPBalance + BenLPBalance + 1)) *
                ((((block.timestamp - TomLastReward) / 30 days) * 5) / 100) +
                1);

            TomLastReward = block.timestamp;
        }
        if (sender == Rick) {
            reward = (RickLPBalance *
                (block.timestamp - RickLastReward) *
                rewardPerSecond *
                (RickLPBalance /
                    (TomLPBalance + RickLPBalance + BenLPBalance + 1)) *
                ((((block.timestamp - RickLastReward) / 30 days) * 5) / 100) +
                1);
            RickLastReward = block.timestamp;
        }

        LPProfi.transferTokens(
            address(this),
            sender,
            reward * 10**LPProfi.decimals()
        );
    }

    //Функция для получения количество лп токенов на стейкинге
    function getValueAllStackingLP(address sender)
        external
        view
        returns (uint256)
    {
        return LPProfi.balanceOf(sender);
    }

    //Функция для того чтобы забрать свои лп токены со стейкинга
    function returnMyStack(address sender) external {
        if (sender == Ben) {
            LPProfi.transferTokens(address(this), Ben, BenLPBalance * 10 ** LPProfi.decimals());
            BenLPBalance = 0;
        }
        if (sender == Tom) {
            LPProfi.transferTokens(address(this), Tom, TomLPBalance* 10 ** LPProfi.decimals());
            TomLPBalance = 0;
        }
        if (sender == Rick) {
            LPProfi.transferTokens(address(this), Rick, RickLPBalance * 10 ** LPProfi.decimals());
            RickLPBalance = 0;
        }
    }

    //Функция для возврата количества токенов которые пользователь положил на стейк
    function getMyStackingBalance(address sender)
        external
        view
        returns (uint256)
    {
        if (sender == Tom) {
            return TomLPBalance;
        }
        if (sender == Ben) {
            return BenLPBalance;
        }
        if (sender == Rick) {
            return RickLPBalance;
        }
    }
}
