// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract TaskBloomEscrow is Ownable {
    using SafeERC20 for IERC20;
    enum JobStatus {
        None,
        Funded,
        Accepted,
        InDispute,
        Completed,
        Cancelled
    }

    struct Job {
        address poster;
        address worker;
        address token;
        uint256 totalAmount;
        uint256 releasedAmount;
        uint16 feeBps;
        uint8 milestoneCount;
        JobStatus status;
    }

    mapping(uint256 => Job) public jobs;
    mapping(uint256 => mapping(uint8 => uint256)) public milestoneAmounts;
    mapping(uint256 => mapping(uint8 => bool)) public milestoneReleased;

    address public feeTreasury;
    uint256 public nextJobId = 1;

    event JobCreated(uint256 indexed jobId, address indexed poster, address indexed token, uint256 amount);
    event JobAccepted(uint256 indexed jobId, address indexed worker);
    event MilestoneReleased(uint256 indexed jobId, uint8 indexed milestoneIndex, uint256 workerAmount, uint256 feeAmount);
    event DisputeOpened(uint256 indexed jobId);
    event JobCompleted(uint256 indexed jobId);
    event JobCancelled(uint256 indexed jobId);

    constructor(address initialOwner, address _feeTreasury) Ownable(initialOwner) {
        require(_feeTreasury != address(0), "INVALID_TREASURY");
        feeTreasury = _feeTreasury;
    }

    function setFeeTreasury(address _feeTreasury) external onlyOwner {
        require(_feeTreasury != address(0), "INVALID_TREASURY");
        feeTreasury = _feeTreasury;
    }

    function createJob(
        address token,
        uint256 totalAmount,
        uint16 feeBps,
        uint256[] calldata milestones
    ) external returns (uint256 jobId) {
        require(token != address(0), "INVALID_TOKEN");
        require(totalAmount > 0, "INVALID_AMOUNT");
        require(milestones.length > 0 && milestones.length <= type(uint8).max, "INVALID_MILESTONES");
        require(feeBps <= 2_000, "FEE_TOO_HIGH");

        uint256 sum;
        for (uint256 i = 0; i < milestones.length; i++) {
            sum += milestones[i];
        }
        require(sum == totalAmount, "MILESTONE_SUM_MISMATCH");

        jobId = nextJobId++;

        jobs[jobId] = Job({
            poster: msg.sender,
            worker: address(0),
            token: token,
            totalAmount: totalAmount,
            releasedAmount: 0,
            feeBps: feeBps,
            milestoneCount: uint8(milestones.length),
            status: JobStatus.Funded
        });

        for (uint8 i = 0; i < milestones.length; i++) {
            milestoneAmounts[jobId][i] = milestones[i];
        }

        IERC20(token).safeTransferFrom(msg.sender, address(this), totalAmount);

        emit JobCreated(jobId, msg.sender, token, totalAmount);
    }

    function acceptJob(uint256 jobId, address worker) external {
        Job storage job = jobs[jobId];
        require(job.poster == msg.sender, "NOT_POSTER");
        require(job.status == JobStatus.Funded, "INVALID_STATUS");
        require(worker != address(0), "INVALID_WORKER");

        job.worker = worker;
        job.status = JobStatus.Accepted;

        emit JobAccepted(jobId, worker);
    }

    function releaseMilestone(uint256 jobId, uint8 milestoneIndex) external {
        Job storage job = jobs[jobId];
        require(msg.sender == job.poster || msg.sender == owner(), "NOT_AUTHORIZED");
        require(job.status == JobStatus.Accepted || job.status == JobStatus.InDispute, "INVALID_STATUS");
        require(!milestoneReleased[jobId][milestoneIndex], "MILESTONE_ALREADY_RELEASED");
        require(milestoneIndex < job.milestoneCount, "INVALID_MILESTONE");

        uint256 amount = milestoneAmounts[jobId][milestoneIndex];
        milestoneReleased[jobId][milestoneIndex] = true;
        job.releasedAmount += amount;

        uint256 feeAmount = (amount * job.feeBps) / 10_000;
        uint256 workerAmount = amount - feeAmount;

        IERC20(job.token).safeTransfer(job.worker, workerAmount);
        if (feeAmount > 0) {
            IERC20(job.token).safeTransfer(feeTreasury, feeAmount);
        }

        emit MilestoneReleased(jobId, milestoneIndex, workerAmount, feeAmount);

        if (job.releasedAmount == job.totalAmount) {
            job.status = JobStatus.Completed;
            emit JobCompleted(jobId);
        }
    }

    function openDispute(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(msg.sender == job.poster || msg.sender == job.worker, "NOT_PARTICIPANT");
        require(job.status == JobStatus.Accepted, "INVALID_STATUS");
        job.status = JobStatus.InDispute;
        emit DisputeOpened(jobId);
    }

    function cancelUnacceptedJob(uint256 jobId) external {
        Job storage job = jobs[jobId];
        require(msg.sender == job.poster || msg.sender == owner(), "NOT_AUTHORIZED");
        require(job.status == JobStatus.Funded, "INVALID_STATUS");

        job.status = JobStatus.Cancelled;
        IERC20(job.token).safeTransfer(job.poster, job.totalAmount);

        emit JobCancelled(jobId);
    }
}
