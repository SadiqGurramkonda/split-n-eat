import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


function App() {

  const [friends, setFriends] = useState(initialFriends);

  const [showAddFriend, setShowAddFriend] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFreind(){
    setShowAddFriend((show)=>!show)
  };

  function addNewFriend(newFriend){
    setFriends((friends)=>[...friends,newFriend]);
  }

  function handleSelection(friend){
    setSelectedFriend(curr=>curr?.id === friend.id?null:friend);
    setShowAddFriend(false);
  }

  function handleSplitBill(value){
    setFriends((friends)=>friends.map((friend)=>friend.id === selectedFriend.id?{...friend,balance:friend.balance + value}:friend));
    setSelectedFriend(null)
  }

  


  return (
    <>
      <ul className='app'>
        <div  className='sidebar'>
          <FriendList 
          friends={friends} 
          onSelection={handleSelection} 
          selectedFriend={selectedFriend}>
          </FriendList>
          {showAddFriend && <FormAddForm addNewFriend={addNewFriend}></FormAddForm>}
          <Button onClick={handleShowAddFreind}>{showAddFriend?"close":"Add friend"}</Button>
        </div>
        {selectedFriend && <FormSplitBill selectedFriend={selectedFriend}  onSplitBill={handleSplitBill} key={crypto.randomUUID()}></FormSplitBill>}
      </ul>
    </>
  )
}

function Button({children, onClick}){

  return <button onClick={onClick} className='button'>{children}</button>
}


function FriendList({friends, onSelection,selectedFriend}){
  return(
    <ul>
      {friends.map((friend)=>{
        return(
          <Friend friend={friend} key={friend.id} onSelection={onSelection} selectedFriend={selectedFriend}></Friend>
        )
      })}
    </ul>
  )
}


function Friend({friend,onSelection, selectedFriend}){


  const isSelected = selectedFriend?.id === friend.id; 

  return(
    <li className={isSelected?"selected":""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {
        friend.balance > 0 && (
          <p className='green'>{friend.name} owes you {friend.balance}</p>
        )
      }
      {
        friend.balance < 0 && (
          <p className='red'>You owe {friend.name} {Math.abs(friend.balance)}</p>
        )
      }
      {
        friend.balance === 0 && (
          <p>You and {friend.name} are even</p>
        )
      }
      <Button onClick={()=>onSelection(friend)}>{isSelected?"Close":"Select"}</Button>
    </li>
  )
}

function FormAddForm({addNewFriend}){

  const [name,setName] = useState("");
  const [image,setImage] = useState("https://i.pravatar.cc/48?u=499476");

  function handleAddFriend(e){
    e.preventDefault();

    if(!name || !image) return;

    const id = crypto.randomUUID();
    const newFrined = {
      id,
      name,
      balance:0,
      image: `${image}?=${id}` 
    };

    addNewFriend(newFrined);

    setName("");
    setImage("https://i.pravatar.cc/48?u=499476")

    
  }

  return(
    <form className='form-add-friend' onSubmit={handleAddFriend}>
      <label>Friend name</label>
      <input type='text' onChange={(e)=>setName(e.target.value)}></input>
      <label>Imagae url</label>
      <input type='text' onChange={(e)=>setImage(e.target.value)} value={image}></input>

      <Button>Add</Button>

    </form>
  );
}

function FormSplitBill({selectedFriend, onSplitBill}){

  const randomKey  = crypto.randomUUID();

  const [totalBill,setTotalBill] = useState("");
  const [yourExpense,setYourExpense] = useState("");
  const paidByFriend = totalBill ? totalBill - yourExpense: "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e){
    e.preventDefault();

    if(!totalBill || !yourExpense) return
    onSplitBill(whoIsPaying==="user"?paidByFriend:-yourExpense);


  }



  return(
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>split the bill with {selectedFriend.name}</h2>
      <label>Bill value</label>
      <input onChange={(e)=>{setTotalBill(Number(e.target.value))}} type='number' value={totalBill}></input>

      <label>Your expense</label>
      <input onChange={(e)=>{setYourExpense(Number(e.target.value)>totalBill?yourExpense:Number(e.target.value))}} value={yourExpense} type='number'></input>

      <label>{selectedFriend.name}'s expense</label>
      <input type='text' disabled value={paidByFriend}></input>

      <label>Who's paying the bill</label>
      <select onChange={(e)=>{setWhoIsPaying(e.target.value)}}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
      
    </form>
  )
}

export default App
