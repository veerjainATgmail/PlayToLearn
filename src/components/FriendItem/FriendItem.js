// Components/FriendItem.js

import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import avatarsManager from '../../utils/avatars/avatarsManager';
import { withNavigation } from 'react-navigation';
import ProfileFriend from '../../components/ProfileFriend/ProfileFriend';
import { Overlay, SearchBar, ListItem } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import { deleteFriend } from '../../utils/game/gameutils';



class FriendItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = ({
      FriendID: null,
      FriendRanking: null,
      FriendUsename: null,
      FriendScore: null,
      FriendPicture: null,
      ProfileFriendVisible: false,
      activeRowKey: null,
    });
  }

  setProfileFriendVisible() {
    this.setState({
      ProfileFriendVisible: !this.state.ProfileFriendVisible
    });
  }

  onPressItem = (item) => {
    this.setState({ FriendID: item._id });
    this.setState({ FriendUsename: item.username });
    this.setState({ FriendRanking: item.ranking });
    this.setState({ FriendScore: item.scores.score_global });
    this.setState({ FriendPicture: item.picture });
    this.setProfileFriendVisible()
  }

  handleChoice() {
    this.setProfileFriendVisible();
  }

  render() {
    const swipeSettings = {
      	    autoClose: true,
          	onClose: (secId, rowId, direction) => {
              if(this.state.activeRowKey != null) {
                this.setState({ activeRowKey: null });
              }
          	},
          	onOpen: (secId, rowId, direction) => {
          		this.setState({ activeRowKey: this.props.item._id });
          	},
          	right: [
          	    {
              		onPress: () => {
                    const deletingRow = this.state.activeRowKey;
                    const users = this.props.Users;
                      Alert.alert(
                        'Alert',
                        'Are you sure you want to delete ' + this.props.item.username + ' ?',
                        [
                          {text: 'No', onPress: () => console.log('cancled Pressed'), style: 'cancel'},
                          {text: 'Yes', onPress: () => {
                              users.splice(this.props.index, 1);
                              this.props.parentFlatList.refreshFlatList(deletingRow);
                              const UID = this.props.navigation.getParam('uid', '');
                              deleteFriend(UID, this.props.item._id);
                          }},
                        ],
                        { cancelable: true }
                      );
              		},
              		text: 'Delete', type: 'delete'
          	    }
          	],
          	rowId: this.props.index,
          	sectionId: 1
     };
    return (
      <View style={styles.main_container}>
        <Swipeout {...swipeSettings}>
          <ListItem
            key={this.props.index}
            subtitle={this.props.item.username}
            containerStyle={{ borderBottomWidth: 0 }}
            leftAvatar={{ source: avatarsManager.getAvatar(this.props.item.picture) }}
            onPress={() => this.onPressItem(this.props.item)}
          />
        </Swipeout>

        <ProfileFriend
          ProfileFriendVisibility={() => this.setProfileFriendVisible()}
          ProfileFriendVisible={this.state.ProfileFriendVisible}
          FriendID={this.state.FriendID}
          FriendUsename={this.state.FriendUsename}
          FriendRanking={this.state.FriendRanking}
          FriendScore={this.state.FriendScore}
          FriendPicture={this.state.FriendPicture}
          handleChoice={() => this.handleChoice()}
       />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flatListItem: {
    	color: 'black',
    	padding: 10,
    	fontSize: 16,
    },
    separator: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: '#8E8E8E',
  }
});

export default withNavigation(FriendItem)
