pragma solidity >=0.4.22 <0.7.0;

contract Election {
    // A candidate struct 
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    // a mapping of Candidate structs 
    mapping(unint => Candidate) public candidates;

    // number of candidates
    uint public candidatesCount;

    function Election () public {
        
    }
    function addCandidate(string _name) private{
        candidatesCount++;
        Candidate newCand = Candidate(candidatesCount, _name, 0);
        candidates[candidatesCount] = newCand;
        
        
    }
}
