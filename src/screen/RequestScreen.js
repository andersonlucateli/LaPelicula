import React from 'react';
import { ActivityIndicator, Text, View, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { LPButton } from '../component/LPButton';
import ImgToBase64 from 'react-native-image-base64';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'lapelicula.db' });
var i = 1;

export default class RequestScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: 'HTTP Request',
        header: null
    });

    // quando o componente foi criado/montado
    componentDidMount() {
        if (typeof this.props.navigation.state.params !== "undefined") {
            this.setState({
                uri: this.props.navigation.state.params.imguri
            });
        }
    }


    constructor(props) {
        super(props);
        this.state = { isLoading: true },
            this.uri = ''

        this.getHttp = this.getHttp.bind(this);
        this.getBase64 = this.getBase64.bind(this);
        this.salvar = this.salvar.bind(this);
    }


    abrirCamera() {
        this.props.navigation.navigate('Camera');
    }

    salvar() {
        //insert no banco
        db.transaction(tx => {
            tx.executeSql('insert into filme(descricao, imagem) values(?, ?)',
                [this.state.title, this.state.uri]);
        });
        this.props.navigation.navigate('Home');
    }

    //Chama imediatamente apos componente criado;
    componentDidMount() {
        return fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=react-native&type=video&key=AIzaSyD8mZo4NZBHNvDettPCtSu7NxG8aGNCbGs')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false,
                    dataSource: responseJson,
                    title: responseJson['items'][0]['snippet']['title'],
                    descricao: responseJson['items'][0]['snippet']['description'],
                    imgUrl: responseJson['items'][0]['snippet']['thumbnails']['default']['url']
                }, function () {

                    //alert(title);

                });

            })
            .catch((error) => {
                console.error(error);
            });
    }

  
    getHttp() {
        return fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=react-native&type=video&key=AIzaSyD8mZo4NZBHNvDettPCtSu7NxG8aGNCbGs')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({
                    isLoading: false,
                    dataSource: responseJson,
                    title: responseJson['items'][i]['snippet']['title'],
                    descricao: responseJson['items'][i]['snippet']['description'],
                    imgUrl: responseJson['items'][i]['snippet']['thumbnails']['default']['url']
                }, function () {
                    i++;
                });

            })
            .catch((error) => {
                console.error(error);
            });
    }

    getBase64() {
        //img = '';
        //alert(this.state.imgUrl);
        ImgToBase64.getBase64String('../img/cadastrar_inativo.png')
            .then(base64String => alert(base64String))
            .catch(err => alert(err));

        //alert(img);
    }


    render() {

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <View style={styles.areaFoto}>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Image source={{ uri: this.state.imgUrl }}
                            style={{
                                backgroundColor: 'white', justifyContent: 'center',
                                alignItems: 'flex-start', width: 150, height: 150, marginBottom: 40
                            }} />
                    </View>
                </View>
                <View style={styles.areaInput}>
                    <TextInput style={styles.inputText}
                        multiline={true} placeholder='Descrição' value={this.state.title}
                        onChangeText={(valor) => this.setState({ descricao: valor })} />
                </View>
                <View style={styles.areaBotao}>
                    <View style={{ flex: 1 }}>
                        <LPButton titulo='Salvar' onPress={() => this.salvar()} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <LPButton titulo='Cancelar'
                            onPress={() => this.props.navigation.navigate('Home')} />
                    </View>
                </View>


                <View style={{ flex: 1.5, paddingTop: 20, height: 300, width: 300, }}>
                    <Text>Buscando "react-native" no YouTube!</Text>
                    <LPButton titulo="Buscar Outro" onPress={() => { this.getHttp() }} />
                    <LPButton titulo="Get Base64" onPress={() => { this.getBase64() }} />
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#570076',
    },
    inputText: {
        fontSize: 15,
        borderWidth: 1,
        borderColor: 'white',
        color: 'white'
    },
    areaBotao: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center'
    },
    areaInput: {
        width: '98%'
    },
    areaFoto: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});
