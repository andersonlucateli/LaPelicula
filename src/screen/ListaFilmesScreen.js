import React, { Component } from 'react';
import { View, StyleSheet, Image, FlatList, Picker, Text } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import FilmeItem from './FilmeItem';

var db = openDatabase({ name: 'lapelicula.db' });

export default class ListaFilmesScreen extends Component {

  static navigationOptions = ({ navigation }) => ({

    tabBarLabel: 'Lista Filmes',
    tabBarIcon: ({ focused, tintColor }) => {
      if (focused) {
        return (
          <Image source={require('../img/home_ativo.png')} style={{ width: 26, height: 26 }} />
        );
      } else {
        return (
          <Image source={require('../img/home_inativo.png')} style={{ width: 26, height: 26 }} />
        )
      }
    }

  });


  constructor(props) {
    super(props);
    this.state = {
      filmes: [],
      order: 'codigo'
    }

    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql('select * from filme order by ' + this.state.order, [], (tx, res) => {
        var temp = [];
        for (let i = 0; i < res.rows.length; i++) {
          temp.push(res.rows.item(i));
        }
        this.setState({ filmes: temp });

      });
    });
  }

  refresh(itemValue) {

    this.setState({ order: itemValue });

    db.transaction(tx => {
      tx.executeSql('select * from filme order by ' + this.state.order, [], (tx, res) => {
        var temp = [];
        for (let i = 0; i < res.rows.length; i++) {
          temp.push(res.rows.item(i));
        }
        this.setState({ filmes: temp });

      });
    });

  }

  render() {
    return (

      <View style={styles.container}>
        <Text style={styles.texto}>Ordenar por:</Text>
        <Picker
          selectedValue={this.state.order}
          style={styles.texto}
          onValueChange={(itemValue, itemIndex) =>
           this.refresh(itemValue)
          }>
          <Picker.Item label="Descrição" value="descricao" />
          <Picker.Item label="Código" value="codigo" />
        </Picker>
        <FlatList
          data={this.state.filmes} extraData={this.state}
          keyExtractor={item => item.codigo.toString()}
          renderItem={({ item }) => <FilmeItem data={item} />}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#570076',
  },
  texto: {
    width: 130,
    fontWeight: 'bold',
    color: 'white'
  }
});