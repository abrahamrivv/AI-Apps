// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract KOLPay {
    struct Deal {
        address client;
        address kol;
        uint256 amount;
        string deliverable;
        bool isReleased;
        bool isCancelled;
    }

    uint256 public dealCount;
    mapping(uint256 => Deal) public deals;

    event DealCreated(uint256 indexed dealId, address indexed client, address indexed kol, uint256 amount, string deliverable);
    event FundsReleased(uint256 indexed dealId, address indexed kol, uint256 amount);
    event DealCancelled(uint256 indexed dealId, address indexed client, uint256 amount);

    error NotClient();
    error DealAlreadySettled();
    error ZeroAmount();
    error InvalidKOL();

    function createDeal(address kol, string memory deliverable) external payable returns (uint256 dealId) {
        if (msg.value == 0) revert ZeroAmount();
        if (kol == address(0) || kol == msg.sender) revert InvalidKOL();

        dealId = dealCount++;
        deals[dealId] = Deal({
            client: msg.sender,
            kol: kol,
            amount: msg.value,
            deliverable: deliverable,
            isReleased: false,
            isCancelled: false
        });

        emit DealCreated(dealId, msg.sender, kol, msg.value, deliverable);
    }

    function releaseFunds(uint256 dealId) external {
        Deal storage deal = deals[dealId];
        if (msg.sender != deal.client) revert NotClient();
        if (deal.isReleased || deal.isCancelled) revert DealAlreadySettled();

        deal.isReleased = true;
        (bool ok,) = deal.kol.call{value: deal.amount}("");
        require(ok, "Transfer failed");

        emit FundsReleased(dealId, deal.kol, deal.amount);
    }

    function cancelDeal(uint256 dealId) external {
        Deal storage deal = deals[dealId];
        if (msg.sender != deal.client) revert NotClient();
        if (deal.isReleased || deal.isCancelled) revert DealAlreadySettled();

        deal.isCancelled = true;
        (bool ok,) = deal.client.call{value: deal.amount}("");
        require(ok, "Transfer failed");

        emit DealCancelled(dealId, deal.client, deal.amount);
    }

    function getDeal(uint256 dealId) external view returns (Deal memory) {
        return deals[dealId];
    }

    function getDealsForClient(address client) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < dealCount; i++) {
            if (deals[i].client == client) count++;
        }
        uint256[] memory result = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < dealCount; i++) {
            if (deals[i].client == client) result[idx++] = i;
        }
        return result;
    }

    function getDealsForKOL(address kol) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < dealCount; i++) {
            if (deals[i].kol == kol) count++;
        }
        uint256[] memory result = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < dealCount; i++) {
            if (deals[i].kol == kol) result[idx++] = i;
        }
        return result;
    }
}
