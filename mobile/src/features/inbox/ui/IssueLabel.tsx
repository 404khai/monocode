import { Text, View } from 'react-native';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { issueLabelColor, type IssueLabel as Label } from '../model/inbox';
export function IssueLabel({label}:{label:Label}) {
  const t=useAppTheme();
  return <View style={{flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:7,paddingVertical:4,borderRadius:6,backgroundColor:t.elevated,maxWidth:150}}>
    <View style={{width:6,height:6,borderRadius:3,backgroundColor:issueLabelColor(label)}}/>
    <Text numberOfLines={1} style={{color:t.secondaryText,fontSize:11}}>{label.name}</Text>
  </View>;
}
