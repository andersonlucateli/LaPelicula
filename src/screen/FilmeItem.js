import React, { Component } from 'react';
import { View, Text, TouchableHighlight, ImageBackground, Alert, StyleSheet } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { withNavigation } from 'react-navigation';

var db = openDatabase({ name: 'lapelicula.db' });

//Component de Filmes
class FilmeItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            codigo: '',
            uri: null
        };

        this.excluir = this.excluir.bind(this);
    }

    excluir() {
        //alert('delete from filme where codigo = ' + this.props.data.codigo + ';');

        db.transaction(tx => {
            tx.executeSql('delete from filme where codigo = ' + this.props.data.codigo + ';');
        });

        this.props.navigation.navigate('Home');
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableHighlight onPress={

                    () => Alert.alert(
                        '',
                        this.props.data.descricao,
                        [
                            {
                                text: 'Editar', onPress: () => this.props.navigation.navigate('Editar',
                                    {
                                        codigo: this.props.data.codigo,
                                        descricao: this.props.data.descricao,
                                        img: this.props.data.uri
                                    })
                            },
                            { text: 'Excluir', onPress: () => this.excluir() },
                            { text: 'Cancelar' }
                        ],
                        { cancelable: true },
                    )
                }
                    underlayColor="white" >

                    <ImageBackground resizeMode="cover" source={{ uri: this.props.data.imagem }} style={{ height: 150 }}>
                        <View style={{
                            flex: 1,
                            alignItems: 'flex-start',
                            justifyContent: 'flex-end',
                            paddingLeft: 10,
                            paddingBottom: 10
                        }}>
                            <Text style={{ fontSize: 23, color: '#FFFFFF', fontWeight: 'bold' }}>{this.props.data.descricao}</Text>
                        </View>
                    </ImageBackground>
                </TouchableHighlight>
            </View>
        );
    }
}

export default withNavigation(FilmeItem);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#570076'
    }
});