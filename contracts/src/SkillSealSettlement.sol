// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ISkillSealRegistry { function validateSettlement(bytes32, bytes32, uint64, bytes32, address, uint256) external view returns (address); function mandates(bytes32) external view returns (address, bytes32, uint8, uint128, uint128, bool); }
contract SkillSealSettlement is ReentrancyGuard {
    using SafeERC20 for IERC20;
    ISkillSealRegistry public immutable registry; IERC20 public immutable paymentToken;
    mapping(bytes32 => bool) public usedReceipts;
    mapping(bytes32 => mapping(uint256 => uint256)) public spentByEpoch;
    event InvocationSettled(bytes32 indexed receiptId, bytes32 indexed toolId, bytes32 indexed mandateId, uint64 version, address recipient, uint256 amount, uint256 epoch);
    error ReceiptUsed(); error DailyCapExceeded();
    constructor(address registry_, address token_) { registry = ISkillSealRegistry(registry_); paymentToken = IERC20(token_); }
    function settleInvocation(bytes32 receiptId, bytes32 toolId, bytes32 mandateId, uint64 version, bytes32 manifestDigest, uint256 amount) external nonReentrant { if (usedReceipts[receiptId]) revert ReceiptUsed(); address recipient = registry.validateSettlement(toolId, mandateId, version, manifestDigest, msg.sender, amount); (,,,,uint128 maxDaily,) = registry.mandates(mandateId); uint256 epoch = block.timestamp / 1 days; if (spentByEpoch[mandateId][epoch] + amount > maxDaily) revert DailyCapExceeded(); usedReceipts[receiptId] = true; spentByEpoch[mandateId][epoch] += amount; paymentToken.safeTransferFrom(msg.sender, recipient, amount); emit InvocationSettled(receiptId, toolId, mandateId, version, recipient, amount, epoch); }
}
