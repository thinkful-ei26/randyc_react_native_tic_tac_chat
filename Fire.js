import firebase from 'firebase';

class Fire {

  constructor(){
    this.init();
    this.observeAuth();
  }

  init = () => {
  
    //AIzaSyBSUZ9zciYVpXJDng0WBJALINaJWTW4f7A 

    if(!firebase.apps.length){

      firebase.initializeApp({
        apiKey: "AIzaSyDxOdznvEVog7PVf4srNsq7wdiw0muNiXA",
        authDomain: "awesomeness-b36ce.firebaseapp.com",
        databaseURL: "https://awesomeness-b36ce.firebaseio.com",
        projectId: "awesomeness-b36ce",
        storageBucket: "awesomeness-b36ce.appspot.com",
        messagingSenderId: "1098256931153"
      })

    } 
    else{

      firebase.app();

    }
     
  }
  
 
  observeAuth = () => {
    
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged); 
     
  }

  onAuthStateChanged = user => {

    if(!user){
      try{
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        console.log('firebase response: ',message)
        alert('Enter name to be Signed-in anonymously');
      }
    }
  
  };

  ///// GET MESSAGES
  get ref(){
    return firebase.database().ref('messages');
  }
 
  parse = snapshot => {

    const { timestamp: numberStamp,text,user } = snapshot.val();
    const { key: _id } = snapshot;

    const timestamp = new Date(numberStamp);//change timestamp to JS date format

    //create object for giftedChat
    const message = {
      _id,
      timestamp,
      text,
      user
    };
  
    return message;

  };
 
  on = callback => {
    this.ref
    .limitToLast(20)
    .on('child_added',snapshot => callback(this.parse(snapshot)));

  }
  
  ///// SEND MESSAGES
  get uid(){
    return (firebase.auth().currentUser || {}).uid;
  }

  get timestamp(){
    return firebase.database.ServerValue.TIMESTAMP;
  }

  send = messages => {

    for(let i=0; i<messages.length; i++){
      const { text,user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp,  
      };
  
      this.append(message);
    }

  };
 
  append = message => {
    this.ref.push(message);
  }

  off(){
    this.ref.off();
  }
 
 
}

Fire.shared = new Fire();
export default Fire;

