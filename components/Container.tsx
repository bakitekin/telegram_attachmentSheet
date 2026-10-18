import { StyleSheet, View } from 'react-native';

import { AttachmentSheet } from './attachment/AttachmentSheet';
import { ChatBackground } from './chat/ChatBackground';
import { ChatHeader } from './chat/ChatHeader';
import { GroupInfoBubble } from './chat/GroupInfoBubble';
import { InputBar } from './chat/InputBar';

export const Container = () => (
  <View style={styles.container}>
    <ChatBackground />
    <ChatHeader />
    <View style={styles.messages}>
      <GroupInfoBubble />
    </View>
    <InputBar />
    <AttachmentSheet />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8DCFCD',
  },
  messages: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
});
