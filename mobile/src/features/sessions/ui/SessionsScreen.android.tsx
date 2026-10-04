import { useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { Host, Box, Column, Row, LazyColumn, Text, HorizontalDivider, IconButton, FloatingActionButton,
  ExtendedFloatingActionButton, DropdownMenu, DropdownMenuItem, OutlinedTextField, RNHostView } from '@expo/ui/jetpack-compose';
import { align, background as composeBackground, clip, Shapes, clickable, fillMaxSize, fillMaxWidth, padding, paddingAll, semantics, weight, defaultMinSize } from '@expo/ui/jetpack-compose/modifiers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, typography } from '@/shared/theme/theme';
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
function SessionRow({ session, onSelect, compact = false, selected = false }: {
  session: SessionSummary; onSelect: () => void; compact?: boolean; selected?: boolean;
}) {
  const t = useAppTheme();
  const working = session.state === 'working';
  const status = working ? 'Working' : session.state === 'needs-input' ? 'Needs input' : session.updatedLabel;
  return <Column modifiers={[fillMaxWidth(), padding(compact ? 4 : 0, 0, compact ? 4 : 0, 0),
    ...(compact ? [clip(Shapes.RoundedCorner(9))] : []),
    composeBackground(compact && selected ? t.elevated : 'transparent'), clickable(onSelect),
    semantics({ contentDescription: `${session.title}, ${status}, ${session.branch}` }),
    defaultMinSize({ minHeight: compact ? 78 : 100 }), padding(compact ? 12 : 2, 14, compact ? 12 : 2, 14)]}>
    <Row modifiers={[fillMaxWidth()]} verticalAlignment="center" horizontalArrangement={{ spacedBy: 7 }}>
      {session.pinned ? <RNHostView matchContents><AppSymbol name="pin" size={15} tintColor={t.secondaryText}/></RNHostView>
        : !compact && <RNHostView matchContents><ProviderIcon provider={session.provider} size={16} color={t.text}/></RNHostView>}
      <Text modifiers={[weight(1)]} color={compact ? t.text : t.secondaryText} maxLines={compact ? 2 : 1} overflow="ellipsis"
        style={compact ? { fontSize: typography.session, fontWeight: '600', letterSpacing: -0.3 } : { fontSize: 12 }}>
        {compact ? session.title : session.model}
      </Text>
      <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 4 }}>
        {working && <RNHostView matchContents><WorkingPixels/></RNHostView>}
        <Text color={working ? t.accent : session.state === 'needs-input' ? '#B77A20' : t.secondaryText} style={{ fontSize: 12 }}>{status}</Text>
      </Row>
    </Row>
    {!compact && <Text modifiers={[padding(0, 7, 0, 0)]} color={t.text} maxLines={2} overflow="ellipsis"
      style={{ fontSize: typography.session, fontWeight: '600', letterSpacing: -0.3 }}>{session.title}</Text>}
    <Row modifiers={[fillMaxWidth(), padding(0, 7, 0, 0)]} verticalAlignment="center" horizontalArrangement={{ spacedBy: 5 }}>
      <RNHostView matchContents><AppSymbol name="point.topleft.down.curvedto.point.bottomright.up" size={12} tintColor={t.tertiaryText}/></RNHostView>
      <Text modifiers={[weight(1)]} color={t.tertiaryText} maxLines={1} overflow="ellipsis" style={{ fontSize: 12 }}>{session.branch}</Text>
      {!!session.linkedPullRequest && <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 4 }}
        modifiers={[clip(Shapes.RoundedCorner(4)), composeBackground(t.accentSoft), padding(5, 3, 5, 3)]}>
        <RNHostView matchContents><AppSymbol name="arrow.triangle.pull" size={11} tintColor={t.accent}/></RNHostView>
        <Text color={t.accent} style={{ fontSize: 11 }}>{session.linkedPullRequest}</Text>
      </Row>}
    </Row>
  </Column>;
}
function FolderHeader({ label, count, expanded, working = false, onToggle }: {
  label: string; count: number; expanded: boolean; working?: boolean; onToggle: () => void;
}) {
  const t = useAppTheme();
  return <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 10 }}
    modifiers={[fillMaxWidth(), clickable(onToggle),
      semantics({ contentDescription: `${label}, ${count} threads, ${expanded ? 'expanded' : 'collapsed'}` }),
      defaultMinSize({ minHeight: 48 }), padding(12, 0, 12, 0)]}>
    <RNHostView matchContents><AppSymbol name={label === 'Pinned' ? 'pin' : expanded ? 'chevron.down' : 'folder'}
      size={label === 'Pinned' ? 17 : 16} tintColor={t.text}/></RNHostView>
    <Text modifiers={[weight(1)]} color={t.text} style={{ fontSize: 16, fontWeight: '600' }}>{label}</Text>
    {working && <RNHostView matchContents><WorkingPixels/></RNHostView>}
    <Text color={t.tertiaryText} style={{ fontSize: 13 }}>{count}</Text>
  </Row>;
}
export function SessionsScreen({ searchEnabled = false }: { searchEnabled?: boolean }) {
  const t = useAppTheme();
  const background = useChatBackground();
  const insets = useSafeAreaInsets();
  const [filterOpen, setFilterOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SessionFilter>('all');
  const [selectedSessionId, setSelectedSessionId] = useState(sessionFixtures[0].id);
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
    setSelectedSessionId(sessionId);
    Keyboard.dismiss();
    router.push({ pathname: searchEnabled ? '/search/thread/[sessionId]' : '/thread/[sessionId]', params: { sessionId } });
  };
  const newSession = (next?: NewSessionContext) => { setContext(next); setNewSessionOpen(true); };
  const row = (session: SessionSummary, compact = false) => <SessionRow key={session.id} session={session} compact={compact} selected={selectedSessionId === session.id} onSelect={() => openThread(session.id)}/>;
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
              <Row key={projectKey} verticalAlignment="center" horizontalArrangement={{ spacedBy: 8 }}
                modifiers={[fillMaxWidth(), padding(0, 5, 0, 0), clickable(() => toggle(projectKey)),
                  semantics({ contentDescription: `${project.name}, ${project.count} threads, ${expanded(projectKey) ? 'expanded' : 'collapsed'}` }),
                  defaultMinSize({ minHeight: 48 })]}>
                <RNHostView matchContents><ProjectMascot project={project.name} name={project.mascot} color={project.color}/></RNHostView>
                <Text modifiers={[weight(1)]} color={t.text} style={{ fontSize: 19, fontWeight: '600' }}>{project.name}</Text>
                <Text color={t.tertiaryText} style={{ fontSize: 13 }}>{project.count}</Text>
                <RNHostView matchContents><AppSymbol name={expanded(projectKey) ? 'chevron.down' : 'chevron.right'} size={16} tintColor={t.secondaryText}/></RNHostView>
              </Row>,
              ...(expanded(projectKey) ? [
                ...project.workspaces.flatMap(workspace => workspace.groups.map(group =>
                  <Column key={group.id} modifiers={[fillMaxWidth(), padding(0, 0, 0, 14), clip(Shapes.RoundedCorner(12)), composeBackground(t.surface)]}>
                    <FolderHeader label={group.name} count={group.sessions.length} expanded={expanded(group.id)} working={group.sessions.some(session => session.state === 'working')} onToggle={() => toggle(group.id)}/>
                    {expanded(group.id) && <>
                      {group.sessions.map(session => row(session, true))}
                      <HorizontalDivider color={t.line} thickness={StyleSheet.hairlineWidth}/>
                      <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 8 }}
                        modifiers={[fillMaxWidth(), clickable(() => newSession({ project: project.name,
                          branch: group.sessions[0].branch, worktree: workspace.workspace.kind === 'worktree', group: group.name })),
                          semantics({ contentDescription: 'New session in ' + group.name }),
                          defaultMinSize({ minHeight: 46 }), padding(14, 0, 14, 0)]}>
                        <RNHostView matchContents><AppSymbol name="plus" size={14} tintColor={t.secondaryText}/></RNHostView>
                        <Text color={t.secondaryText} style={{ fontSize: 14, fontWeight: '500' }}>New session</Text>
                      </Row>
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
