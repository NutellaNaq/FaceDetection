import React, {Component} from 'react';
import './App.css';
import Navigation from './components/navigation/navigation';
import FaceRecongnition from './components/FaceRecongnition/FaceRecongnition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

 

const initialState  = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
        id: '',
        name: '', 
        email: '',
        entries: 0,
        joined: ''
    }
  }
  


class App extends Component {

    constructor() {
      super();
      this.state = initialState;
    }


    loadUser = (data) =>{
      this.setState({user: {
          id: data.id,
          name: data.name, 
          email: data.email,
          entries: data.entries,
          joined: data.joined
      }})
    }

    calculateBox = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

    displayFaceBox = (box) => {
      console.log(box);
      this.setState({box: box})
    }


    onInputChange = (event) => {
      this.setState({input: event.target.value});
    }

    onButtonSubmit = () => {
      this.setState({imageUrl: this.state.input});
        fetch('https://hidden-wildwood-73976.herokuapp.com/imageurl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
        })
        .then(response => response.json())
        .then(response => {
          console.log('hi', response)
          if (response) {
            fetch('https://hidden-wildwood-73976.herokuapp.com/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
              })
            })
              .then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, count))
              })
  
          }
          this.displayFaceBox(this.calculateBox(response))
        })
        .catch(err => console.log(err));
    }
  
    onRouteChange = (route) => {
      if (route === 'signout') {
        this.setState({isSignedIn: false})
      } else if (route === 'home') {
        this.setState({isSignedIn: true})
      }
      this.setState({route: route});
    }


    render() {
      const { isSignedIn, imageUrl, route, box } = this.state;
      return (
        <div className="App">
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
          { route === 'home'
            ? <div>
                <Logo />
                <Rank
                  name={this.state.user.name}
                  entries={this.state.user.entries}
                />
                <ImageLinkForm
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit}
                />
                <FaceRecongnition box={box} imageUrl={imageUrl} />
              </div>
            : (
               route === 'signin'
               ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
               : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              )
          }
        </div>
      );
    }
  }

//   render() {
//     const {isSignedIn, imageUrl, route, box} = this.state;
//     return (
//     <div className="App">

//       <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
//       { route === 'home' 
//        ? <div>
//         <Logo />
//         <Rank 
//         name={this.state.user.name} entries={this.state.user.entries}/>
//         <ImageLinkForm onInputChange={this.onInputChange}
//         onSubmit={this.onSubmit}
//         />
//         <FaceRecongnition box={box} imageUrl={imageUrl}/> 
//         </div>
//         : (route === 'signin' ? 
//         <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
//         : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
//         )}
//     </div>
//   );}
// }

export default App;
