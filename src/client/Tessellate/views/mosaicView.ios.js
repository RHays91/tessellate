  'use strict';
 
function drawSine(t) {
  var path = `M ${0} ${Math.sin(t) * 100 + 120}`;
  var x, y;
 
  for (var i = 0; i <= 10; i += 0.5) {
    x = i * 50;
    y = Math.sin(t + x) * 100 + 120;
    path = path + ` L ${x} ${y}`
  }
 
  return path;
}
 
 
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  AlertIOS,
} = React;
 
var {Use, Path, Defs, Mask, LinearGradient,G,SvgDocument,Svg} = require('react-native-svg-elements');
var TimerMixin = require('react-timer-mixin');

var MosaicView = React.createClass({
  mixins: [TimerMixin],
 
  getInitialState() {
    return {t: 0,
      nav:this.props.mainNavigator,
      eventCode:this.props.eventCode,
      facebookId:this.props.facebookId,
      mosaicMainImage:'./img'
    }
  },
 
  componentDidMount() {
    
    this.fetchMosaicData();
  },

  fetchMosaicData(){
    var _this = this;
    console.log('EVEEEEEENT: ' + this.state.eventCode)
    var apiString = 'http://10.0.1.156:8000/event/' + this.state.eventCode;
    console.log(apiString.toString())
    var getMosaicObject = {  
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': '',
        'Host': 'http://10.0.1.156:8081',
        'FacebookID':_this.props.facebookId,
      }
    }

    fetch(apiString, getMosaicObject)  
      .then(function(res) {
        if (!res){
          throw new Error('We were unable to find this event.')
        }
        return res.json();
       })
      .then(function(resJson) {
        console.log('Mosaic Response: ' + resJson)
       
        var mosaicMainImage = resJson.image.imgPath;
        if (!resJson){
          console.log('this event not found')
          throw new Error('This event does not exist!');
        }

        _this.setState({mosaicMainImage:mosaicMainImage}); 

        return resJson;
       })
      .catch((error) => {
        
        AlertIOS.alert(
           'Whoa! Something Went Wrong.',
           error.message,
           [
             {text: 'Try Again', onPress: () => {
              //redirect back to main page
              _this.props.nav.pop()

             }}
           ]
         );

      });

  },

 
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#1B2B32', justifyContent: 'center', alignItems: 'center'}}>
      <Image resizeMode='contain' style={styles.header} source={require( 'image!tHeader')}/>
        <Svg width={500} height={500} style={styles.container}>
          <Image source={{uri: this.state.mosaicMainImage}}
                 style={{width: 400, height: 400}} />
        </Svg>
      </View>
    );
  }
});

var styles = StyleSheet.create({
   header: {
      flex:1,
      position:'absolute',
      alignSelf:'stretch',
      backgroundColor:'#1B2B32',
      top:0,
      left:0,
      width:400,
      height:60,
    }, 
    container: {
      flex:1,
      position:'relative',
      justifyContent: 'center',
      alignItems: 'center',

    }

});

module.exports = MosaicView;