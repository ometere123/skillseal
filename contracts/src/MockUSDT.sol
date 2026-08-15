// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract MockUSDT is ERC20 { constructor(address initialHolder, uint256 supply) ERC20("Demo USDT", "USDT") { _mint(initialHolder, supply); } function decimals() public pure override returns (uint8) { return 6; } }
