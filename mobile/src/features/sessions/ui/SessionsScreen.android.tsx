import { useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { Host, Box, Column, Row, LazyColumn, ListItem, Text, TextButton, IconButton, FloatingActionButton,
  ExtendedFloatingActionButton, DropdownMenu, DropdownMenuItem, OutlinedTextField, RNHostView } from '@expo/ui/jetpack-compose';
import { align, background as composeBackground, clip, Shapes, clickable, fillMaxSize, fillMaxWidth, padding, paddingAll, semantics, weight } from '@expo/ui/jetpack-compose/modifiers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/shared/theme/theme';
import { sessionFixtures } from '@/fixtures/sessions';
import { groupSessionsByWorkspace } from '../model/sessionHierarchy';
import type { SessionSummary } from '../model/sessionSummary';
import { useAppTheme } from '@/shared/theme/useAppTheme';
import { AppSymbol } from '@/shared/ui/AppSymbol';
import { ProviderIcon } from '@/shared/ui/ProviderIcon';
import { ProjectMascot } from '@/features/projects/ui/ProjectMascot';
import { PacmanGame } from '@/features/arcade/ui/PacmanGame';
import { ChatBackground } from '@/features/settings/ui/ChatBackground';
import { useChatBackground } from '@/features/settings/data/chatBackgroundStore';
import { WorkingPixels } from './WorkingPixels';
import { InboxSheet } from './InboxSheet';
import { NewSessionSheet, type NewSessionContext } from './NewSessionSheet';
import type { SessionFilter } from './SessionToolbar';

const filters: { value: SessionFilter; label: string }[] = [
  { value: 'all', label: 'All' }, { value: 'working', label: 'Working' },
  { value: 'needs-input', label: 'Needs input' }, { value: 'done', label: 'Completed' },
];
function SessionRow({ session, onSelect, compact = false }: { session: SessionSummary; onSelect: () => void; compact?: boolean }) {
  const t = useAppTheme();
  const status = session.state === 'working' ? 'Working' : session.state === 'needs-input' ? 'Needs input' : session.updatedLabel;
  return <ListItem colors={{ containerColor: compact ? t.surface : 'transparent', contentColor: t.text, supportingContentColor: t.secondaryText }}
    modifiers={[fillMaxWidth(), clickable(onSelect), semantics({ contentDescription: `${session.title}, ${status}, ${session.branch}` })]}>
    <ListItem.LeadingContent><RNHostView matchContents>
      <View style={{ width: 24, alignItems: 'center' }}>{session.pinned
        ? <AppSymbol name="pin" size={20} tintColor={t.secondaryText}/>
        : <ProviderIcon provider={session.provider} size={22} color={t.text}/>}</View>
    </RNHostView></ListItem.LeadingContent>
    <ListItem.OverlineContent><Text color={t.secondaryText} style={{ typography: 'labelSmall' }}>{session.model}</Text></ListItem.OverlineContent>
    <ListItem.HeadlineContent><Text color={t.text} maxLines={2} overflow="ellipsis" style={{ typography: 'titleMedium' }}>{session.title}</Text></ListItem.HeadlineContent>
    <ListItem.SupportingContent><Text color={t.secondaryText} maxLines={1} overflow="ellipsis" style={{ typography: 'bodySmall' }}>
      {session.branch + (session.linkedPullRequest ? ` · ${session.linkedPullRequest}` : '')}
    </Text></ListItem.SupportingContent>
    <ListItem.TrailingContent><Column horizontalAlignment="end" verticalArrangement={{ spacedBy: 6 }}>
      {session.state === 'working' && <RNHostView matchContents><WorkingPixels/></RNHostView>}
      <Text color={session.state === 'working' ? t.accent : session.state === 'needs-input' ? '#B77A20' : t.secondaryText}
        style={{ typography: 'labelSmall' }}>{status}</Text>
    </Column></ListItem.TrailingContent>
  </ListItem>;
}
function FolderHeader({ label, count, expanded, onToggle }: { label: string; count: number; expanded: boolean; onToggle: () => void }) {
  const t = useAppTheme();
  return <ListItem colors={{ containerColor: t.surface }} modifiers={[clickable(onToggle),
    semantics({ contentDescription: `${label}, ${count} threads, ${expanded ? 'expanded' : 'collapsed'}` })]}>
    <ListItem.LeadingContent><RNHostView matchContents><AppSymbol name={label === 'Pinned' ? 'pin' : 'folder'} tintColor={t.secondaryText}/></RNHostView></ListItem.LeadingContent>
    <ListItem.HeadlineContent><Text color={t.text} style={{ typography: 'titleSmall' }}>{label}</Text></ListItem.HeadlineContent>
    <ListItem.TrailingContent><Row horizontalArrangement={{ spacedBy: 10 }} verticalAlignment="center">
      <Text color={t.secondaryText}>{count}</Text>
      <RNHostView matchContents><AppSymbol name={expanded ? 'chevron.down' : 'chevron.right'} tintColor={t.secondaryText}/></RNHostView>
    </Row></ListItem.TrailingContent>
  </ListItem>;
}
export function SessionsScreen({ searchEnabled = false }: { searchEnabled?: boolean }) {
  const t = useAppTheme();
  const background = useChatBackground();
  const insets = useSafeAreaInsets();
  const [filterOpen, setFilterOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SessionFilter>('all');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [inboxOpen, setInboxOpen] = useState(false);
  const [newSessionOpen, setNewSessionOpen] = useState(false);
  const [context, setContext] = useState<NewSessionContext>();
  const narrowed = !!query.trim() || filter !== 'all';
  const sessions = sessionFixtures.filter(s => (filter === 'all' || s.state === filter) &&
    (s.title + ' ' + s.project + ' ' + s.branch + ' ' + s.model + ' ' + s.workspace.name + ' ' + (s.threadGroup?.name ?? '')).toLowerCase().includes(query.trim().toLowerCase()));
  const projects = groupSessionsByWorkspace(sessions);
  const expanded = (id: string) => narrowed || !collapsed[id];
  const toggle = (id: string) => setCollapsed(value => ({ ...value, [id]: !value[id] }));
  const openThread = (sessionId: string) => {
    Keyboard.dismiss();
    router.push({ pathname: searchEnabled ? '/search/thread/[sessionId]' : '/thread/[sessionId]', params: { sessionId } });
  };
  const newSession = (next?: NewSessionContext) => { setContext(next); setNewSessionOpen(true); };
  const row = (session: SessionSummary, compact = false) => <SessionRow key={session.id} session={session} compact={compact} onSelect={() => openThread(session.id)}/>;
  return <View style={{ flex: 1, backgroundColor: t.canvas }}>
    <Stack.Screen options={{ title: searchEnabled ? 'Search' : 'Sessions', headerShown: false }}/>
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {background.imageUri ? <ChatBackground empty/> : <PacmanGame opacity={0.18} fadeBottom/>}
    </View>
    <Host style={{ flex: 1 }} seedColor={t.accent}>
      <Box modifiers={[fillMaxSize()]}>
      <Column modifiers={[fillMaxSize(), padding(0, insets.top, 0, 0)]}>
        <Row modifiers={[fillMaxWidth(), padding(spacing.page, 8, spacing.page, 8)]} horizontalArrangement="spaceBetween" verticalAlignment="center">
          <Text color={t.text} style={{ typography: 'headlineLarge', fontWeight: '600' }}>{searchEnabled ? 'Search' : 'Sessions'}</Text>
          <IconButton onClick={() => setInboxOpen(true)} modifiers={[semantics({ contentDescription: 'Inbox' })]}>
            <RNHostView matchContents><AppSymbol name="tray" size={24} tintColor={t.text}/></RNHostView>
          </IconButton>
        </Row>
        {searchEnabled && <OutlinedTextField autoFocus singleLine onValueChange={setQuery}
          keyboardOptions={{ imeAction: 'search', autoCorrectEnabled: false }} keyboardActions={{ onSearch: () => Keyboard.dismiss() }}
          modifiers={[fillMaxWidth(), padding(16, 0, 16, 8)]}>
          <OutlinedTextField.Label><Text>Search sessions</Text></OutlinedTextField.Label>
        </OutlinedTextField>}
        <LazyColumn modifiers={[weight(1), fillMaxWidth()]} contentPadding={{ start: spacing.page, end: spacing.page, top: 8, bottom: 168 }}>
          {projects.flatMap(project => {
            const projectKey = 'project:' + project.id;
            const pinned = project.workspaces.flatMap(workspace => workspace.pinned);
            const pinnedKey = 'pinned:' + project.id;
            return [
              <ListItem key={projectKey} colors={{ containerColor: 'transparent' }} modifiers={[clickable(() => toggle(projectKey)),
                semantics({ contentDescription: `${project.name}, ${project.count} threads, ${expanded(projectKey) ? 'expanded' : 'collapsed'}` })]}>
                <ListItem.LeadingContent><RNHostView matchContents><ProjectMascot project={project.name} name={project.mascot} color={project.color}/></RNHostView></ListItem.LeadingContent>
                <ListItem.HeadlineContent><Text color={t.text} style={{ typography: 'titleLarge' }}>{project.name}</Text></ListItem.HeadlineContent>
                <ListItem.TrailingContent><Text color={t.secondaryText}>{project.count + (expanded(projectKey) ? ' ▾' : ' ▸')}</Text></ListItem.TrailingContent>
              </ListItem>,
              ...(expanded(projectKey) ? [
                ...project.workspaces.flatMap(workspace => workspace.groups.map(group =>
                  <Column key={group.id} modifiers={[fillMaxWidth(), padding(0, 0, 0, 14), clip(Shapes.RoundedCorner(12)), composeBackground(t.surface)]}>
                    <FolderHeader label={group.name} count={group.sessions.length} expanded={expanded(group.id)} onToggle={() => toggle(group.id)}/>
                    {expanded(group.id) && <>
                      {group.sessions.map(session => row(session, true))}
                      <TextButton modifiers={[fillMaxWidth()]} onClick={() => newSession({ project: project.name,
                        branch: group.sessions[0].branch, worktree: workspace.workspace.kind === 'worktree', group: group.name })}>
                        <Text color={t.accent}>+ New session in {group.name}</Text>
                      </TextButton>
                    </>}
                  </Column>
                )),
                ...(pinned.length ? [<Column key={pinnedKey} modifiers={[fillMaxWidth(), padding(0, 0, 0, 14), clip(Shapes.RoundedCorner(12)), composeBackground(t.surface)]}>
                  <FolderHeader label="Pinned" count={pinned.length} expanded={expanded(pinnedKey)} onToggle={() => toggle(pinnedKey)}/>
                  {expanded(pinnedKey) && pinned.map(session => row(session, true))}
                </Column>] : []),
                ...project.workspaces.flatMap(workspace => workspace.sessions).map(session => row(session)),
              ] : []),
            ];
          })}
          {!sessions.length && <Text color={t.secondaryText} modifiers={[paddingAll(24)]}>No sessions match your search.</Text>}
        </LazyColumn>
      </Column>
      <Column horizontalAlignment="end" verticalArrangement={{ spacedBy: 12 }} modifiers={[align('bottomEnd'), paddingAll(spacing.page)]}>
        <DropdownMenu expanded={filterOpen} onDismissRequest={() => setFilterOpen(false)} color={t.surface}>
          <DropdownMenu.Trigger>
            <FloatingActionButton containerColor={filter !== 'all' ? t.accentSoft : t.surface} onClick={() => setFilterOpen(true)}
              modifiers={[semantics({ contentDescription: `Filter sessions, ${filters.find(item => item.value === filter)?.label}` })]}>
              <FloatingActionButton.Icon><RNHostView matchContents>
                <AppSymbol name="line.3.horizontal.decrease" size={26} tintColor={filter !== 'all' ? t.accent : t.text}/>
              </RNHostView></FloatingActionButton.Icon>
            </FloatingActionButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Items>
            {filters.map(item => <DropdownMenuItem key={item.value} onClick={() => { setFilter(item.value); setFilterOpen(false); }}>
              <DropdownMenuItem.Text><Text color={t.text}>{item.value === 'all' ? 'All sessions' : item.label}</Text></DropdownMenuItem.Text>
              {filter === item.value && <DropdownMenuItem.TrailingIcon><RNHostView matchContents>
                <AppSymbol name="checkmark" tintColor={t.accent}/>
              </RNHostView></DropdownMenuItem.TrailingIcon>}
            </DropdownMenuItem>)}
          </DropdownMenu.Items>
        </DropdownMenu>
        <ExtendedFloatingActionButton containerColor="#3578F6" onClick={() => newSession()}
          modifiers={[semantics({ contentDescription: 'New session' })]}>
          <ExtendedFloatingActionButton.Icon><RNHostView matchContents>
            <AppSymbol name="square.and.pencil" size={24} tintColor="#FFFFFF"/>
          </RNHostView></ExtendedFloatingActionButton.Icon>
          <ExtendedFloatingActionButton.Text><Text color="#FFFFFF" style={{ typography: 'labelLarge' }}>New session</Text></ExtendedFloatingActionButton.Text>
        </ExtendedFloatingActionButton>
      </Column>
      </Box>
    </Host>
    <InboxSheet visible={inboxOpen} onClose={() => setInboxOpen(false)}/>
    <NewSessionSheet visible={newSessionOpen} context={context} onClose={() => setNewSessionOpen(false)}/>
  </View>;
}
