import "./App.css";
import { useState, useEffect, useRef } from "react";
import { Button } from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import logo from "./logo.png";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import MenuIcon from '@material-ui/icons/Menu';
import { BrowserRouter as Router, Link, Switch, Route } from "react-router-dom";
import Messagesentaudio from "./sound/MessageSound.mp3";
import CircularProgress from '@material-ui/core/CircularProgress';
import Messages from "./components/messages/Messages.js";
import WelcomeDialogBox from "./WelcomeDialogBox";
import db from "./firebase.js";
import firebase from "firebase";
import About from "./components/about-us/About";
import Footer from "./components/footer/footer";
import ContactUs from "./components/contactForm/contactForm.js";
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { purple } from "@material-ui/core/colors";
import Landing from "./components/Landingpage/LandingPage";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import Faq from "./components/faq/faq";
import Features from "./components/Featurespage/FeaturesPage";

function App() {
  const [loading,setLoading]=useState(false)
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [uid, setUid] = useState("");
  const [openWelcomeDialogBox, setOpenWelcomeDialogBox] = useState(false);
  const [dark, setDark] = useState(false);
  const messagesEndRef = useRef(null);
  const inputElement = useRef(null);
  const [click, setClick] = useState(false);
  const [showEmojis, setshowEmojis] = useState(false);
  const { finalTranscript,resetTranscript } = useSpeechRecognition();
  const [showAlert, setShowAlert] = useState(false);


  useEffect(() => {
    setOpenWelcomeDialogBox(true);
  }, []);

  useEffect(() => {
    setLoading(true)
    console.log("setting true",loading)
    db.collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>{
        setMessages(snapshot.docs.map((doc) => doc.data()));
        setLoading(false)
      });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleClick = () => setClick(!click);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };



  

  const newMessage = (event) => {
    //event.preventDefault();
    //setMessages([...messages,{message:input,username:username}]);
    if (input.trim() !== "") {
      db.collection("messages").add({
        username: username,
        uid: uid,
        message: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      new Audio(Messagesentaudio).play();
    }
    setInput("");
    
  };

  const handleKeypress = (event) => {
    console.log("yes")
    //it triggers by pressing the enter key
  if (event.key === 'Enter') {
    console.log("13");
    newMessage()
  }
};
  const theme = (event) => {
    if (dark === false) {
      document.body.classList.add("dark-bg");
      setDark(true);
    } else {
      document.body.classList.remove("dark-bg");
      setDark(false);
    }
  };
  
  const addEmoji = (e) => {
    let emoji = e.native;
    let cursorPositionStart = inputElement.current.selectionStart;
    let newinput= input.slice(0, cursorPositionStart) + emoji + input.slice(cursorPositionStart);
    setInput(newinput);
    inputElement.current.focus()
  };
  const emojiToggle = (e) => {
    console.log("in emojiToggle");
    if(showEmojis === true)
    {
      setshowEmojis(false);
      console.log("picker not visible");
    }
    else
    {
      setshowEmojis(true);
      console.log("picker visible");
    }
  };
 

  useEffect(() => {
    if(finalTranscript !== "")
    {
      setShowAlert(false);
      setInput(finalTranscript);
      resetTranscript();
    }
  });
   const Speechtoinput = (e) => {
    setShowAlert(true);
    SpeechRecognition.startListening();
  };
 

  return (

    <Router>

    {/*================ NavBar. Common across all routes ======================*/}

    <nav className={`${dark ? "nav_dark" : "navbar"}`}>
    <div className="nav-container">
      <a href="/landing">
        <img
            className="Logo"
            aspect-ratio="1/1"
            height="auto"
            width="50px"
            src={logo}
            alt="messenger-logo"
          />
        </a>
        <h1 style={{fontSize: "25px"}} className={`messenger`}>Messenger</h1> 
      <a href="/" className="nav-logo">
      
      </a>

      <ul className={click ? "nav-menu active" : "nav-menu"} id={dark ? "nav-menu_dark" : "nav-menu_light"}>
        <li className="nav-item">
          <Button
            title="scroll to bottom"
            onClick={scrollToBottom}
          > 
          <KeyboardArrowDownIcon className="darkthemeicon"/>
          </Button>
        </li>
        <li className="nav-item">
          <Link
            to="/"
            activeClassName="active"
            className="nav-links"
            onClick={handleClick}
          >
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/features"
            activeClassName="active"
            className="nav-links"
            onClick={handleClick}
          >
           Features
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/about"
            activeClassName="active"
            className="nav-links"
            onClick={handleClick}
          >
            About Us
          </Link>
        </li>
        <li className="nav-item toggle-nav" style={{border: "none"}}>
            <Button
                title="toggle Dark Mode"
                className="dark toggle-button"
                onClick={theme}
            >
                <Brightness4Icon className="darkthemeicon"/>
            </Button>
        </li>
      </ul>
      <div className={`nav-icon ${dark ? "nav-icon_dark" : "nav-icon_light"}`} onClick={handleClick}>
        <i><MenuIcon style={{fontSize: "30px", marginTop:"3px"}}/></i>
      </div>
    </div>
  </nav>
  
  {/*========================== End of NavBar ============================*/}
           
     <Switch>

      {/*========================== about us ============================*/}
      
      <Route path="/about">
      <About />
      <Faq  apptheme4={dark}/>
      <ContactUs apptheme={dark}/>
      <Footer apptheme2={dark}/>
      </Route>
      {/*========================== landing page ============================*/}

      <Route path="/landing">
      <Landing apptheme5={dark}/>
      <Footer />
      </Route>
      {/* ============================features page ============================ */}

      <Route path="/features">
      <Features apptheme3={dark}/>
      <Footer />
      </Route>

    {/*========================== home page ============================*/}

      <Route path="/">
        
        <div className="App">
        {
            loading?<CircularProgress className="loading"/>:
            <>
            <div className="scroll">
                <br />
                <br />
                <br />
                <br />
                <br />
                {messages.map((message) => (
                <Messages
                    messages={message}
                    username={username}
                    uid={uid}
                    dark={dark}
                    key={genKey()}
                />
                ))}
                <div />
                <br />
                <br />
                <br />
                <br />
                <br />
            </div>
            <div ref={messagesEndRef} />
            <div className="div__footer">
                <footer className={`${dark ? "footer_dark" : ""}`}>
                <div className="content__footer">
                    <div className="sendNewMessage">
                    <button className={`addfiles ${dark ? "darkButton" : ""}`}>
                        <i className="fa fa-plus"></i>
                    </button>
                    <button className="EmojiToggle"><InsertEmoticonIcon onClick={emojiToggle}/></button>
                 { showEmojis && <span className="EmojiPicker"><Picker onSelect={addEmoji}/></span> }
                    <input
                        ref={inputElement}
                        className={`input ${dark ? "dark_input" : "light_input"}`}
                        type="text"
                        placeholder="Type a message"
                        onChange={(event) => setInput(event.target.value)}
                        onKeyPress={handleKeypress}
                        value={input}
                    />
                    <div className="speak">
                       <button onClick={Speechtoinput}><i className="fa fa-microphone" ></i></button>
                       { showAlert && <span className="Speaknow_alert">Speak now</span> }
                    </div>

                    <button
                        className={`btnsend ${dark ? "darkButtonSend" : ""}`}
                        id="sendMsgBtn"
                        type="submit"
                        variant="contained"
                        crossOrigin="anonymous"
                        onClick={newMessage}
                    >
                        <i className="fa fa-paper-plane"></i>
                    </button>
                    </div>
                </div>
                </footer>
                <WelcomeDialogBox
                open={openWelcomeDialogBox}
                close={() => setOpenWelcomeDialogBox(false)}
                setUsername={setUsername}
                setUid={setUid}
                />
            </div>
            </>
        }
        </div>

      </Route>

      </Switch>
</Router>


);
}

// keys generator:- every new call to this function will give numbs like 0,1,2,3....
const genKey = (function () {
var keyCode = 0;
return function incKey() {
return keyCode++;
};
})();

export default App;
