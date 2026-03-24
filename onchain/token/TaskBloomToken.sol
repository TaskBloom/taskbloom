// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {Nonces} from "openzeppelin-contracts/contracts/utils/Nonces.sol";

contract TaskBloomToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    uint256 public constant MAX_SUPPLY = 10_000_000e18;

    constructor(address initialHolder)
        ERC20("TaskBloom Governance Token", "TBLOOM")
        ERC20Permit("TaskBloom Governance Token")
        Ownable(initialHolder)
    {
        _mint(initialHolder, MAX_SUPPLY);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "MAX_SUPPLY_EXCEEDED");
        _mint(to, amount);
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
