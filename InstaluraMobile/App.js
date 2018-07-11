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
  FlatList
} from 'react-native';
import Post from './src/components/Post'

const width = Dimensions.get('screen').width;

type Props = {};
export default class App extends Component<Props> {

  constructor() {
    super();
    this.state = {
      fotos: []
    }
  }

  componentDidMount() {
    fetch('https://instalura-api.herokuapp.com/api/public/fotos/rafael')
      .then(resposta => resposta.json())
      .then(json => this.setState({fotos: json}))
  }

  like(idFoto) {
    const foto = this.state.fotos.find(foto => foto.id === idFoto);
    let novalista = []

    if(!foto.likeada) {
      novalista = [
        ...foto.likers,
        {login: 'meuUsuario'}
      ]
    } else {
      novalista = foto.likers.filter(liker => {
        return liker.login !== 'meuUsuario'
      })
    }

    const fotoAtualizada = {
      ...foto,
      likeada: !foto.likeada,
      likers: novalista
    }

    const fotos = this.state.fotos.map(foto =>
      foto.id === fotoAtualizada.id ? fotoAtualizada : foto)

    this.setState({fotos: fotos})
  }

  adicionaComentario(idFoto, valorComentario, inputComentario) {
    if (valorComentario === '') {
      return;
    }

    const foto = this.state.fotos.find(
      foto => foto.id === idFoto
    )

    const novalista = [
      ...foto.comentario,
      {id: valorComentario,
       login: 'meuUsuario',
       texto: valorComentario
      }
    ];

    const fotoAtualizada = {
      ...foto,
      comentarios: novalista
    }

    const fotos = this.state.fotos.map(
      foto => foto.id === fotoAtualizada.id ? fotoAtualizada : foto
    )

    this.setState({fotos: fotos});
    inputComentario.clear();

  }

  render() {
    return (
      <FlatList
        style={styles.container}
        keyExtractor={item => item.id}
        data={this.state.fotos}
        renderItem={({item}) =>
          <Post foto={item}
            likeCallback={this.like.bind(this)}
            comentarioCallback={this.adicionaComentario.bind(this)}/>
        }
      />

    );
  }
}

const margem = Platform.OS == 'ios' ? 20 : 0;
const styles = StyleSheet.create({
  container: {
    marginTop: margem
  }
});
