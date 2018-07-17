/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
 Platform,
 StyleSheet,
 Text,
 View,
 Image,
 Dimensions,
 ScrollView,
 FlatList,
 TouchableOpacity,
 TextInput,
 Button,
 AsyncStorage
} from 'react-native';

const width = Dimensions.get('screen').width;

type Props = {};
export default class Login extends Component<Props> {

  constructor() {
    super();
    this.state = {
      usuario: '',
      senha: '',
      mensagem: ''
    }
  }

  efetuaLogin () {
    const uri = 'https://instalura-api.herokuapp.com/api/public/login';
    const requestInfo = {
      method: 'POST',
      body: JSON.stringify({
        login: this.state.usuario,
        senha: this.state.senha
      }),
      headers: new Headers({
        'Content-type': 'application/json'
      })
    }

    fetch(uri, requestInfo)
      .then(response => {
        if(response.ok)
          return response.text();

        throw new Error('Login negado!');
      })
      .then(token => {
        AsyncStorage.setItem('token', token);
        AsyncStorage.setItem('usuario', this.state.usuario);
      })
      .catch(e => this.setState({mensagem: e.message}))
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Instalura</Text>
        <View style={styles.form}>
          <TextInput style={styles.input}
            placeholder='Usuário...'
            onChangeText={texto => this.setState({usuario: texto})}
            autoCapitalize='none' />

          <TextInput style={styles.input}
            placeholder='Senha...'
            onChangeText={texto => this.setState({senha: texto})}
            secureTextEntry={true} />

          <Button title='Login'
            onPress={this.efetuaLogin.bind(this)} />

        </View>

        <Text style={styles.mensagem}>
          {this.state.mensagem}
        </Text>

      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    width: width * 0.8
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 26
  },
  mensagem: {
    marginTop: 15,
    color: '#e74c3c'
  }
});
