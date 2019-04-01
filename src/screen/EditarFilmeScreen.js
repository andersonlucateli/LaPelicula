import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TextInput,
    TouchableOpacity, Text
} from 'react-native';
import { LPButton } from '../component/LPButton';

import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'lapelicula.db' });

export default class FilmeScreen extends Component {

    static navigationOptions = ({ navigation }) => ({
        tabBarLabel: 'Editar Filme',
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            descricao: '',
            uri: null
        };

        this.state.descricao = this.props.navigation.state.params.descricao;
        this.state.uri = this.props.navigation.state.params.uri;

        this.salvar = this.salvar.bind(this);
    }


    salvar() {
        codigo = this.props.navigation.state.params.codigo; 

        //alert(codigo + this.state.descricao);
        
        db.transaction(tx => {
            tx.executeSql('update filme set descricao = \'' + this.state.descricao + '\' where codigo = ' + codigo);
        });
        this.props.navigation.navigate('Home');
        
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Editando</Text>
                <View style={styles.areaFoto}>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Image source={{ uri: this.state.uri }} style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'flex-start', width: 150, height: 150, marginBottom: 40 }} />
                    </View>
                </View>
                <View style={styles.areaInput}>
                    <TextInput style={styles.inputText}
                        multiline={true} placeholder='Descrição' value={this.state.descricao}
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