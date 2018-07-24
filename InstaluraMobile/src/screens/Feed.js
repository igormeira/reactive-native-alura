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
  AsyncStorage
} from 'react-native';
import Post from './../components/Post'

const width = Dimensions.get('screen').width;

type Props = {};
export default class Feed extends Component<Props> {

  constructor() {
    super();
    this.state = {
      fotos: []
    }
  }

  componentDidMount() {
    const uri = 'https://instalura-api.herokuapp.com/api/fotos';

    AsyncStorage.getItem('token')
      .then(token => {
        return {
          headers: new Headers({
            'X-AUTH-TOKEN': token
          })
        }
      })
      .then(requestInfo => fetch(uri, requestInfo))
      .then(resposta => resposta.json())
      .then(json => this.setState({fotos: json}))
  }

  like(idFoto) {
    const foto = this.state.fotos.find(foto => foto.id === idFoto);

    AsyncStorage.getItem('usuario')
      .then(usuarioLogado => {
        let novalista = []
        if(!foto.likeada) {
          novalista = [
            ...foto.likers,
            {login: usuarioLogado}
          ]
        } else {
          novalista = foto.likers.filter(liker => {
            return liker.login !== usuarioLogado
          })
        }
        return novalista;
      })
      .then(novalista => {
        const fotoAtualizada = {
          ...foto,
          likeada: !foto.likeada,
          likers: novalista
        }
        const fotos = this.state.fotos.map(foto =>
          foto.id === fotoAtualizada.id ? fotoAtualizada : foto)
        this.setState({fotos: fotos})
      })
    const uri = `https://instalura-api.herokuapp.com/api/fotos/${idFoto}/like`;
    AsyncStorage.getItem('token')
      .then(token => {
        return {
          method: 'POST',
          headers: new Headers({
            'X-AUTH-TOKEN': token
          })
        }
      })
      .then(requestInfo => fetch(uri, requestInfo))
  }

  adicionaComentario(idFoto, valorComentario, inputComentario) {
    if (valorComentario === '') {
      return;
    }

    const foto = this.state.fotos.find(
      foto => foto.id === idFoto
    )

    const uri = `https://instalura-api.herokuapp.com/api/fotos/${idFoto}/comment`;

    AsyncStorage.getItem('token')
      .then(token => {
        return {
          method: 'POST',
          body: JSON.stringify({
            texto: valorComentario
          }),
          headers: new Headers({
            'Content-type': 'application/json',
            'X-AUTH-TOKEN': token
          })
        };
      })
      .then(requestInfo => fetch(uri, requestInfo))
      .then(resposta => resposta.json())
      .then(comentario => [...foto.comentario, comentario])
      .then(novalista => {
        const fotoAtualizada = {
          ...foto,
          comentarios: novalista
        }
        const fotos = this.state.fotos.map(
          foto => foto.id === fotoAtualizada.id ? fotoAtualizada : foto
        );
        this.setState({fotos: fotos});
        inputComentario.clear();
      })
  }

  render() {
    return (
      <FlatList
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
