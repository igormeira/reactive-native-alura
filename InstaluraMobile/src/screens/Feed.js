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
import InstaluraFetchService from '../services/InstaluraFetchService'
import Notificacao from '../api/Notificacao'

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
    this.props.navigator.setOnNavigatorEvent(event => {
      if(event.id === 'willAppear')
        this.load();
    });
  }

  load() {
    let uri = '/fotos';
    if(this.props.usuario)
      uri = `/public/fotos/${this.props.usuario}`;

    InstaluraFetchService.get('/fotos')
      .then(json => this.setState({fotos: json}))
      .catch(e => this.setState({status: 'FALHA_CARREGAMENTO'}));
  }

  like(idFoto) {
    const listaOriginal = this.state.fotos;
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
    InstaluraFetchService.post(`/fotos/${idFoto}/like`)
      .catch(e => {
        this.setState({fotos: listaOriginal})
        Notificacao.exibe('Ops..', 'Algo deu errado!')
      });
  }

  adicionaComentario(idFoto, valorComentario, inputComentario) {
    if (valorComentario === '') {
      return;
    }

    const foto = this.state.fotos.find(
      foto => foto.id === idFoto
    )
    const comentario = {
      texto: valorComentario
    }
    InstaluraFetchService.post(`/fotos/${idFoto}/comment`, comentario)
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
      .catch(e => {
        Notificacao.exibe('Ops..', 'Algo deu errado!')
      });
  }

  verPerfilUsuario(idFoto) {
    const foto = this.state.fotos.find(foto => foto.id === idFoto);

    this.props.navigator.push({
      screen: 'PerfilUsuario',
      backButtonTitle: '',
      title: foto.loginUsuario,
      passProps: {
        usuario: foto.loginUsuario
      }
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
            comentarioCallback={this.adicionaComentario.bind(this)}
            verPerfilCallback={this.verPerfilUsuario.bind(this)}/>
        }
      />

    );
  }
}
