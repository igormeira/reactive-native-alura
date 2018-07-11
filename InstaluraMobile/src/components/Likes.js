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

type Props = {};
export default class Likes extends Component<Props> {

  carregaIcone(likeada) {
    return likeada ? require('../../resources/img/likefull.png') :
    require('../../resources/img/like.png')
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

  render() {
    const { foto, likeCallback } = this.props;
    return (
      <View>
        <TouchableOpacity onPress={() => {
          likeCallback(foto.id)}}>
          <Image style={styles.botaoDeLike}
            source={this.carregaIcone(foto.likeada)} />
        </TouchableOpacity>

        {this.exibeLikes(foto.likers)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  botaoDeLike: {
    marginBottom: 10,
    height: 40,
    width: 40
  },
  likes: {
    fontWeight: 'bold'
  }
});
