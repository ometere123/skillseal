// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract SkillSealRegistry is AccessControl {
    bytes32 public constant ASSESSOR_ROLE = keccak256("ASSESSOR_ROLE");
    uint64 public constant BOND_COOLDOWN = 1 days;
    enum Risk { LOW, MEDIUM, HIGH, CRITICAL, UNKNOWN }
    struct Tool { address operator; uint64 currentVersion; bool exists; }
    struct ToolVersion { bytes32 manifestDigest; address paymentDestination; uint64 publishedAt; bool exists; }
    struct Seal { bytes32 manifestDigest; bytes32 assessmentDigest; address assessor; uint64 version; uint64 issuedAt; uint64 expiresAt; Risk risk; bool revoked; }
    struct Mandate { address owner; bytes32 mandateDigest; Risk maxRisk; uint128 maxAmountPerInvocation; uint128 maxDailyAmount; bool exists; }
    struct Bond { uint128 active; uint128 pending; uint64 availableAt; }
    mapping(bytes32 => Tool) public tools;
    mapping(bytes32 => mapping(uint64 => ToolVersion)) public versions;
    mapping(bytes32 => mapping(uint64 => Seal)) public seals;
    mapping(bytes32 => Mandate) public mandates;
    mapping(address => Bond) public bonds;
    event ToolRegistered(bytes32 indexed toolId, address indexed operator);
    event ManifestPublished(bytes32 indexed toolId, uint64 indexed version, bytes32 manifestDigest, address paymentDestination);
    event SealIssued(bytes32 indexed toolId, uint64 indexed version, bytes32 manifestDigest, bytes32 assessmentDigest, Risk risk, uint64 expiresAt);
    event SealRevoked(bytes32 indexed toolId, uint64 indexed version, address indexed assessor);
    event MandateRegistered(bytes32 indexed mandateId, address indexed owner, bytes32 mandateDigest, Risk maxRisk, uint128 maxPerInvocation, uint128 maxDaily);
    event BondDeposited(address indexed operator, uint128 amount);
    event BondWithdrawalRequested(address indexed operator, uint128 amount, uint64 availableAt);
    event BondWithdrawn(address indexed operator, uint128 amount);
    error ZeroValue(); error AlreadyExists(); error Missing(); error Unauthorized(); error InvalidState(); error TransferFailed();
    constructor(address admin, address assessor) { if (admin == address(0) || assessor == address(0)) revert ZeroValue(); _grantRole(DEFAULT_ADMIN_ROLE, admin); _grantRole(ASSESSOR_ROLE, assessor); }
    function registerTool(bytes32 toolId) external { if (toolId == bytes32(0)) revert ZeroValue(); if (tools[toolId].exists) revert AlreadyExists(); tools[toolId] = Tool(msg.sender, 0, true); emit ToolRegistered(toolId, msg.sender); }
    function publishVersion(bytes32 toolId, bytes32 manifestDigest, address paymentDestination) external { Tool storage tool = tools[toolId]; if (!tool.exists) revert Missing(); if (tool.operator != msg.sender) revert Unauthorized(); if (manifestDigest == bytes32(0) || paymentDestination == address(0)) revert ZeroValue(); uint64 version = tool.currentVersion + 1; tool.currentVersion = version; versions[toolId][version] = ToolVersion(manifestDigest, paymentDestination, uint64(block.timestamp), true); emit ManifestPublished(toolId, version, manifestDigest, paymentDestination); }
    function issueSeal(bytes32 toolId, uint64 version, bytes32 manifestDigest, bytes32 assessmentDigest, Risk risk, uint64 expiresAt) external onlyRole(ASSESSOR_ROLE) { Tool storage tool = tools[toolId]; ToolVersion memory published = versions[toolId][version]; if (!tool.exists || !published.exists || version != tool.currentVersion || published.manifestDigest != manifestDigest || assessmentDigest == bytes32(0) || expiresAt <= block.timestamp) revert InvalidState(); seals[toolId][version] = Seal(manifestDigest, assessmentDigest, msg.sender, version, uint64(block.timestamp), expiresAt, risk, false); emit SealIssued(toolId, version, manifestDigest, assessmentDigest, risk, expiresAt); }
    function revokeSeal(bytes32 toolId, uint64 version) external onlyRole(ASSESSOR_ROLE) { Seal storage seal = seals[toolId][version]; if (seal.issuedAt == 0) revert Missing(); seal.revoked = true; emit SealRevoked(toolId, version, msg.sender); }
    function registerMandate(bytes32 mandateId, bytes32 mandateDigest, Risk maxRisk, uint128 maxPerInvocation, uint128 maxDaily) external { if (mandateId == bytes32(0) || mandateDigest == bytes32(0) || maxPerInvocation == 0 || maxDaily < maxPerInvocation) revert InvalidState(); if (mandates[mandateId].exists) revert AlreadyExists(); mandates[mandateId] = Mandate(msg.sender, mandateDigest, maxRisk, maxPerInvocation, maxDaily, true); emit MandateRegistered(mandateId, msg.sender, mandateDigest, maxRisk, maxPerInvocation, maxDaily); }
    function validateSettlement(bytes32 toolId, bytes32 mandateId, uint64 version, bytes32 digest, address caller, uint256 amount) external view returns (address) { Tool memory tool = tools[toolId]; ToolVersion memory published = versions[toolId][version]; Seal memory seal = seals[toolId][version]; Mandate memory mandate = mandates[mandateId]; if (!tool.exists || !published.exists || !mandate.exists || mandate.owner != caller || tool.currentVersion != version || published.manifestDigest != digest || seal.version != version || seal.manifestDigest != digest || seal.revoked || seal.expiresAt <= block.timestamp || uint8(seal.risk) > uint8(mandate.maxRisk) || amount > mandate.maxAmountPerInvocation) revert InvalidState(); return published.paymentDestination; }
    function depositBond() external payable { if (msg.value == 0 || msg.value > type(uint128).max) revert InvalidState(); bonds[msg.sender].active += uint128(msg.value); emit BondDeposited(msg.sender, uint128(msg.value)); }
    function requestBondWithdrawal(uint128 amount) external { Bond storage bond = bonds[msg.sender]; if (amount == 0 || amount > bond.active) revert InvalidState(); bond.active -= amount; bond.pending += amount; bond.availableAt = uint64(block.timestamp + BOND_COOLDOWN); emit BondWithdrawalRequested(msg.sender, amount, bond.availableAt); }
    function withdrawBond() external { Bond storage bond = bonds[msg.sender]; uint128 amount = bond.pending; if (amount == 0 || block.timestamp < bond.availableAt) revert InvalidState(); bond.pending = 0; bond.availableAt = 0; (bool ok,) = msg.sender.call{value: amount}(""); if (!ok) revert TransferFailed(); emit BondWithdrawn(msg.sender, amount); }
}
