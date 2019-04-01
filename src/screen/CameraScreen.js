import React, { Component } from 'react';
import { View, StyleSheet, Image, Button } from 'react-native';
import { RNCamera } from 'react-native-camera';

export default class CameraScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.state = {
      uri: null
    }

    this.capturarFoto = this.capturarFoto.bind(this);
  }

  capturarFoto = async () => {
    //testa se o objeto da camera foi criado
    if (this.camera) {
      // Opções para captura
      const options = { quality: 0.5, base64: true };
      // captura a foto
      const data = await this.camera.takePictureAsync(options)
      let state = this.state;
      state.uri = data.uri;

      this.setState(state);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 2 }}>
          <RNCamera ref={ref => { this.camera = ref; }} captureAudio={false} type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on} permissionDialogTitle={'Uso da câmera'}
            permissionDialogMessage={'Precisamos de permissão para cessar a câmera!'}
            style={styles.preview} />
        </View>

        <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'stretch'
                }}>
          <Button color="#570076" title="Capturar" onPress={() => this.capturarFoto()} />
        </View>

              <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
          <Image style={{ borderWidth: 1, borderColor: 'black', height: 150, width: 360 }}
            source={{ uri: this.state.uri }} />
        </View>

          <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch'
          }}>
            <Button style={{ borderColor: "white" }} color="#570076" title="OK"
              onPress={() => this.props.navigation.navigate('Filme', { imguri: this.state.uri })} />
            <Button color="#570076" title="Cancelar" onPress={() => this.props.navigation.navigate('Filme')} />
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#570076'
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});