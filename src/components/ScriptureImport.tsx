import React, { useEffect } from 'react';
import { Alert, Text, View, ActivityIndicator } from 'react-native';
import { Button, ui, colors } from './ui';
import { useScriptureStore, loadPersonalScriptures, importPersonalScriptures, removePersonalScriptures } from '../store/scriptureStore';

export default function ScriptureImport() {
  const { pack, ready, busy, error } = useScriptureStore();
  useEffect(() => { void loadPersonalScriptures(); }, []);
  async function choose() {
    try {
      if (await importPersonalScriptures()) Alert.alert('Leitura offline pronta', '15 livros, 239 capítulos e 6.604 versículos disponíveis neste aparelho. Suas marcações e seu progresso foram preservados.');
    } catch (e) { Alert.alert('Não foi possível importar', e instanceof Error ? e.message : 'Tente selecionar o arquivo novamente.'); }
  }
  function remove() {
    Alert.alert('Remover o texto deste aparelho?', 'Seu XP, histórico de leitura e marcações serão mantidos. Você pode importar o pacote novamente.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover texto', style: 'destructive', onPress: () => { void removePersonalScriptures().catch(() => Alert.alert('Não foi possível remover', 'Tente novamente.')); } },
    ]);
  }
  return <View style={ui.card}>
    <Text style={ui.eyebrow}>{pack ? 'PRONTO PARA LER OFFLINE' : 'SEU EXEMPLAR, NO VEREDA'}</Text>
    <Text style={ui.heading}>Livro de Mórmon</Text>
    <Text style={ui.body}>{pack ? `${pack.edition}. 239 capítulos disponíveis, mesmo sem internet.` : 'Importe o arquivo Livro-de-Mormon.vereda.json preparado a partir do seu PDF. Depois, leia, marque versículos e ganhe XP aqui no app.'}</Text>
    <Text style={ui.small}>O arquivo e as marcações ficam neste aparelho. Não há sincronização com a Conta da Igreja.</Text>
    {error && <Text accessibilityRole="alert" style={ui.body}>{error}</Text>}
    {(!ready || busy) && <ActivityIndicator color={colors.green} accessibilityLabel="Preparando escrituras" />}
    <Button title={busy ? 'Preparando…' : pack ? 'Substituir arquivo de leitura' : 'Importar Livro de Mórmon'} disabled={!ready || busy} onPress={choose} />
    {pack && <Button secondary title="Remover texto importado" disabled={busy} onPress={remove} />}
  </View>;
}
