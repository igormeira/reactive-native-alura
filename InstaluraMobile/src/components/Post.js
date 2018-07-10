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
  TextInput
} from 'react-native';

const width = Dimensions.get('screen').width;

type Props = {};
export default class Post extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      foto: this.props.foto,
      valorComentario: ''
    }
  }

  carregaIcone(likeada) {
    return likeada ? require('../../resources/img/likefull.png') :
    require('../../resources/img/like.png')
  }

  like() {
    const { foto } = this.state;
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
    this.setState({foto: fotoAtualizada})
  }

  exibeLikes(likers) {
    if(likers.length <= 0)
      return;

    return (
      <Text style={styles.likes}>
        {likers.length} {likers.length > 1 ? 'curtidas' : 'curtida'}
      </Text>
    );
  }

  exibeLegenda(foto) {
    if(foto.comentario === '')
      return;

    return (
      <View style={styles.comentario}>
        <Text style={styles.tituloComentario}>{foto.loginUsuario}</Text>
        <Text>{foto.comentario}</Text>
      </View>
    );
  }

  adicionaComentario() {
    if (this.state.valorComentario === '') {
      return;
    }

    const novalista = [
      ...this.state.foto.comentario,
      {id: this.state.valorComentario,
       login: 'meuUsuario',
       texto: this.state.valorComentario
      }
    ];

    const fotoAtualizada = {
      ...this.state.foto,
      comentarios: novalista
    }

    this.setState({foto: fotoAtualizada, valorComentario: ''});
    this.inputComentario.clear();

  }

  render() {
    const { foto } = this.state;

    return (
      <View>

        <View style={styles.cabecalho}>
          <Image source={{uri: foto.urlPerfil}}
               style={styles.fotoDePerfil}/>
          <Text>{foto.loginUsuario}</Text>
        </View>

        <Image source={{uri: foto.urlFoto}}
             style={styles.foto}/>

        <View style={styles.rodape}>
          <TouchableOpacity onPress={this.like.bind(this)}>
            <Image style={styles.botaoDeLike}
              source={this.carregaIcone(foto.likeada)} />
          </TouchableOpacity>

          {this.exibeLikes(foto.likers)}
          {this.exibeLegenda(foto)}
          {foto.comentarios.map(comentario =>
            <View style={styles.comentario} key={comentario.id}>
              <Text style={styles.tituloComentario}>{comentario.login}</Text>
              <Text>{comentario.texto}</Text>
            </View>
          )}

          <View style={styles.novoComentario}>
            <TextInput style={styles.input}
              placeholder='Add comentário...'
              ref={input => this.inputComentario = input}
              onChangeText={texto => this.setState({valorComentario: texto})}/>
            <TouchableOpacity onPress={this.adicionaComentario.bind(this)}>
              <Image style={styles.icone}
                source={require('../../resources/img/send.png')}/>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cabecalho: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  fotoDePerfil: {
    marginRight: 10,
    borderRadius: 20,
    width: 40,
    height: 40
  },
  foto: {
    width: width,
    height: width
  },
  botaoDeLike: {
    marginBottom: 10,
    height: 40,
    width: 40
  },
  rodape: {
    margin: 10
  },
  likes: {
    fontWeight: 'bold'
  },
  comentario: {
    flexDirection: 'row'
  },
  tituloComentario: {
    fontWeight: 'bold',
    marginRight: 5
  },
  novoComentario: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  input: {
    flex: 1,
    height: 40
  },
  icone: {
    height: 30,
    width: 30
  }
});
