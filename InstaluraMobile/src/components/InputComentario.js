/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';

type Props = {};
export default class InputComentario extends Component<Props> {

  constructor() {
    super();
    this.state = {
      valorComentario: ''
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput style={styles.input}
          placeholder='Add comentário...'
          ref={input => this.inputComentario = input}
          onChangeText={texto => this.setState({valorComentario: texto})}
          underlineColorAndroid="transparent"/>
        <TouchableOpacity onPress={() => {
          this.props.comentarioCallback(this.props.idFoto ,this.state.valorComentario, this.inputComentario);
          this.setState({valorComentario: ''})
        }}>
          <Image style={styles.icone}
            source={require('../../resources/img/send.png')}/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
