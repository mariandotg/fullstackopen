import { useState } from "react";

const Button = ({ text, onClick }) => {
  return <button onClick={onClick}>{text}</button>;
};

const Anecdote = ({ text, votes }) => {
  return (
    <>
      <div>{text}</div>
      <div>has {votes} votes</div>
    </>
  );
};

const MostVoted = ({ anecdotes, votes}) => {
  const mostVoted = Math.max(...votes);
  const mosVotedIndex = votes.indexOf(mostVoted);

  return (
    <>
      {mostVoted > 0 ? (
        <Anecdote
          text={anecdotes[mosVotedIndex]}
          votes={votes[mosVotedIndex]}
        />
      ) : (
        <p>There are no votes yet</p>
      )}
    </>
  )
}

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(7).fill(0));

  const handleVoteClick = () => {
    const votesUpdated = [...votes];
    votesUpdated[selected] += 1;
    setVotes(votesUpdated);
  };

  const handleAnecdoteClick = () => {
    const arrayIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(arrayIndex);
  };

  return (
    <>
      <h1>Anecdote of the day</h1>
      <Anecdote text={anecdotes[selected]} votes={votes[selected]} />
      <Button text="vote" onClick={handleVoteClick} />
      <Button text="next anecdote" onClick={handleAnecdoteClick} />

      <h1>Anecdote with most votes</h1>
      <MostVoted anecdotes={anecdotes} votes={votes}/>
    </>
  );
};

export default App;
