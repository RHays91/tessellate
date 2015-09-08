'use strict';
 
var React = require('react-native');
var Main = require('./mainView.ios.js');

var {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  Component,
  TextInput,
  Image,
  
} = React;

var styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#1B2B32',
	},
  fbLogo: {
    width:300,
    height:45,
    backgroundColor:'#125989',
    marginTop:20,
    borderRadius:10,
    textAlign:'center',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  fbLogoText: {
    textAlign:'center',
    color:'#FFFFFF',
    fontSize:20,
  },
  logo: {
    width:400,
    height:400,
  }

});



class LoginView extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn:false,
    }
  }

  isAuthorized(loginState){
    
    if (loginState){
      this.props.navigator.push({
        title: "Tessellate",
        component:Main,
        passProps:{currentUser:'Jonathan Schapiro',}
      })
      this.props.refs.setState({navBarHidden:true}) 
    }
  }

  login() {
      //GET Request
      var self = this;

      //SETTING THE STATE IS ASYNC!!!!! - write a damn blog post!
      this.setState({loggedIn:true},function(){
        self.isAuthorized(this.state.loggedIn);
      })
      
  }

  render() {
    //consider - https://github.com/stephy/CalendarPicker
    return (

      <View style={styles.container}>
        <Image resizeMode='contain' source={require('image!mainLogo')} style={styles.logo}/>
        <TouchableHighlight style={styles.fbLogo} onPress={this.login.bind(this)}>
          <Text style={styles.fbLogoText}>Login with Facebook</Text>
        </TouchableHighlight>
      </View>
      
    );
  }

  
}

module.exports = LoginView;