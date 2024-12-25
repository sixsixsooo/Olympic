// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./Pool.sol";

contract Router {
    address[] public pools;
    address[] public tokens;

    constructor(address[] memory _pools, address[] memory _tokens) {
        pools = _pools;
        tokens = _tokens;
    }

    function getCorrespondanceMatrix()
        public
        view
        returns (address[][] memory)
    {
        address[][] memory matrix = new address[][](tokens.length);
        for (uint256 i = 0; i < tokens.length; i++) {
            matrix[i] = new address[](pools.length);
            for (uint256 j = 0; j < pools.length; j++) { 
                Pool pool = Pool(pools[j]);
                if (pool.getFirstToken() == tokens[i]) {
                    matrix[i][j] = pool.getSecondToken();
                } else if (pool.getSecondToken() == tokens[i]) {
                    matrix[i][j] = pool.getFirstToken();
                }
             }
        }      
        return matrix;
    }

    function findPool(address tokenA, address tokenB)
        internal
        view
        returns (address)
    {
        for (uint256 i = 0; i < pools.length; i++) {
            Pool pool = Pool(pools[i]);
            if (
                (pool.getFirstToken() == tokenA &&
                    pool.getSecondToken() == tokenB) ||
                (pool.getFirstToken() == tokenB &&
                    pool.getSecondToken() == tokenA)
            ) {
                return pools[i];
            }
        }
        revert("Pool not found");
    }

    function multiSwap(
        address tokenFrom,
        address tokenTo,
        uint256 amount,
        address sender
    ) public {
        address[] memory path = findPath(tokenFrom, tokenTo);
        require(path.length > 0, "No path found");

        uint256 amountIn = amount;
        for (uint256 i = 0; i < path.length - 1; i++) {
            amountIn = Pool(findPool(path[i], path[i + 1])).tradeTokens(
                path[i],
                path[i + 1],
                amountIn,
                sender
            );
        }
    }

    function findPath(address tokenFrom, address tokenTo)
        public
        view
        returns (address[] memory)
    {
        
        require(tokenFrom != tokenTo, "Tokens are the same");
        address[][] memory matrix = getCorrespondanceMatrix();
        uint256 startIndex = findTokenIndex(tokenFrom);
        uint256 endIndex = findTokenIndex(tokenTo);
        require(
            startIndex < tokens.length && endIndex < tokens.length,
            "Token not found"
        );

        address[] memory path = new address[](tokens.length);
        bool[] memory visited = new bool[](tokens.length);
        uint256 pathLength = 0;

        if (dfs(startIndex, endIndex, matrix, path, visited, pathLength)) {
            return path;
        } else {
            revert("Path not found");
        }
    }

    function dfs(
        uint256 current,
        uint256 target,
        address[][] memory matrix,
        address[] memory path,
        bool[] memory visited,
        uint256 pathLength
    ) internal view returns (bool) {
        visited[current] = true;
        path[pathLength++] = tokens[current];

        if (current == target) return true;

        for (uint256 j = 0; j < matrix[current].length; j++) {
            uint256 neighborIndex = findTokenIndex(matrix[current][j]);
            
            if (!visited[neighborIndex]) {
                if (
                    dfs(
                        neighborIndex,
                        target,
                        matrix,
                        path,
                        visited,
                        pathLength
                    )
                ) return true;
            }
        }
        visited[current] = false;
        return false;
    }

    function findTokenIndex(address token) internal view returns (uint256) {
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == token) return i;
        }
        revert("Token not found");
    }    
}