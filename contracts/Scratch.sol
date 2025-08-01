// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract Scratch {
    event PaymentSent(
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        string message,
        uint256 timestamp,
        bytes32 indexed paymentId
    );

    uint256 private paymentCounter;

    address public owner;

     function sendPayment(
        address payable _recipient,
        string calldata _message
    ) external payable nonReentrant {
        require(msg.value > 0, "Payment must be greater than 0");
        require(_recipient != address(0), "Invalid recipient");
        require(_recipient != msg.sender, "Cannot pay yourself");
        
        uint256 fee = (msg.value) / 100000;
        uint256 netAmount = msg.value - fee;
        
        paymentCounter++;
        bytes32 paymentId = keccak256(abi.encodePacked(
            msg.sender,
            _recipient,
            msg.value,
            block.timestamp,
            paymentCounter
        ));
        
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
    
    
    
    }
}


