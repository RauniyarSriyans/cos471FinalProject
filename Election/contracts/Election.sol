pragma solidity ^0.8.19;

contract Election {
    // A candidate struct 
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    // a mapping of Candidate structs 
    mapping(uint => Candidate) public candidates;

    // number of candidates
    uint public candidatesCount;

    constructor () public {
        
    }

    function addCandidate(string memory _name) public {
        candidatesCount++;
        Candidate memory newCand = Candidate(candidatesCount, _name, 0);
        candidates[candidatesCount] = newCand;  
    }
}