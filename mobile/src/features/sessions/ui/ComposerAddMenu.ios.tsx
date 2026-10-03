import { Button, Host, HStack, Image, Menu, Section, Text, VStack } from '@expo/ui/swift-ui';
import { accessibilityLabel, buttonStyle, font, foregroundColor, frame, glassEffect } from '@expo/ui/swift-ui/modifiers';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { COMPOSER_ADD_ACTIONS, type ComposerAddAction, type ComposerMode } from '../model/composerAdd';
export function ComposerAddMenu({mode,onSelect}:{mode:ComposerMode;onSelect:(action:ComposerAddAction)=>void}) {
  const t=useAppTheme();
  return <Host style={{width:44,height:44}}>
    <Menu label={<Image systemName="plus" size={20} color={t.text}/>} modifiers={[
      buttonStyle('plain'),frame({width:44,height:44}),glassEffect({shape:'roundedRectangle',cornerRadius:11,glass:{variant:'regular',interactive:true}}),
      accessibilityLabel('Add to message'),
    ]}>
      <Section title="Add to message">
        {COMPOSER_ADD_ACTIONS.map(action=><Button key={action.id} onPress={()=>onSelect(action.id)}>
          <HStack spacing={10}>
            <Image systemName={action.symbol} size={19} color={action.id==='upload' ? t.text : action.color}/>
            <VStack alignment="leading" spacing={3}>
              <Text modifiers={[font({size:16,weight:'medium'})]}>{action.title}</Text>
              <Text modifiers={[font({size:12}),foregroundColor(t.secondaryText)]}>{action.description}</Text>
            </VStack>
            {mode===action.id&&<Image systemName="checkmark" size={15} color={t.accent}/>}
          </HStack>
        </Button>)}
      </Section>
    </Menu>
  </Host>;
}
