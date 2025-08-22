// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Scratch is ReentrancyGuard {
    event PaymentSent(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        string message,
        uint256 timestamp,
        bytes32 indexed paymentId
    );

    uint256 public platformFee = 0; // for now
    uint256 private paymentCounter;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function sendPayment(
        address payable _recipient,
        string calldata _message
    ) external payable nonReentrant {
        require(msg.value > 0, "Payment must be greater than 0");
        require(_recipient != address(0), "Invalid recipient");
        require(_recipient != msg.sender, "Cannot pay yourself");
        
        
        uint256 fee = (msg.value * platformFee) / 10000;
        uint256 netAmount = msg.value - fee;

        paymentCounter++;
        bytes32 paymentId = keccak256(
            abi.encodePacked(
                msg.sender,
                _recipient,
                msg.value,
                block.timestamp,
                paymentCounter
            )
        );
        _recipient.transfer(netAmount);

        if (fee > 0 && owner != address(0)) {
            payable(owner).transfer(fee);
        }

        emit PaymentSent(
            msg.sender,
            _recipient,
            netAmount,
            _message,
            block.timestamp,
            paymentId
        );
    }

    function updateFee(uint256 _newFee) external {
        require(msg.sender == owner, "Only owner");
        require(_newFee <= 1000, "Max 10% fee");
        platformFee = _newFee;
    }

    function updateOwner(address _newOwner) external {
        require(msg.sender == owner, "Only owner");
        owner = _newOwner;
    }

    function getChainId() external view returns (uint256) {
        return block.chainid;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {
        revert("Use sendPayment function");
    }
}
