'use client'

import {useState} from 'react'

function  BookEvent() {
 const [email ,setEmail] = useState('');
 const[submitted,setSubmitted]=useState(false);

 const handleSubmit=(e:React.FormEvent)=>{
    e.preventDefault();


   setTimeout(() => {
    setSubmitted(true);
   }, 1000);
 }
 return (

    <div id="book-event" className="book-event flex-col-gab-4">


{  submitted ? (
    <p className="text-sm">Thank you for signing up!</p>
):(
    <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="email">email Address</label>
            <input 
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            placeholder='enter hyour email '
            />
        </div>
        <button type="submit" className='button-submit'>Submit </button>
    </form>
)}
    </div>
 )


}

export default BookEvent
