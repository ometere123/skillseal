// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Minimal append-only registry and bounded native-token settlement reference for BOT Chain (EVM).
/// @dev Deploy only after independent review; no deployment is claimed by this repository.
contract SkillSeal {
    enum Risk { Low, Medium, High, Critical, Unknown }
    struct Version { bytes32 manifestDigest; address operator; address paymentDestination; uint64 publishedAt; bool exists; }
    struct Seal { bytes32 manifestDigest; Risk risk; uint64 expiresAt; address assessor; bool revoked; }
    struct Mandate { address owner; Risk maxRisk; uint128 maxAmount; uint128 maxDailyAmount; bool exists; }

    address public immutable assessor;
    mapping(bytes32 => mapping(uint64 => Version)) public versions;
    mapping(bytes32 => uint64) public currentVersion;
    mapping(bytes32 => mapping(bytes32 => Seal)) public seals;
    mapping(bytes32 => Mandate) public mandates;
    mapping(bytes32 => bool) public usedReceipt;
    mapping(address => uint256) public bonded;
    mapping(address => uint256) public pendingWithdrawals;
    bool private locked;

    event ToolRegistered(bytes32 indexed toolId, address indexed operator, uint64 version, bytes32 manifestDigest);
    event ManifestPublished(bytes32 indexed toolId, uint64 version, bytes32 manifestDigest, address paymentDestination);
    event SealIssued(bytes32 indexed toolId, bytes32 indexed manifestDigest, Risk risk, uint64 expiresAt);
    event MandateRegistered(bytes32 indexed mandateId, address indexed owner, Risk maxRisk, uint128 maxAmount, uint128 maxDailyAmount);
    event BondDeposited(address indexed operator, uint256 amount);
    event BondWithdrawalRequested(address indexed operator, uint256 amount);
    event InvocationSettled(bytes32 indexed receiptId, bytes32 indexed toolId, uint64 version, address recipient, uint256 amount);

    error Unauthorized(); error InvalidState(); error PaymentBlocked(); error ReceiptUsed(); error TransferFailed();
    modifier onlyAssessor() { if (msg.sender != assessor) revert Unauthorized(); _; }
    modifier noReenter() { if (locked) revert InvalidState(); locked = true; _; locked = false; }
    constructor(address assessor_) { if (assessor_ == address(0)) revert InvalidState(); assessor = assessor_; }

    function publish(bytes32 toolId, bytes32 digest, address destination) external {
        if (toolId == bytes32(0) || digest == bytes32(0) || destination == address(0)) revert InvalidState();
        uint64 version = currentVersion[toolId] + 1;
        versions[toolId][version] = Version(digest, msg.sender, destination, uint64(block.timestamp), true);
        currentVersion[toolId] = version;
        if (version == 1) emit ToolRegistered(toolId, msg.sender, version, digest);
        emit ManifestPublished(toolId, version, digest, destination);
    }
    function issueSeal(bytes32 toolId, bytes32 digest, Risk risk, uint64 expiresAt) external onlyAssessor {
        Version memory version = versions[toolId][currentVersion[toolId]];
        if (!version.exists || version.manifestDigest != digest || expiresAt <= block.timestamp) revert InvalidState();
        seals[toolId][digest] = Seal(digest, risk, expiresAt, msg.sender, false);
        emit SealIssued(toolId, digest, risk, expiresAt);
    }
    function registerMandate(bytes32 mandateId, Risk maxRisk, uint128 maxAmount, uint128 maxDailyAmount) external {
        if (mandateId == bytes32(0) || maxAmount == 0 || maxDailyAmount < maxAmount) revert InvalidState();
        mandates[mandateId] = Mandate(msg.sender, maxRisk, maxAmount, maxDailyAmount, true);
        emit MandateRegistered(mandateId, msg.sender, maxRisk, maxAmount, maxDailyAmount);
    }
    function depositBond() external payable { if (msg.value == 0) revert InvalidState(); bonded[msg.sender] += msg.value; emit BondDeposited(msg.sender, msg.value); }
    function requestBondWithdrawal(uint256 amount) external { if (amount == 0 || amount > bonded[msg.sender]) revert InvalidState(); bonded[msg.sender] -= amount; pendingWithdrawals[msg.sender] += amount; emit BondWithdrawalRequested(msg.sender, amount); }
    function withdrawBond() external noReenter { uint256 amount = pendingWithdrawals[msg.sender]; if (amount == 0) revert InvalidState(); pendingWithdrawals[msg.sender] = 0; (bool ok,) = msg.sender.call{value: amount}(""); if (!ok) revert TransferFailed(); }
    function settle(bytes32 receiptId, bytes32 toolId, bytes32 mandateId, bytes32 expectedDigest, uint256 amount) external payable noReenter {
        if (usedReceipt[receiptId]) revert ReceiptUsed(); Version memory version = versions[toolId][currentVersion[toolId]]; Mandate memory mandate = mandates[mandateId]; Seal memory seal = seals[toolId][expectedDigest];
        if (!version.exists || !mandate.exists || mandate.owner != msg.sender || version.manifestDigest != expectedDigest || seal.revoked || seal.expiresAt <= block.timestamp || uint8(seal.risk) > uint8(mandate.maxRisk) || amount > mandate.maxAmount || msg.value != amount) revert PaymentBlocked();
        usedReceipt[receiptId] = true; (bool ok,) = version.paymentDestination.call{value: amount}(""); if (!ok) revert TransferFailed(); emit InvocationSettled(receiptId, toolId, currentVersion[toolId], version.paymentDestination, amount);
    }
}
